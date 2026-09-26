"use client";

import { useState } from "react";
import { getProduct, type ProductSummary } from "@/lib/catalogue";
import { useBasket } from "../BasketProvider";
import { sendQuoteRequest } from "@/app/actions";

const CONTACT_EMAIL = "sales@powerfulanchor.pt";

export default function QuoteForm({
  mode,
  product,
}: {
  mode: "single" | "basket";
  product?: ProductSummary;
}) {
  const { items, clear } = useBasket();
  const [ok, setOk] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sending, setSending] = useState(false);
  const [invalid, setInvalid] = useState<{ nome: boolean; email: boolean }>({
    nome: false,
    email: false,
  });

  const prodLabel = product ? `${product.name} (Ref. ${product.ref})` : "";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const get = (n: string) =>
      (form.elements.namedItem(n) as HTMLInputElement | HTMLTextAreaElement | null)?.value.trim() ??
      "";

    const nome = get("nome");
    const email = get("email");
    if (!nome || !email) {
      setInvalid({ nome: !nome, email: !email });
      return;
    }

    const contact =
      `\n\nNome: ${nome}\nEmail: ${email}` +
      `\nEmpresa: ${get("empresa") || "-"}` +
      `\nTelefone: ${get("telefone") || "-"}` +
      `\n\nMensagem:\n${get("mensagem") || "-"}`;

    let subject: string;
    let body: string;
    if (mode === "basket") {
      const lines = items
        .map((b) => {
          const p = getProduct(b.id);
          return p ? `- ${p.name} (Ref. ${p.ref}) × ${b.qty}` : "";
        })
        .filter(Boolean)
        .join("\n");
      subject = `Pedido de orçamento — ${items.length} produto(s)`;
      body = `Pedido de orçamento (vários produtos)\n\nProdutos:\n${lines}${contact}`;
    } else {
      subject = `Pedido de orçamento — ${prodLabel}`;
      body = `Pedido de orçamento\n\nProduto: ${prodLabel}\nQuantidade: ${
        get("qtd") || "1"
      }${contact}`;
    }

    // 1) Tenta gravar o pedido no ERP; 2) se não for possível, abre o cliente de e-mail.
    const itens =
      mode === "basket"
        ? items.flatMap((b) => {
            const p = getProduct(b.id);
            return p ? [{ ref: p.ref, qty: b.qty }] : [];
          })
        : product
          ? [{ ref: product.ref, qty: Math.max(1, Number(get("qtd")) || 1) }]
          : [];
    setSending(true);
    let gravado = false;
    try {
      const res = await sendQuoteRequest({
        nome,
        email,
        empresa: get("empresa") || undefined,
        telefone: get("telefone") || undefined,
        mensagem: get("mensagem") || undefined,
        website: get("website"),
        itens,
      });
      gravado = res.saved;
    } catch {
      gravado = false;
    }
    setSending(false);
    if (!gravado) {
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
    }
    setSaved(gravado);
    setOk(true);
    if (mode === "basket") clear();
  }

  const clearInvalid = (field: "nome" | "email") =>
    setInvalid((v) => ({ ...v, [field]: false }));

  return (
    <form className="qform" onSubmit={onSubmit} noValidate>
      {mode === "basket" && (
        <ul className="qitems">
          {items.map((b) => {
            const p = getProduct(b.id);
            if (!p) return null;
            return (
              <li key={b.id}>
                <span>
                  {p.name} <small>({p.ref})</small>
                </span>
                <b>×{b.qty}</b>
              </li>
            );
          })}
        </ul>
      )}

      <div className="qrow">
        <div className="qfield">
          <label>Nome *</label>
          <input
            name="nome"
            type="text"
            placeholder="O seu nome"
            className={invalid.nome ? "invalid" : ""}
            onInput={() => clearInvalid("nome")}
            required
          />
        </div>
        <div className="qfield">
          <label>Email *</label>
          <input
            name="email"
            type="email"
            placeholder="email@empresa.pt"
            className={invalid.email ? "invalid" : ""}
            onInput={() => clearInvalid("email")}
            required
          />
        </div>
      </div>
      <div className="qrow">
        <div className="qfield">
          <label>Empresa</label>
          <input name="empresa" type="text" placeholder="Nome da empresa" />
        </div>
        <div className="qfield">
          <label>Telefone</label>
          <input name="telefone" type="tel" placeholder="Opcional" />
        </div>
      </div>

      {mode === "single" && (
        <div className="qrow">
          <div className="qfield">
            <label>Quantidade</label>
            <input name="qtd" type="number" min={1} defaultValue={1} />
          </div>
          <div className="qfield">
            <label>Produto</label>
            <input name="produto" type="text" value={prodLabel} readOnly />
          </div>
        </div>
      )}

      <div className="qfield">
        <label>Mensagem</label>
        <textarea name="mensagem" placeholder="Detalhes, prazos ou outras questões…" />
      </div>

      <input
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />

      <button type="submit" className="btn-primary" disabled={sending}>
        {sending ? "A enviar…" : "Enviar pedido de orçamento →"}
      </button>

      <div className={`qok${ok ? " show" : ""}`}>
        {saved ? (
          <>Pedido recebido! A nossa equipa entrará em contacto consigo brevemente.</>
        ) : (
          <>
            Preparámos um e-mail para <b>{CONTACT_EMAIL}</b> com o seu pedido.
          </>
        )}
      </div>
    </form>
  );
}
