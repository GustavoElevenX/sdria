import crypto from "crypto";
import { env } from "@/lib/env";

export function isWhatsappConfigured() {
  return Boolean(env.WHATSAPP_ACCESS_TOKEN && env.WHATSAPP_PHONE_NUMBER_ID && env.WHATSAPP_VERIFY_TOKEN);
}

function whatsappEndpoint(path = "messages") {
  if (!env.WHATSAPP_PHONE_NUMBER_ID) throw new Error("WHATSAPP_PHONE_NUMBER_ID ausente");
  return `https://graph.facebook.com/v20.0/${env.WHATSAPP_PHONE_NUMBER_ID}/${path}`;
}

async function callWhatsapp(body: Record<string, unknown>) {
  if (!env.WHATSAPP_ACCESS_TOKEN) throw new Error("WHATSAPP_ACCESS_TOKEN ausente");
  const response = await fetch(whatsappEndpoint(), {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) throw new Error(`WhatsApp Cloud API falhou: ${await response.text()}`);
  return response.json();
}

export async function sendWhatsappText(input: { to: string; message: string }) {
  if (!isWhatsappConfigured()) throw new Error("WhatsApp Cloud API não configurado");
  return callWhatsapp({
    messaging_product: "whatsapp",
    to: input.to.replace(/\D/g, ""),
    type: "text",
    text: {
      preview_url: false,
      body: input.message
    }
  });
}

export async function sendWhatsappTemplate(input: { to: string; templateName: string; variables: Record<string, string>; languageCode?: string }) {
  if (!isWhatsappConfigured()) throw new Error("WhatsApp Cloud API não configurado");
  return callWhatsapp({
    messaging_product: "whatsapp",
    to: input.to.replace(/\D/g, ""),
    type: "template",
    template: {
      name: input.templateName,
      language: { code: input.languageCode ?? "pt_BR" },
      components: Object.values(input.variables).length
        ? [
            {
              type: "body",
              parameters: Object.values(input.variables).map((text) => ({ type: "text", text }))
            }
          ]
        : []
    }
  });
}

export function verifyWebhookToken(token: string | null, challenge: string | null) {
  if (token && challenge && token === env.WHATSAPP_VERIFY_TOKEN) return challenge;
  return null;
}

export async function verifyWhatsappSignature(request: Request, rawBody: string) {
  if (!env.WHATSAPP_APP_SECRET) return true;
  const signature = request.headers.get("x-hub-signature-256");
  if (!signature) return false;
  const expected = `sha256=${crypto.createHmac("sha256", env.WHATSAPP_APP_SECRET).update(rawBody).digest("hex")}`;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export function extractWhatsappMessages(payload: any) {
  const value = payload?.entry?.[0]?.changes?.[0]?.value;
  const messages = value?.messages ?? [];
  const contacts = value?.contacts ?? [];
  return messages.map((message: any) => ({
    whatsappMessageId: message.id,
    from: message.from,
    name: contacts.find((contact: any) => contact.wa_id === message.from)?.profile?.name ?? "",
    text: message.text?.body ?? message.button?.text ?? message.interactive?.button_reply?.title ?? "",
    timestamp: message.timestamp
  }));
}
