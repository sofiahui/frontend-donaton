import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Truck, Plus, ChevronRight, X, MapPin } from 'lucide-react';
import './Logistica.css';

const TRANSPORTES = ['camion', 'furgon', 'moto'];

export default function Logistica() {
  const [tab, setTab]           = useState('centros');
  const [centros, setCentros]   = useState([]);
  const [envios, setEnvios]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito]       = useState(false);

  const [formEnvio, setFormEnvio] = useState({
    tipoTransporte: '', origen: '', destino: '', centroAcopioId: '',
  });

  const token = localStorage.getItem('token');

  const cargar = () => {
    Promise.all([
      fetch('http://localhost:8080/centros', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => []),
      fetch('http://localhost:8080/envios',  { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => []),
    ]).then(([c, e]) => {
      setCentros(Array.isArray(c) ? c : []);
      setEnvios(Array.isArray(e) ? e : []);
      setLoading(false);
    });
  };

  useEffect(() => { cargar(); }, []);

  const handleChange = e => setFormEnvio({ ...formEnvio, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setEnviando(true);
    try {
      await fetch('http://localhost:8080/envios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...formEnvio, centroAcopioId: parseInt(formEnvio.centroAcopioId) }),
      });
      setExito(true);
      setFormEnvio({ tipoTransporte: '', origen: '', destino: '', centroAcopioId: '' });
      cargar();
      setTimeout(() => { setExito(false); setShowForm(false); }, 2000);
    } catch {
      alert('Error al crear el envío');
    }
    setEnviando(false);
  };

  const estadoEnvio = (estado) => {
    if (estado === 'entregado')  return { bg: 'rgba(16,185,129,0.10)', color: '#065f46' };
    if (estado === 'en_camino')  return { bg: 'rgba(245,158,11,0.10)', color: '#92400e' };
    return { bg: 'rgba(230,57,70,0.10)', color: '#c1121f' };
  };

  const estadoCentro = (estado) => estado === 'activo'
    ? { bg: 'rgba(16,185,129,0.10)', color: '#065f46' }
    : { bg: 'rgba(100,116,139,0.10)', color: '#475569' };

  const capacidadPct = (c) => Math.round((c.capacidadActual / c.capacidadMaxima) * 100) || 0;

  return (
    <div className="page-wrapper">

      {/* ── Hero ───────────────────────────────── */}
      <section className="page-hero">
        <div className="page-hero__inner">
          <div className="page-hero__icon"><Truck size={28} color="#e63946" /></div>
          <div>
            <h1 className="page-hero__title">Logística y Distribución</h1>
            <p className="page-hero__sub">Centros de acopio activos y seguimiento de envíos</p>
          </div>
        </div>
        <button className="page-hero__btn" onClick={() => setShowForm(true)}>
          <Plus size={18} /> Nuevo envío
        </button>
      </section>

      {/* ── Breadcrumb ─────────────────────────── */}
      <div className="breadcrumb">
        <Link to="/dashboard">Panel</Link>
        <ChevronRight size={14} />
        <span>Logística</span>
      </div>

      {/* ── Tabs ───────────────────────────────── */}
      <div className="page-container" style={{ marginTop: '1.5rem' }}>
        <div className="tabs">
          <button
            className={`tab ${tab === 'centros' ? 'tab--active' : ''}`}
            onClick={() => setTab('centros')}
          >
            <Building2 size={16} /> Centros de acopio
          </button>
          <button
            className={`tab ${tab === 'envios' ? 'tab--active' : ''}`}
            onClick={() => setTab('envios')}
          >
            <Truck size={16} /> Mis envíos
          </button>
        </div>
      </div>

      {/* ── Modal nuevo envío ──────────────────── */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h2>Nuevo envío</h2>
              <button className="modal__close" onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>

            {exito ? (
              <div className="modal__exito">
                <div className="modal__exito-icon">✓</div>
                <p>¡Envío creado exitosamente!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="modal__form">
                <div className="field">
                  <label>Tipo de transporte</label>
                  <select name="tipoTransporte" value={formEnvio.tipoTransporte} onChange={handleChange} required>
                    <option value="">Selecciona transporte</option>
                    {TRANSPORTES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>

                <div className="field">
                  <label>Origen</label>
                  <input type="text" name="origen" placeholder="Ciudad o dirección de origen"
                    value={formEnvio.origen} onChange={handleChange} required />
                </div>

                <div className="field">
                  <label>Destino</label>
                  <input type="text" name="destino" placeholder="Ciudad o dirección de destino"
                    value={formEnvio.destino} onChange={handleChange} required />
                </div>

                <div className="field">
                  <label>Centro de acopio asignado</label>
                  <select name="centroAcopioId" value={formEnvio.centroAcopioId} onChange={handleChange} required>
                    <option value="">Selecciona un centro</option>
                    {centros.filter(c => c.estado === 'activo').map(c => (
                      <option key={c.id} value={c.id}>{c.nombre} — {c.region}</option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn-primary" disabled={enviando}>
                  {enviando ? 'Creando...' : 'Crear envío'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Contenido por tab ──────────────────── */}
      <section className="page-section">
        <div className="page-container">
          {loading ? (
            <p className="page-empty">Cargando información...</p>
          ) : tab === 'centros' ? (

            centros.length === 0 ? (
              <div className="empty-box">
                <Building2 size={36} color="#94a3b8" />
                <p>No hay centros de acopio registrados.</p>
              </div>
            ) : (
              <div className="centros-grid">
                {centros.map(c => {
                  const pct = capacidadPct(c);
                  const st  = estadoCentro(c.estado);
                  return (
                    <div key={c.id} className="centro-card">
                      <div className="centro-card__header">
                        <div className="centro-card__icon">
                          <Building2 size={20} color="#0f2a4f" />
                        </div>
                        <span className="badge" style={{ background: st.bg, color: st.color }}>
                          {c.estado}
                        </span>
                      </div>
                      <h3 className="centro-card__name">{c.nombre}</h3>
                      <div className="centro-card__meta">
                        <MapPin size={13} />
                        <span>{c.direccion}, {c.region}</span>
                      </div>
                      <div className="centro-card__cap">
                        <div className="cap-bar">
                          <div
                            className="cap-bar__fill"
                            style={{
                              width: `${pct}%`,
                              background: pct > 80 ? '#e63946' : pct > 50 ? '#f59e0b' : '#10b981'
                            }}
                          />
                        </div>
                        <p className="cap-label">{c.capacidadActual}/{c.capacidadMaxima} unidades ({pct}%)</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )

          ) : (

            envios.length === 0 ? (
              <div className="empty-box">
                <Truck size={36} color="#94a3b8" />
                <p>No tienes envíos registrados.</p>
                <button className="btn-primary" onClick={() => setShowForm(true)}>
                  Crear primer envío
                </button>
              </div>
            ) : (
              <div className="card-list">
                {envios.map(e => {
                  const st = estadoEnvio(e.estado);
                  return (
                    <div key={e.id} className="item-card">
                      <div className="item-card__icon" style={{ background: 'rgba(15,42,79,0.08)', color: '#0f2a4f' }}>
                        <Truck size={22} />
                      </div>
                      <div className="item-card__info">
                        <p className="item-card__title">{e.origen} → {e.destino}</p>
                        <p className="item-card__sub">{e.tipoTransporte} · {e.fechaEnvio}</p>
                      </div>
                      <span className="badge" style={{ background: st.bg, color: st.color }}>
                        {e.estado}
                      </span>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}
