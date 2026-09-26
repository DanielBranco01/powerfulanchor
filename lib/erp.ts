/**
 * Ligação ao ERP (Supabase): cria leads a partir dos formulários do site.
 * Usa apenas a função pública `site_criar_lead` (chave publishable, sem acesso a tabelas).
 * Se o ERP não estiver configurado ou falhar, devolve false e o site recorre ao e-mail (mailto).
 */
const URL = process.env.ERP_SUPABASE_URL;
const KEY = process.env.ERP_SUPABASE_PUBLISHABLE_KEY;

export type ErpLead = {
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  assunto?: string;
  mensagem?: string;
  itens?: { ref: string; qty: number }[];
  origem: "site-contacto" | "site-orcamento";
};

export async function criarLeadNoErp(lead: ErpLead): Promise<boolean> {
  if (!URL || !KEY) return false;
  try {
    const res = await fetch(`${URL}/rest/v1/rpc/site_criar_lead`, {
      method: "POST",
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_nome: lead.nome,
        p_email: lead.email,
        p_telefone: lead.telefone || null,
        p_empresa: lead.empresa || null,
        p_assunto: lead.assunto || null,
        p_mensagem: lead.mensagem || null,
        p_itens: lead.itens?.length ? lead.itens : null,
        p_origem: lead.origem,
      }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}
