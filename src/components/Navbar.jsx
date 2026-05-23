import { Link } from 'react-router-dom';
import { useState } from 'react';
import AnnouncementBar from './AnnouncementBar';
import './Navbar.css';

export default function Navbar({ theme, onToggleTheme }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <AnnouncementBar />
      <nav className="navbar">
        <div className="container-fluid navbar-inner">
          <Link to="/" className="title">
            <img className="logo" src="/src/assets/donaton.png" alt="Logo Donaton" />
            <h2 className="title-text animate__animated animate__bounceInLeft">Donaton</h2>
          </Link>

          <div className="mobile-controls">
            <button
              type="button"
              className="theme-toggle mobile-only"
              onClick={onToggleTheme}
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
            <Link to="/login" className="btn-login">Iniciar Sesion</Link>
            <button
              className={`hamburger ${open ? 'open' : ''}`}
              onClick={() => setOpen(!open)}
              aria-label="Toggle navigation"
            >
              <span /><span /><span />
            </button>
          </div>

          <div className={`nav-menu ${open ? 'nav-menu--open' : ''}`}>
            <ul className="nav-links">
              <li><Link className="nav-link" to="/donaciones" onClick={() => setOpen(false)}>Donaciones</Link></li>
              <li><Link className="nav-link" to="/acerca-de-nosotros" onClick={() => setOpen(false)}>Acerca de nosotros</Link></li>
              <li><Link className="nav-link" to="/sea-voluntario" onClick={() => setOpen(false)}>Sea Voluntario</Link></li>
              <li><Link className="nav-link" to="/comunidad" onClick={() => setOpen(false)}>Comunidad</Link></li>
            </ul>
            <button
              type="button"
              className="theme-toggle desktop-only"
              onClick={onToggleTheme}
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
            <Link to="/login" className="btn-login desktop-only">Iniciar Sesión</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
