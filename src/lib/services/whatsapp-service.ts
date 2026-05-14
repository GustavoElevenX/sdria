import { env } from "@/lib/env";

export function isWhatsappConfigured() {
  return Boolean(env.WHATSAPP_ACCESS_TOKEN && env.WHATSAPP_PHONE_NUMBER_ID && env.WHATSAPP_VERIFY_TOKEN);
}

export async function sendWhatsappTemplate(input: { to: string; templateName: string; variables: Record<string, string> }) {
  if (!isWhatsappConfigured()) {
    return {
      mocked: true,
      status: "queued",
      provider: "whatsapp-cloud-api",
      input
    };
  }

  return {
    mocked: false,
    status: "not_implemented_in_mvp",
    provider: "whatsapp-cloud-api",
    input
  };
}

export function verifyWebhookToken(token: string | null, challenge: string | null) {
  if (token && challenge && token === env.WHATSAPP_VERIFY_TOKEN) return challenge;
  return null;
}
