/**
 * Aviso por email quando entra um pedido do site (via Resend).
 * Desligado por omissão: só envia se RESEND_API_KEY, LEAD_NOTIFY_TO e LEAD_NOTIFY_FROM estiverem definidas
 * (variáveis de servidor). Falhar nunca pode impedir o pedido de ser gravado: devolve false e regista o motivo.
 *
 *   RESEND_API_KEY   chave da API do Resend
 *   LEAD_NOTIFY_TO   destinatário(s), separados por vírgula
 *   LEAD_NOTIFY_FROM remetente (ex.: "Powerful Anchor <no-reply@powerfulanchor.pt>" ou onboarding@resend.dev)
 *   ERP_APP_URL      opcional; https://powerfulanchor-erp.netlify.app → link para os leads no ERP
 */
export type NovoLead = {
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  assunto?: string;
  mensagem?: string;
  itens?: { ref: string; qty: number }[];
  origem: "site-contacto" | "site-orcamento";
};

const ESC: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ESC[c]);

export function montarEmail(lead: NovoLead, erpUrl?: string) {
  const tipo = lead.origem === "site-orcamento" ? "Pedido de orçamento" : "Mensagem de contacto";
  const linhas: [string, string][] = [
    ["Nome", lead.nome],
    ["Email", lead.email],
    ["Telefone", lead.telefone ?? "—"],
    ["Empresa", lead.empresa ?? "—"],
    ["Assunto", lead.assunto ?? "—"],
  ];
  const itens = lead.itens?.length ? lead.itens.map((i) => `${i.ref} × ${i.qty}`).join("\n") : "";
  const link = erpUrl ? `${erpUrl.replace(/\/$/, "")}/leads?f=Novo` : "";

  const html = `<div style="font-family:system-ui,sans-serif;max-width:560px">
<h2 style="margin:0 0 12px">${esc(tipo)} — novo lead do site</h2>
<table style="border-collapse:collapse;width:100%">${linhas
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td><b>${esc(v)}</b></td></tr>`)
    .join("")}</table>
${lead.mensagem ? `<p style="white-space:pre-wrap;background:#f7f5f9;padding:12px;border-radius:8px">${esc(lead.mensagem)}</p>` : ""}
${itens ? `<p><b>Artigos pedidos</b></p><pre style="background:#f7f5f9;padding:12px;border-radius:8px">${esc(itens)}</pre>` : ""}
${link ? `<p><a href="${esc(link)}">Abrir no ERP</a></p>` : ""}
</div>`;

  const text = [
    `${tipo} — novo lead do site`,
    ...linhas.map(([k, v]) => `${k}: ${v}`),
    lead.mensagem ? `\nMensagem:\n${lead.mensagem}` : "",
    itens ? `\nArtigos pedidos:\n${itens}` : "",
    link ? `\nAbrir no ERP: ${link}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return { subject: `Novo ${tipo.toLowerCase()} do site: ${lead.nome}`, html, text };
}

export async function notificarNovoLead(lead: NovoLead): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_TO;
  const from = process.env.LEAD_NOTIFY_FROM;
  if (!key || !to || !from) return false; // desligado

  const destinatarios = to.split(",").map((s) => s.trim()).filter(Boolean);
  if (!destinatarios.length) return false;
  const { subject, html, text } = montarEmail(lead, process.env.ERP_APP_URL);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: destinatarios, reply_to: lead.email, subject, html, text }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error("[notify] o Resend recusou o envio, estado HTTP", res.status);
    return res.ok;
  } catch (e) {
    console.error("[notify] falha no envio:", e instanceof Error ? e.name : "erro");
    return false;
  }
}
