"use server";

import { z } from "zod";

const contactSchema = z.object({
  nome: z.string().trim().min(1, "Indique o seu nome."),
  email: z.string().trim().min(1, "Indique o seu e-mail.").email("E-mail inválido."),
  assunto: z.string().trim().optional(),
  mensagem: z.string().trim().min(1, "Descreva a sua necessidade ou projeto."),
});

export type ContactState = {
  success: boolean;
  errors: Partial<Record<"nome" | "email" | "mensagem", string>>;
  mailtoUrl?: string;
};

const CONTACT_EMAIL = "sales@powerfulanchor.pt";

export async function sendContactMessage(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const result = contactSchema.safeParse({
    nome: formData.get("nome"),
    email: formData.get("email"),
    assunto: formData.get("assunto"),
    mensagem: formData.get("mensagem"),
  });

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return {
      success: false,
      errors: {
        nome: fieldErrors.nome?.[0],
        email: fieldErrors.email?.[0],
        mensagem: fieldErrors.mensagem?.[0],
      },
    };
  }

  const { nome, email, assunto, mensagem } = result.data;
  const subject = encodeURIComponent(assunto || "Contacto via website");
  const body = encodeURIComponent(`Nome: ${nome}\nE-mail: ${email}\n\n${mensagem}`);
  const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

  return { success: true, errors: {}, mailtoUrl };
}
