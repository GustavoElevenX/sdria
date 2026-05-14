import OpenAI from "openai";
import { env } from "@/lib/env";
import { getCompanyId, getSupabaseAdmin } from "@/lib/supabase/server";
import { mapKnowledgeDocument } from "@/lib/supabase/mappers";
import type { KnowledgeDocument } from "@/lib/types";

export async function getKnowledgeDocuments(): Promise<KnowledgeDocument[]> {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) return [];

  const { data, error } = await supabase
    .from("knowledge_documents")
    .select("*")
    .eq("company_id", companyId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapKnowledgeDocument);
}

export async function upsertKnowledgeDocument(input: Partial<KnowledgeDocument> & { id?: string }) {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) throw new Error("Supabase não configurado");

  const { data, error } = await supabase
    .from("knowledge_documents")
    .upsert({
      id: input.id,
      company_id: companyId,
      title: input.title,
      type: input.type,
      content: input.content,
      tags: input.tags ?? [],
      active: input.active ?? true,
      updated_at: new Date().toISOString()
    })
    .select("*")
    .single();

  if (error) throw error;
  await generateKnowledgeChunks(data.id, data.content ?? "", data.tags ?? []);
  return mapKnowledgeDocument(data);
}

export async function deleteKnowledgeDocument(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase não configurado");
  const { error } = await supabase.from("knowledge_documents").delete().eq("id", id);
  if (error) throw error;
  return { id, deleted: true };
}

function chunkText(content: string) {
  const paragraphs = content.split(/\n{2,}/).map((item) => item.trim()).filter(Boolean);
  const chunks: string[] = [];
  let buffer = "";

  for (const paragraph of paragraphs.length ? paragraphs : [content]) {
    if (`${buffer}\n\n${paragraph}`.length > 1200 && buffer) {
      chunks.push(buffer);
      buffer = paragraph;
    } else {
      buffer = buffer ? `${buffer}\n\n${paragraph}` : paragraph;
    }
  }
  if (buffer) chunks.push(buffer);
  return chunks;
}

async function embedTexts(texts: string[]) {
  if (!env.OPENAI_API_KEY) return texts.map(() => null);
  const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const response = await openai.embeddings.create({
    model: env.OPENAI_EMBEDDING_MODEL,
    input: texts
  });
  return response.data.map((item) => item.embedding);
}

export async function generateKnowledgeChunks(documentId: string, content: string, tags: string[]) {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId || !content.trim()) return [];

  const chunks = chunkText(content);
  const embeddings = await embedTexts(chunks);
  await supabase.from("knowledge_chunks").delete().eq("document_id", documentId);

  const rows = chunks.map((chunk, index) => ({
    document_id: documentId,
    company_id: companyId,
    content: chunk,
    embedding: embeddings[index],
    tags
  }));

  const { data, error } = await supabase.from("knowledge_chunks").insert(rows).select("*");
  if (error) throw error;
  return data ?? [];
}

export async function searchKnowledgeBase(query: string): Promise<KnowledgeDocument[]> {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) return [];

  if (env.OPENAI_API_KEY) {
    const [embedding] = await embedTexts([query]);
    if (embedding) {
      const { data, error } = await supabase.rpc("match_knowledge_chunks", {
        query_embedding: embedding,
        match_company_id: companyId,
        match_count: 6
      });
      if (error) throw error;
      return (data ?? []).map((row: Record<string, unknown>) => ({
        id: String(row.document_id),
        title: "Trecho da base de conhecimento",
        type: "RAG",
        content: String(row.content),
        tags: (row.tags as string[]) ?? [],
        active: true,
        updatedAt: new Date().toISOString()
      }));
    }
  }

  const documents = await getKnowledgeDocuments();
  const terms = query.toLowerCase().split(/\s+/).filter((term) => term.length > 3);
  return documents
    .filter((document) => document.active)
    .map((document) => {
      const searchable = `${document.title} ${document.type} ${document.content} ${document.tags.join(" ")}`.toLowerCase();
      const score = terms.filter((term) => searchable.includes(term)).length;
      return { document, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.document);
}
