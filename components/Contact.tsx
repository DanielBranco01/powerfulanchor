"use client";

import { useActionState, useEffect } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Reveal from "./ui/Reveal";
import SectionHead from "./ui/SectionHead";
import { sendContactMessage, type ContactState } from "@/app/actions";

const initialState: ContactState = { success: false, errors: {} };

export default function Contact() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);

  useEffect(() => {
    if (state.success && state.mailtoUrl) {
      window.location.href = state.mailtoUrl;
    }
  }, [state]);

  return (
    <section className="sec" id="contacto">
      <div className="wrap">
        <SectionHead
          eyebrow="Contacto"
          title="Fale connosco"
          description="Envie-nos a sua mensagem. Respondemos com a rapidez que nos caracteriza."
        />
        <div className="contact-grid">
          <Reveal index={0}>
            <div className="info-item">
              <div className="ii">
                <MapPin strokeWidth={2} />
              </div>
              <div>
                <div className="lbl">Morada</div>
                <div className="val">
                  Rua da Quinta da Nora 3, Loja A
                  <br />
                  2790-140 Carnaxide, Portugal
                </div>
              </div>
            </div>
            <div className="info-item">
              <div className="ii">
                <Phone strokeWidth={2} />
              </div>
              <div>
                <div className="lbl">Telefone</div>
                <a href="tel:00351211914559">+351 211 914 559</a>
                <div className="val" style={{ fontSize: ".82rem", color: "var(--color-slate)" }}>
                  Chamada para rede fixa nacional
                </div>
              </div>
            </div>
            <div className="info-item">
              <div className="ii">
                <Mail strokeWidth={2} />
              </div>
              <div>
                <div className="lbl">E-mail</div>
                <a href="mailto:sales@powerfulanchor.pt">sales@powerfulanchor.pt</a>
              </div>
            </div>
            <div className="info-item">
              <div className="ii">
                <Clock strokeWidth={2} />
              </div>
              <div>
                <div className="lbl">Horário</div>
                <div className="val">Dias úteis · 9h–18h</div>
              </div>
            </div>
          </Reveal>
          <Reveal className="form" index={1}>
            <form action={formAction} noValidate>
              <div className="row2">
                <div className="field">
                  <label htmlFor="nome">Nome</label>
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    placeholder="O seu nome"
                    defaultValue={state.values?.nome}
                    required
                    className={state.errors.nome ? "invalid" : ""}
                  />
                  {state.errors.nome && <p className="field-error">{state.errors.nome}</p>}
                </div>
                <div className="field">
                  <label htmlFor="email">E-mail</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@empresa.pt"
                    defaultValue={state.values?.email}
                    required
                    className={state.errors.email ? "invalid" : ""}
                  />
                  {state.errors.email && <p className="field-error">{state.errors.email}</p>}
                </div>
              </div>
              <input
                name="pa_extra_7f3"
                type="checkbox"
                value="1"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                data-lpignore="true"
                data-1p-ignore="true"
                data-bwignore="true"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
              />
              <div className="field">
                <label htmlFor="assunto">Assunto</label>
                <input id="assunto" name="assunto" type="text" placeholder="Como podemos ajudar?" defaultValue={state.values?.assunto} />
              </div>
              <div className="field">
                <label htmlFor="mensagem">Mensagem</label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  placeholder="Descreva a sua necessidade ou projeto…"
                  defaultValue={state.values?.mensagem}
                  required
                  className={state.errors.mensagem ? "invalid" : ""}
                />
                {state.errors.mensagem && <p className="field-error">{state.errors.mensagem}</p>}
              </div>
              {state.form && (
                <p className="field-error" role="alert">
                  {state.form}
                </p>
              )}
              <button type="submit" className="btn btn-primary" disabled={pending}>
                {pending ? "A enviar…" : "Enviar mensagem"} <span className="arrow">→</span>
              </button>
              <p className="form-note">
                A sua mensagem é enviada diretamente à nossa equipa. Se não for possível, abriremos o seu cliente de e-mail.
              </p>
              <div className={`form-ok${state.success ? " show" : ""}`}>
                {state.saved
                  ? "Obrigado! Recebemos a sua mensagem e entraremos em contacto brevemente."
                  : "Obrigado! Abrimos o seu e-mail para concluir o envio para sales@powerfulanchor.pt."}
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
