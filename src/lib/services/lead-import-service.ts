import Papa from "papaparse";
import ExcelJS from "exceljs";
import { analyzeAndPersistLeadContext } from "@/lib/services/context-analysis-service";
import { createLead } from "@/lib/services/lead-service";
import { getCompanyId, getSupabaseAdmin } from "@/lib/supabase/server";
import { normalizePhone } from "@/lib/utils";

export type ImportedLeadRow = {
  nome?: string;
  titulo?: string;
  empresa?: string;
  telefone?: string;
  email?: string;
  etapa?: string;
  status?: string;
  origem?: string;
  responsavel?: string;
  valor?: string;
  observacoes?: string;
  historico?: string;
};

const aliases: Record<keyof ImportedLeadRow, string[]> = {
  nome: ["nome", "name", "lead", "cliente"],
  titulo: ["titulo", "title", "cargo"],
  empresa: ["empresa", "company", "company_name", "companhia"],
  telefone: ["telefone", "phone", "whatsapp", "celular"],
  email: ["email", "e-mail"],
  etapa: ["etapa", "stage", "fase"],
  status: ["status", "situação", "situacao"],
  origem: ["origem", "source", "canal"],
  responsavel: ["responsavel", "responsável", "owner"],
  valor: ["valor", "estimated_value", "ticket"],
  observacoes: ["observacoes", "observações", "notes", "notas"],
  historico: ["historico", "histórico", "history"]
};

function normalizeHeader(header: string) {
  return header.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[^a-z0-9_]/g, "_");
}

export function mapColumns(row: Record<string, unknown>): ImportedLeadRow {
  const normalizedEntries: Array<[string, unknown]> = Object.entries(row).map(([key, value]) => [normalizeHeader(key), value]);
  const result: ImportedLeadRow = {};

  for (const [target, names] of Object.entries(aliases) as Array<[keyof ImportedLeadRow, string[]]>) {
    const found = normalizedEntries.find(([key]) => names.map(normalizeHeader).includes(key));
    if (found) result[target] = String(found[1] ?? "").trim();
  }

  return result;
}

export function previewImport(rows: ImportedLeadRow[]) {
  const normalized = rows.map((row, index) => ({
    row: index + 1,
    nome: row.nome ?? "",
    empresa: row.empresa ?? "",
    telefone: normalizePhone(row.telefone),
    email: row.email ?? "",
    etapa: row.etapa ?? "Novo lead",
    status: row.status ?? "Importado",
    origem: row.origem ?? "Importação",
    responsavel: row.responsavel ?? "",
    observacoes: row.observacoes ?? "",
    historico: row.historico ?? "",
    contexto_insuficiente: !row.telefone || !row.empresa || !row.observacoes
  }));

  const seenPhones = new Set<string>();
  return normalized.map((row) => {
    const duplicated = row.telefone ? seenPhones.has(row.telefone) : false;
    if (row.telefone) seenPhones.add(row.telefone);
    return {
      ...row,
      duplicated,
      valid: Boolean(row.nome && row.telefone && !duplicated)
    };
  });
}

export async function parseLeadFile(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();

  if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as any);
    const sheet = workbook.worksheets[0];
    if (!sheet) return [];
    const headers = (sheet.getRow(1).values as unknown[]).slice(1).map((value) => String(value ?? ""));
    const rows: Record<string, unknown>[] = [];
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const values = (row.values as unknown[]).slice(1);
      rows.push(Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
    });
    return rows.map(mapColumns);
  }

  const text = buffer.toString("utf8");
  const parsed = Papa.parse<Record<string, unknown>>(text, { header: true, skipEmptyLines: true });
  if (parsed.errors.length) throw new Error(parsed.errors.map((error) => error.message).join("; "));
  return parsed.data.map(mapColumns);
}

export async function importLeadRows(rows: ImportedLeadRow[]) {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) throw new Error("Supabase não configurado");

  const preview = previewImport(rows);
  const imported = [];
  const skipped = [];

  for (const row of preview) {
    if (!row.valid) {
      skipped.push(row);
      continue;
    }

    const { data: existing, error: existingError } = await supabase
      .from("leads")
      .select("id")
      .eq("company_id", companyId)
      .eq("phone", row.telefone)
      .maybeSingle();
    if (existingError) throw existingError;

    if (existing) {
      skipped.push({ ...row, duplicated: true });
      continue;
    }

    const lead = await createLead({
      name: row.nome,
      companyName: row.empresa,
      phone: row.telefone,
      email: row.email,
      stage: row.etapa,
      status: row.status,
      source: row.origem,
      estimatedValue: Number(String(rows[row.row - 1]?.valor ?? "0").replace(/[^\d,.-]/g, "").replace(",", ".")) || 0
    });

    await supabase.from("lead_contexts").insert({
      company_id: companyId,
      lead_id: lead.id,
      internal_notes: row.observacoes,
      commercial_context: row.historico,
      ready_for_outreach: false
    });

    await analyzeAndPersistLeadContext(lead.id);
    imported.push(lead);
  }

  return { imported, skipped, preview };
}
