import OpenAI from "openai";
import { env } from "@/lib/env";
import { isProductionBuildPhase } from "@/lib/supabase/server";

export async function listOpenAIModels() {
  if (isProductionBuildPhase()) return [];
  if (!env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY ausente");
  const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const models = await openai.models.list();
  return models.data.map((model) => model.id).sort();
}

export async function validateConfiguredOpenAIModels() {
  const models = await listOpenAIModels();
  return {
    configured: {
      main: env.OPENAI_MODEL,
      small: env.OPENAI_SMALL_MODEL,
      embedding: env.OPENAI_EMBEDDING_MODEL
    },
    available: models,
    valid: {
      main: models.includes(env.OPENAI_MODEL),
      small: models.includes(env.OPENAI_SMALL_MODEL),
      embedding: models.includes(env.OPENAI_EMBEDDING_MODEL)
    }
  };
}
