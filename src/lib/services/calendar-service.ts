export function checkCalendarAvailability(userId: string, dateRange: { start: string; end: string }) {
  return {
    userId,
    dateRange,
    slots: [
      { startsAt: "2026-05-15T10:00:00-03:00", endsAt: "2026-05-15T10:45:00-03:00" },
      { startsAt: "2026-05-15T15:00:00-03:00", endsAt: "2026-05-15T15:45:00-03:00" },
      { startsAt: "2026-05-16T11:00:00-03:00", endsAt: "2026-05-16T11:45:00-03:00" }
    ]
  };
}

export function createCalendarEvent(data: Record<string, unknown>) {
  return {
    calendarEventId: `mock-event-${crypto.randomUUID()}`,
    status: "scheduled",
    data,
    createdAt: new Date().toISOString()
  };
}
