import { NextResponse } from "next/server";
import { env } from "@/lib/env";

type SecretKind = "cron" | "webhook";

function expectedSecret(kind: SecretKind) {
  return kind === "cron" ? env.CRON_SECRET : env.WEBHOOK_SECRET;
}

export function isAuthorizedRequest(request: Request, kind: SecretKind) {
  if (env.NODE_ENV !== "production") return true;
  const secret = expectedSecret(kind);
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  const header = request.headers.get(kind === "cron" ? "x-cron-secret" : "x-webhook-secret");
  return auth === `Bearer ${secret}` || header === secret;
}

export function unauthorized() {
  return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
}
