import { env } from "@/lib/env";
import { getCompanyId, getSupabaseAdmin } from "@/lib/supabase/server";

async function getGoogleAccessToken() {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.GOOGLE_REFRESH_TOKEN) {
    throw new Error("Google Calendar OAuth não configurado");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      refresh_token: env.GOOGLE_REFRESH_TOKEN,
      grant_type: "refresh_token"
    })
  });

  if (!response.ok) throw new Error(`Falha ao renovar token Google: ${await response.text()}`);
  const data = await response.json();
  return data.access_token as string;
}

export async function checkCalendarAvailability(userId: string, dateRange: { start: string; end: string }) {
  if (!env.GOOGLE_REFRESH_TOKEN) {
    return {
      userId,
      dateRange,
      slots: [],
      configured: false,
      error: "GOOGLE_REFRESH_TOKEN ausente"
    };
  }

  const accessToken = await getGoogleAccessToken();
  const response = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      timeMin: dateRange.start,
      timeMax: dateRange.end,
      items: [{ id: "primary" }]
    })
  });

  if (!response.ok) throw new Error(`Falha ao consultar disponibilidade: ${await response.text()}`);
  const data = await response.json();
  const busy = data.calendars?.primary?.busy ?? [];

  return {
    userId,
    dateRange,
    busy,
    slots: deriveOpenSlots(dateRange.start, dateRange.end, busy),
    configured: true
  };
}

export function getDefaultCalendarDateRange() {
  const start = new Date();
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return { start: start.toISOString(), end: end.toISOString() };
}

function deriveOpenSlots(start: string, end: string, busy: Array<{ start: string; end: string }>) {
  const slots: Array<{ startsAt: string; endsAt: string }> = [];
  const cursor = new Date(start);
  cursor.setMinutes(0, 0, 0);
  const endDate = new Date(end);

  while (cursor < endDate && slots.length < 12) {
    const hour = cursor.getHours();
    const day = cursor.getDay();
    if (day >= 1 && day <= 5 && hour >= 9 && hour <= 17) {
      const slotEnd = new Date(cursor.getTime() + 45 * 60 * 1000);
      const overlaps = busy.some((item) => new Date(item.start) < slotEnd && new Date(item.end) > cursor);
      if (!overlaps) slots.push({ startsAt: cursor.toISOString(), endsAt: slotEnd.toISOString() });
    }
    cursor.setMinutes(cursor.getMinutes() + 60);
  }

  return slots;
}

export async function createCalendarEvent(data: Record<string, any>) {
  if (!env.GOOGLE_REFRESH_TOKEN) throw new Error("GOOGLE_REFRESH_TOKEN ausente");
  const accessToken = await getGoogleAccessToken();

  const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1", {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      summary: data.title ?? "Diagnóstico comercial",
      description: data.description ?? data.notes ?? "",
      start: { dateTime: data.startsAt },
      end: { dateTime: data.endsAt },
      attendees: (data.attendees ?? []).map((email: string) => ({ email })),
      conferenceData: data.createMeet
        ? {
            createRequest: {
              requestId: crypto.randomUUID()
            }
          }
        : undefined
    })
  });

  if (!response.ok) throw new Error(`Falha ao criar evento: ${await response.text()}`);
  const event = await response.json();
  await persistMeeting(data, event.id);
  return {
    calendarEventId: event.id,
    htmlLink: event.htmlLink,
    meetLink: event.hangoutLink,
    status: "scheduled"
  };
}

async function persistMeeting(data: Record<string, any>, calendarEventId: string) {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId || !data.leadId) return;

  await supabase.from("meetings").insert({
    company_id: companyId,
    lead_id: data.leadId,
    conversation_id: data.conversationId,
    closer_id: data.closerId,
    calendar_event_id: calendarEventId,
    starts_at: data.startsAt,
    ends_at: data.endsAt,
    status: "scheduled",
    notes: data.notes
  });

  await supabase.from("leads").update({ stage: "Reunião agendada", ai_status: "scheduled" }).eq("id", data.leadId);
}
