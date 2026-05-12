import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-custom">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src="/src/assets/donaton.png" alt="Donaton Logo" />
              <h2>Donaton</h2>
            </div>
            <p className="description-text">
              Chile se levanta ayudando.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">🌐</a>
              <a href="#" className="social-link">🔗</a>
              <a href="#" className="social-link">@</a>
            </div>
          </div>

          <div className="footer-col">
            <h5>Somos</h5>
            <ul>
              <li><Link to="/acerca-de-nosotros">Acerca de nosotros</Link></li>
              <li><Link to="/voluntarios">Voluntarios</Link></li>
              <li><Link to="/noticias">Noticias</Link></li>
              <li>Blog</li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Donar</h5>
            <ul>
              <li><Link to="/formas-de-ayudar">Formas de ayudar</Link></li>
              <li><Link to="/causas">Causas</Link></li>
              <li><Link to="/como-donar">Como donar </Link></li>
              <li><Link to="/personas-beneficiadas">Personas beneficiadas</Link></li>
            </ul>
          </div>

          <div className="footer-col footer-col--desktop">
            <h5>Soporte</h5>
            <ul>
              <li><Link to="/legal?tab=contacto">Contactanos</Link></li>
              <li><Link to="/legal?tab=ayuda">Centros de ayuda</Link></li>
              <li><Link to="/legal?tab=privacidad">Politica de privacidad</Link></li>
              <li><Link to="/legal?tab=terminos">Terminos de servicio</Link></li>
            </ul>
          </div>
        </div>

        <hr />
        <p className="copyright-text">© 2026 Todos los derechos reservados. Donaton Inc.</p>
      </div>
    </footer>
  );
}
