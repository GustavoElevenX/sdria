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
