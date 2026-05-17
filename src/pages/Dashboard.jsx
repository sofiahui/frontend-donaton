import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Truck, AlertTriangle, Building2, Gift, HandHelping, MapPin, ClipboardList } from 'lucide-react';
import './Dashboard.css';
import Footer from '../components/Footer';
 
function useInView(ref, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}
 
export default function Dashboard() {
  const navigate = useNavigate();
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, 0.2);
 
  const username = localStorage.getItem('username') || 'Usuario';
 
  const [donaciones, setDonaciones] = useState([]);
  const [envios, setEnvios]         = useState([]);
  const [centros, setCentros]       = useState([]);
  const [necesidades, setNecesidades] = useState([]);
  const [loading, setLoading]       = useState(true);
 
  const token = localStorage.getItem('token');
 
  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch('http://localhost:8080/donaciones', { headers }).then(r => r.json()).catch(() => []),
      fetch('http://localhost:8080/envios',     { headers }).then(r => r.json()).catch(() => []),
      fetch('http://localhost:8080/centros',    { headers }).then(r => r.json()).catch(() => []),
      fetch('http://localhost:8080/necesidades',{ headers }).then(r => r.json()).catch(() => []),
    ]).then(([d, e, c, n]) => {
      setDonaciones(Array.isArray(d) ? d : []);
      setEnvios(Array.isArray(e) ? e : []);
      setCentros(Array.isArray(c) ? c : []);
      setNecesidades(Array.isArray(n) ? n : []);
      setLoading(false);
    });
  }, [token]);
 
  const centrosActivos   = centros.filter(c => c.estado === 'activo').length;
  const enviosPendientes = envios.filter(e => e.estado === 'pendiente' || e.estado === 'en_camino').length;
  const necPendientes    = necesidades.filter(n => n.estado === 'pendiente').length;
 
  const actividadReciente = [
    ...donaciones.slice(-3).map(d => ({
      tipo: 'donacion',
      titulo: `Donación — ${d.tipoDonacion} × ${d.cantidad}`,
      subtitulo: `${d.centroAcopio} · ${d.fecha}`,
      estado: 'completado',
    })),
    ...envios.slice(-2).map(e => ({
      tipo: 'envio',
      titulo: `Envío — ${e.origen} → ${e.destino}`,
      subtitulo: `${e.tipoTransporte} · ${e.fechaEnvio}`,
      estado: e.estado,
    })),
    ...necesidades.slice(-2).map(n => ({
      tipo: 'necesidad',
      titulo: `Necesidad — ${n.recurso} × ${n.cantidad}`,
      subtitulo: `${n.ubicacion}, ${n.region} · ${n.fechaReporte}`,
      estado: n.estado,
    })),
  ].slice(-5).reverse();
 
  const badgeClass = (estado) => {
    if (estado === 'completado' || estado === 'entregado' || estado === 'atendida') return 'badge badge--success';
    if (estado === 'en_camino' || estado === 'en_proceso') return 'badge badge--warning';
    return 'badge badge--danger';
  };
 
  const iconoActividad = (tipo) => {
    if (tipo === 'donacion')  return <Gift size={16} color="#fff" />;
    if (tipo === 'envio')     return <Truck size={16} color="#fff" />;
    return <AlertTriangle size={16} color="#fff" />;
  };
 
  const colorActividad = (tipo) => {
    if (tipo === 'donacion')  return '#e63946';
    if (tipo === 'envio')     return '#1a3f72';
    return '#e63946';
  };
 
  return (
    <div className="dash-wrapper">
 
      {/* ── Bienvenida ─────────────────────────── */}
      <section className="dash-hero">
        <div className="dash-hero__inner">
          <div className="dash-hero__avatar">
            {username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="dash-hero__label">Bienvenido/a de vuelta</p>
            <h1 className="dash-hero__name">{username}</h1>
          </div>
        </div>
        <p className="dash-hero__subtitle">
          Desde aquí puedes gestionar tus donaciones, consultar centros de acopio,
          hacer seguimiento de envíos y reportar necesidades.
        </p>
      </section>
 
      {/* ── Stats ──────────────────────────────── */}
      <section className="dash-section">
        <div className="dash-container">
          <div className="dash-stats" ref={statsRef}>
            {[
              { icon: <Package size={22} />,       value: loading ? '—' : donaciones.length, label: 'Mis donaciones',       color: '#e63946' },
              { icon: <Building2 size={22} />,     value: loading ? '—' : centrosActivos,    label: 'Centros activos',      color: '#0f2a4f' },
              { icon: <Truck size={22} />,         value: loading ? '—' : enviosPendientes,  label: 'Envíos en curso',      color: '#1a3f72' },
              { icon: <AlertTriangle size={22} />, value: loading ? '—' : necPendientes,     label: 'Solicitudes pendientes', color: '#e63946' },
            ].map((s, i) => (
              <div
                key={i}
                className={`dash-stat ${statsInView ? 'dash-stat--visible' : ''}`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="dash-stat__icon" style={{ background: `${s.color}18`, color: s.color }}>
                  {s.icon}
                </div>
                <div>
                  <p className="dash-stat__value">{s.value}</p>
                  <p className="dash-stat__label">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* ── Acciones principales ───────────────── */}
      <section className="dash-section">
        <div className="dash-container">
          <h2 className="dash-section__title">¿Qué quieres hacer hoy?</h2>
          <div className="dash-actions">
 
            <Link to="/donaciones" className="dash-action">
              <div className="dash-action__icon" style={{ background: 'rgba(230,57,70,0.10)', color: '#e63946' }}>
                <Gift size={28} />
              </div>
              <div>
                <p className="dash-action__title">Hacer una donación</p>
                <p className="dash-action__desc">Ropa, alimento, medicamento y más</p>
              </div>
              <span className="dash-action__arrow">›</span>
            </Link>
 
            <Link to="/necesidades" className="dash-action">
              <div className="dash-action__icon" style={{ background: 'rgba(230,57,70,0.10)', color: '#e63946' }}>
                <HandHelping size={28} />
              </div>
              <div>
                <p className="dash-action__title">Necesito ayuda</p>
                <p className="dash-action__desc">Reporta tu necesidad y ubicación</p>
              </div>
              <span className="dash-action__arrow">›</span>
            </Link>
 
            <Link to="/logistica" className="dash-action">
              <div className="dash-action__icon" style={{ background: 'rgba(15,42,79,0.08)', color: '#0f2a4f' }}>
                <MapPin size={28} />
              </div>
              <div>
                <p className="dash-action__title">Centros de acopio</p>
                <p className="dash-action__desc">Encuentra el más cercano a ti</p>
              </div>
              <span className="dash-action__arrow">›</span>
            </Link>
 
            <Link to="/logistica" className="dash-action">
              <div className="dash-action__icon" style={{ background: 'rgba(15,42,79,0.08)', color: '#0f2a4f' }}>
                <ClipboardList size={28} />
              </div>
              <div>
                <p className="dash-action__title">Seguimiento de envíos</p>
                <p className="dash-action__desc">Consulta el estado de tu solicitud</p>
              </div>
              <span className="dash-action__arrow">›</span>
            </Link>
 
          </div>
        </div>
      </section>
 
      {/* ── Actividad reciente ─────────────────── */}
      <section className="dash-section">
        <div className="dash-container">
          <h2 className="dash-section__title">Actividad reciente</h2>
 
          {loading ? (
            <p className="dash-empty">Cargando actividad...</p>
          ) : actividadReciente.length === 0 ? (
            <div className="dash-empty-box">
              <Package size={32} color="#94a3b8" />
              <p>Aún no tienes actividad registrada.</p>
              <Link to="/donaciones" className="dash-cta-btn">Hacer tu primera donación</Link>
            </div>
          ) : (
            <div className="dash-activity">
              {actividadReciente.map((item, i) => (
                <div key={i} className="dash-activity__item">
                  <div
                    className="dash-activity__icon"
                    style={{ background: colorActividad(item.tipo) }}
                  >
                    {iconoActividad(item.tipo)}
                  </div>
                  <div className="dash-activity__info">
                    <p className="dash-activity__title">{item.titulo}</p>
                    <p className="dash-activity__sub">{item.subtitulo}</p>
                  </div>
                  <span className={badgeClass(item.estado)}>{item.estado}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
 
      {/* ── CTA ────────────────────────────────── */}
      <section className="dash-section">
        <div className="dash-container">
          <div className="dash-cta">
            <div className="dash-cta__content">
              <h2>¿Conoces a alguien que necesita ayuda?</h2>
              <p>Reporta una necesidad en terreno y nos aseguramos de que llegue asistencia a tiempo.</p>
              <Link to="/necesidades" className="dash-cta-btn">Reportar necesidad</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
    
  );
}