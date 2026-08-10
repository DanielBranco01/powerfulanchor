"use client";

import { useCatalogue } from "./context";
import QuoteForm from "./QuoteForm";

export default function QuoteModal() {
  const { modalOpen, closeModal, items } = useCatalogue();

  return (
    <div
      className={`modal-bg${modalOpen ? " show" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div className="modal">
        <button className="x" onClick={closeModal} aria-label="Fechar">
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        {modalOpen && (
          <>
            <div className="ico">
              <svg
                viewBox="0 0 24 24"
                width="26"
                height="26"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6M9 15l2 2 4-4" />
              </svg>
            </div>
            <h3>Pedir orçamento</h3>
            <p style={{ color: "var(--slate)", marginBottom: "14px", fontSize: ".95rem" }}>
              Pedido para {items.length} produto(s). Enviamos-lhe preço e disponibilidade.
            </p>
            <QuoteForm mode="basket" />
          </>
        )}
      </div>
    </div>
  );
}
