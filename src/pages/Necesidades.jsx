import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Plus, ClipboardList, ChevronRight, X } from 'lucide-react';
import './Necesidades.css';

const RECURSOS   = ['ropa', 'alimento', 'medicamento', 'higiene', 'agua', 'otro'];
const REGIONES   = ['RM', 'Valparaíso', 'Biobío', 'La Araucanía', 'Los Lagos', 'Antofagasta', 'Otra'];
const ESTADOS_COLOR = {
  pendiente:   { bg: 'rgba(230,57,70,0.10)',    color: '#c1121f' },
  en_proceso:  { bg: 'rgba(245,158,11,0.10)',   color: '#92400e' },
  atendida:    { bg: 'rgba(16,185,129,0.10)',   color: '#065f46' },
};

export default function Necesidades() {
  const [necesidades, setNecesidades] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showForm, setShowForm]       = useState(false);
  const [enviando, setEnviando]       = useState(false);
  const [exito, setExito]             = useState(false);

  const [form, setForm] = useState({
    recurso: '', cantidad: '', ubicacion: '', region: '', reportadoPor: '',
  });

  const token = localStorage.getItem('token');

  const cargar = () => {
    fetch('http://localhost:8080/necesidades', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { setNecesidades(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setEnviando(true);
    try {
      await fetch('http://localhost:8080/necesidades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, cantidad: parseInt(form.cantidad) }),
      });
      setExito(true);
      setForm({ recurso: '', cantidad: '', ubicacion: '', region: '', reportadoPor: '' });
      cargar();
      setTimeout(() => { setExito(false); setShowForm(false); }, 2000);
    } catch {
      alert('Error al reportar la necesidad');
    }
    setEnviando(false);
  };

  const estadoStyle = (estado) => ESTADOS_COLOR[estado] || { bg: 'rgba(100,116,139,0.10)', color: '#475569' };

  return (
    <div className="page-wrapper">

      {/* ── Hero ───────────────────────────────── */}
      <section className="page-hero">
        <div className="page-hero__inner">
          <div className="page-hero__icon"><AlertTriangle size={28} color="#e63946" /></div>
          <div>
            <h1 className="page-hero__title">Necesidades en Terreno</h1>
            <p className="page-hero__sub">Reporta recursos que necesitas y hacemos que lleguen a ti</p>
          </div>
        </div>
        <button className="page-hero__btn" onClick={() => setShowForm(true)}>
          <Plus size={18} /> Reportar necesidad
        </button>
      </section>

      {/* ── Breadcrumb ─────────────────────────── */}
      <div className="breadcrumb">
        <Link to="/dashboard">Panel</Link>
        <ChevronRight size={14} />
        <span>Necesidades</span>
      </div>

      {/* ── Info banner ────────────────────────── */}
      <div className="page-container" style={{ marginTop: '1rem' }}>
        <div className="info-banner">
          <AlertTriangle size={18} color="#e63946" />
          <p>En caso de catástrofe, reporta tu ubicación y los recursos que necesitas. Nuestro equipo coordinará el envío lo antes posible.</p>
        </div>
      </div>

      {/* ── Modal formulario ───────────────────── */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h2>Reportar necesidad</h2>
              <button className="modal__close" onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>

            {exito ? (
              <div className="modal__exito">
                <div className="modal__exito-icon">✓</div>
                <p>¡Necesidad reportada! Nos pondremos en contacto pronto.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="modal__form">
                <div className="field">
                  <label>Recurso que necesitas</label>
                  <select name="recurso" value={form.recurso} onChange={handleChange} required>
                    <option value="">Selecciona un recurso</option>
                    {RECURSOS.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                  </select>
                </div>

                <div className="field">
                  <label>Cantidad aproximada</label>
                  <input type="number" name="cantidad" min="1" placeholder="Ej: 5"
                    value={form.cantidad} onChange={handleChange} required />
                </div>

                <div className="field">
                  <label>Ubicación exacta</label>
                  <input type="text" name="ubicacion" placeholder="Dirección o sector"
                    value={form.ubicacion} onChange={handleChange} required />
                </div>

                <div className="field">
                  <label>Región</label>
                  <select name="region" value={form.region} onChange={handleChange} required>
                    <option value="">Selecciona tu región</option>
                    {REGIONES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div className="field">
                  <label>Tu nombre</label>
                  <input type="text" name="reportadoPor" placeholder="¿Quién reporta?"
                    value={form.reportadoPor} onChange={handleChange} required />
                </div>

                <button type="submit" className="btn-primary" disabled={enviando}>
                  {enviando ? 'Enviando...' : 'Reportar necesidad'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Lista ──────────────────────────────── */}
      <section className="page-section">
        <div className="page-container">
          {loading ? (
            <p className="page-empty">Cargando necesidades...</p>
          ) : necesidades.length === 0 ? (
            <div className="empty-box">
              <ClipboardList size={36} color="#94a3b8" />
              <p>No hay necesidades reportadas aún.</p>
              <button className="btn-primary" onClick={() => setShowForm(true)}>
                Reportar una necesidad
              </button>
            </div>
          ) : (
            <div className="card-list">
              {necesidades.map(n => {
                const st = estadoStyle(n.estado);
                return (
                  <div key={n.id} className="item-card">
                    <div className="item-card__icon" style={{ background: 'rgba(230,57,70,0.10)', color: '#e63946' }}>
                      <AlertTriangle size={22} />
                    </div>
                    <div className="item-card__info">
                      <p className="item-card__title">
                        {n.recurso?.charAt(0).toUpperCase() + n.recurso?.slice(1)} × {n.cantidad}
                      </p>
                      <p className="item-card__sub">{n.ubicacion}, {n.region} · {n.fechaReporte}</p>
                    </div>
                    <span className="badge" style={{ background: st.bg, color: st.color }}>
                      {n.estado}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
