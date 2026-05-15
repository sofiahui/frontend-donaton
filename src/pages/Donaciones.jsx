import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gift, Plus, Package, ChevronRight, X } from 'lucide-react';
import './Donaciones.css';

const TIPOS = ['ropa', 'alimento', 'medicamento', 'higiene', 'otro'];
const CENTROS = ['Centro Norte', 'Centro Sur', 'Centro Este', 'Centro Oeste', 'Centro RM'];

export default function Donaciones() {
  const [donaciones, setDonaciones] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [enviando, setEnviando]     = useState(false);
  const [exito, setExito]           = useState(false);

  const [form, setForm] = useState({
    tipoDonacion: '',
    cantidad: '',
    origen: 'persona',
    centroAcopio: '',
  });

  const token = localStorage.getItem('token');

  const cargar = () => {
    fetch('http://localhost:8080/donaciones', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { setDonaciones(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setEnviando(true);
    try {
      await fetch('http://localhost:8080/donaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, cantidad: parseInt(form.cantidad) }),
      });
      setExito(true);
      setForm({ tipoDonacion: '', cantidad: '', origen: 'persona', centroAcopio: '' });
      cargar();
      setTimeout(() => { setExito(false); setShowForm(false); }, 2000);
    } catch {
      alert('Error al registrar la donación');
    }
    setEnviando(false);
  };

  return (
    <div className="page-wrapper">

      {/* ── Hero ───────────────────────────────── */}
      <section className="page-hero">
        <div className="page-hero__inner">
          <div className="page-hero__icon"><Gift size={28} color="#e63946" /></div>
          <div>
            <h1 className="page-hero__title">Mis Donaciones</h1>
            <p className="page-hero__sub">Registra y consulta el historial de tus donaciones</p>
          </div>
        </div>
        <button className="page-hero__btn" onClick={() => setShowForm(true)}>
          <Plus size={18} /> Nueva donación
        </button>
      </section>

      {/* ── Breadcrumb ─────────────────────────── */}
      <div className="breadcrumb">
        <Link to="/dashboard">Panel</Link>
        <ChevronRight size={14} />
        <span>Donaciones</span>
      </div>

      {/* ── Modal formulario ───────────────────── */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h2>Nueva donación</h2>
              <button className="modal__close" onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>

            {exito ? (
              <div className="modal__exito">
                <div className="modal__exito-icon">✓</div>
                <p>¡Donación registrada con éxito!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="modal__form">
                <div className="field">
                  <label>Tipo de donación</label>
                  <select name="tipoDonacion" value={form.tipoDonacion} onChange={handleChange} required>
                    <option value="">Selecciona un tipo</option>
                    {TIPOS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>

                <div className="field">
                  <label>Cantidad</label>
                  <input type="number" name="cantidad" min="1" placeholder="Ej: 10"
                    value={form.cantidad} onChange={handleChange} required />
                </div>

                <div className="field">
                  <label>Origen</label>
                  <select name="origen" value={form.origen} onChange={handleChange}>
                    <option value="persona">Persona</option>
                    <option value="empresa">Empresa</option>
                  </select>
                </div>

                <div className="field">
                  <label>Centro de acopio</label>
                  <select name="centroAcopio" value={form.centroAcopio} onChange={handleChange} required>
                    <option value="">Selecciona un centro</option>
                    {CENTROS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <button type="submit" className="btn-primary" disabled={enviando}>
                  {enviando ? 'Registrando...' : 'Registrar donación'}
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
            <p className="page-empty">Cargando donaciones...</p>
          ) : donaciones.length === 0 ? (
            <div className="empty-box">
              <Package size={36} color="#94a3b8" />
              <p>Aún no has realizado ninguna donación.</p>
              <button className="btn-primary" onClick={() => setShowForm(true)}>
                Hacer tu primera donación
              </button>
            </div>
          ) : (
            <div className="card-list">
              {donaciones.map(d => (
                <div key={d.id} className="item-card">
                  <div className="item-card__icon" style={{ background: 'rgba(230,57,70,0.10)', color: '#e63946' }}>
                    <Gift size={22} />
                  </div>
                  <div className="item-card__info">
                    <p className="item-card__title">
                      {d.tipoDonacion?.charAt(0).toUpperCase() + d.tipoDonacion?.slice(1)} × {d.cantidad}
                    </p>
                    <p className="item-card__sub">{d.centroAcopio} · {d.fecha}</p>
                  </div>
                  <span className="badge badge--origin">{d.origen}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
