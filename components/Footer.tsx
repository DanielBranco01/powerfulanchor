export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <div className="foot-plate">
              <span className="brand-logo" role="img" aria-label="Powerful Anchor" />
            </div>
            <p>
              Distribuição e comercialização de produtos para redes de comunicações. Dê POWER ao
              seu negócio.
            </p>
            <div className="socials">
              <a
                href="https://www.linkedin.com/company/powerful-anchor/"
                target="_blank"
                rel="noopener"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3 0-2.95-1.8-2.95s-2.08 1.4-2.08 2.85V21H9z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/powerful_anchor/"
                target="_blank"
                rel="noopener"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="mailto:sales@powerfulanchor.pt" aria-label="E-mail">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m2 7 10 6 10-6" />
                </svg>
              </a>
            </div>
          </div>
          <div className="foot-col">
            <h5>Empresa</h5>
            <ul>
              <li>
                <a href="#sobre">Quem somos</a>
              </li>
              <li>
                <a href="#diferenciais">Porquê nós</a>
              </li>
              <li>
                <a href="#contacto">Contactos</a>
              </li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>Produtos</h5>
            <ul>
              <li>
                <a href="#servicos">Redes de Dados</a>
              </li>
              <li>
                <a href="#servicos">Áudio e Vídeo</a>
              </li>
              <li>
                <a href="#servicos">Sistemas de RF</a>
              </li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>Marcas</h5>
            <ul>
              <li>
                <a href="#top">Digitus</a>
              </li>
              <li>
                <a href="#top">HellermannTyton</a>
              </li>
              <li>
                <a href="#top">RFS · Brady · Roxtec</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {year} Powerful Anchor. Todos os direitos reservados.</span>
          <span>Rua da Quinta da Nora 3, Loja A · Carnaxide</span>
        </div>
      </div>
    </footer>
  );
}
