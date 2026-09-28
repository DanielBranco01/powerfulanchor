// Teste do aviso por email (com fetch simulado; não envia nada).  node --test scripts/test-notify.mjs
import assert from "node:assert/strict";
import { test, beforeEach } from "node:test";
import { montarEmail, notificarNovoLead } from "../lib/notify.ts";

const lead = {
  nome: 'Ana <script>alert(1)</script>',
  email: "ana@exemplo.pt",
  telefone: "+351 910 000 000",
  assunto: "Orçamento",
  mensagem: "Preciso de 10 cabos & racks",
  itens: [{ ref: "ACU-4511-305", qty: 10 }],
  origem: "site-orcamento",
};

const limpar = () => {
  for (const k of ["RESEND_API_KEY", "LEAD_NOTIFY_TO", "LEAD_NOTIFY_FROM", "ERP_APP_URL"]) delete process.env[k];
};
beforeEach(limpar);

test("desligado sem variáveis: não chama o Resend", async () => {
  let chamado = false;
  globalThis.fetch = async () => ((chamado = true), new Response("{}"));
  assert.equal(await notificarNovoLead(lead), false);
  assert.equal(chamado, false);
});

test("montarEmail escapa HTML e inclui artigos e link do ERP", () => {
  const m = montarEmail(lead, "https://erp.exemplo/");
  assert.ok(!m.html.includes("<script>"));
  assert.ok(m.html.includes("&lt;script&gt;"));
  assert.ok(m.html.includes("Preciso de 10 cabos &amp; racks"));
  assert.ok(m.html.includes("ACU-4511-305 × 10"));
  assert.ok(m.text.includes("https://erp.exemplo/leads?f=Novo"));
  assert.match(m.subject, /pedido de orçamento/i);
});

test("envia com os campos certos e responde a quem escreveu", async () => {
  Object.assign(process.env, { RESEND_API_KEY: "re_teste", LEAD_NOTIFY_TO: "a@x.pt, b@x.pt", LEAD_NOTIFY_FROM: "Site <no-reply@x.pt>" });
  let pedido;
  globalThis.fetch = async (url, init) => ((pedido = { url, init }), new Response("{}", { status: 200 }));
  assert.equal(await notificarNovoLead(lead), true);
  assert.equal(pedido.url, "https://api.resend.com/emails");
  assert.equal(pedido.init.headers.Authorization, "Bearer re_teste");
  const corpo = JSON.parse(pedido.init.body);
  assert.deepEqual(corpo.to, ["a@x.pt", "b@x.pt"]);
  assert.equal(corpo.reply_to, "ana@exemplo.pt");
  assert.equal(corpo.from, "Site <no-reply@x.pt>");
});

test("falhas (HTTP 4xx ou rede) devolvem false sem lançar", async () => {
  Object.assign(process.env, { RESEND_API_KEY: "re_teste", LEAD_NOTIFY_TO: "a@x.pt", LEAD_NOTIFY_FROM: "s@x.pt" });
  globalThis.fetch = async () => new Response("{}", { status: 422 });
  assert.equal(await notificarNovoLead(lead), false);
  globalThis.fetch = async () => {
    throw new Error("sem rede");
  };
  assert.equal(await notificarNovoLead(lead), false);
});
