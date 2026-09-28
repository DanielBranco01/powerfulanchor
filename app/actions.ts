"use server";

import { z } from "zod";
import { criarLeadNoErp } from "@/lib/erp";
import { notificarNovoLead } from "@/lib/notify";

const contactSchema = z.object({
  nome: z.string().trim().min(1, "Indique o seu nome."),
  email: z.string().trim().min(1, "Indique o seu e-mail.").email("E-mail inválido."),
  assunto: z.string().trim().optional(),
  mensagem: z.string().trim().min(1, "Descreva a sua necessidade ou projeto."),
});

export type ContactState = {
  success: boolean;
  errors: Partial<Record<"nome" | "email" | "mensagem", string>>;
  /** true quando o pedido ficou gravado no ERP (não é preciso abrir o e-mail). */
  saved?: boolean;
  /** Erro geral (não associado a um campo). */
  form?: string;
  /** Valores submetidos, para não perder o que o utilizador escreveu. */
  values?: { nome: string; email: string; assunto: string; mensagem: string };
  mailtoUrl?: string;
};

const CONTACT_EMAIL = "sales@powerfulanchor.pt";

export async function sendContactMessage(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Campo-armadilha para bots: os humanos não o veem nem preenchem.
  if (String(formData.get("pa_extra_7f3") ?? "").trim() !== "") {
    console.warn("[contacto] campo-armadilha preenchido; pedido ignorado.");
    return { success: true, errors: {}, saved: true };
  }

  const values = {
    nome: String(formData.get("nome") ?? ""),
    email: String(formData.get("email") ?? ""),
    assunto: String(formData.get("assunto") ?? ""),
    mensagem: String(formData.get("mensagem") ?? ""),
  };

  const result = contactSchema.safeParse({
    nome: formData.get("nome"),
    email: formData.get("email"),
    assunto: formData.get("assunto"),
    mensagem: formData.get("mensagem"),
  });

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    const errors = {
      nome: fieldErrors.nome?.[0],
      email: fieldErrors.email?.[0],
      mensagem: fieldErrors.mensagem?.[0],
    };
    const semCampo = !errors.nome && !errors.email && !errors.mensagem;
    return {
      success: false,
      errors,
      values,
      form: semCampo ? "Não foi possível validar o pedido. Verifique os dados e tente novamente." : undefined,
    };
  }

  const { nome, email, assunto, mensagem } = result.data;

  const saved = await criarLeadNoErp({ nome, email, assunto, mensagem, origem: "site-contacto" });
  if (saved) {
    await notificarNovoLead({ nome, email, assunto, mensagem, origem: "site-contacto" }); // nunca lança
    return { success: true, errors: {}, saved: true };
  }

  const subject = encodeURIComponent(assunto || "Contacto via website");
  const body = encodeURIComponent(`Nome: ${nome}\nE-mail: ${email}\n\n${mensagem}`);
  const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

  return { success: true, errors: {}, mailtoUrl };
}

const quoteSchema = z.object({
  nome: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  empresa: z.string().trim().max(160).optional(),
  telefone: z.string().trim().max(40).optional(),
  mensagem: z.string().trim().max(4000).optional(),
  website: z.string().optional(),
  itens: z
    .array(z.object({ ref: z.string().trim().min(1).max(80), qty: z.number().int().min(1).max(100000) }))
    .max(50),
});

/** Pedido de orçamento (cesto ou produto único). Devolve saved=false se o ERP não aceitou: o cliente cai para mailto. */
export async function sendQuoteRequest(input: z.input<typeof quoteSchema>): Promise<{ saved: boolean }> {
  const parsed = quoteSchema.safeParse(input);
  if (!parsed.success) return { saved: false };
  const q = parsed.data;
  if (q.website) return { saved: true }; // bot
  const saved = await criarLeadNoErp({
    nome: q.nome,
    email: q.email,
    empresa: q.empresa,
    telefone: q.telefone,
    mensagem: q.mensagem,
    assunto: "Pedido de orçamento",
    itens: q.itens,
    origem: "site-orcamento",
  });
  if (saved) {
    await notificarNovoLead({
      nome: q.nome,
      email: q.email,
      empresa: q.empresa,
      telefone: q.telefone,
      mensagem: q.mensagem,
      assunto: "Pedido de orçamento",
      itens: q.itens,
      origem: "site-orcamento",
    });
  }
  return { saved };
}
