import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import './Registro.css';
import chileData from '../data/chileData';
import api from '../services/api';

export default function Register() {
  const navigate = useNavigate();

  // Estados de cada campo
  const [nombre,       setNombre]       = useState('');
  const [email,        setEmail]        = useState('');
  const [telefono,     setTelefono]     = useState('');
  const [region,       setRegion]       = useState('');
  const [comuna,       setComuna]       = useState('');
  const [password,     setPassword]     = useState('');
  const [direccion,    setDireccion]    = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error,        setError]        = useState('');
  const [enviando,     setEnviando]     = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setEnviando(true);

    try {
      const response = await api.post('/auth/register', {
        nombre,
        email,
        password,
        telefono,
        region,
        comuna,
        direccion,
      });

      localStorage.setItem('token',    response.data.token);
      localStorage.setItem('username', response.data.username || nombre);

      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Error al registrarse'
      );
    }
    setEnviando(false);
  };

  return (
    <>
      {/* HERO */}
      <section className="register-hero">
        <div className="register-overlay"></div>
        <div className="register-hero-content">
          <h1>Únete a Donaton</h1>
          <p>
            Sé parte de la red de ayuda humanitaria que conecta directamente
            donaciones con quienes más lo necesitan.
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="register-section">
        <div className="register-container">

          <div className="register-info">
            <span className="register-badge">Comunidad Solidaria</span>
            <h2>Crear Cuenta</h2>
            <p>
              Regístrate para donar, solicitar ayuda o participar como
              voluntario en situaciones de emergencia en Chile.
            </p>
            <ul className="register-benefits">
              <li>✔ Donaciones seguras y transparentes</li>
              <li>✔ Seguimiento de ayudas entregadas</li>
              <li>✔ Acceso a campañas solidarias</li>
              <li>✔ Participación como voluntario</li>
            </ul>
          </div>

          <div className="register-card">
            <form className="register-form" onSubmit={handleRegister}>

              {/* Error */}
              {error && (
                <p style={{
                  color: '#e63946',
                  fontSize: '0.85rem',
                  background: 'rgba(230,57,70,0.08)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  marginBottom: '4px'
                }}>
                  {error}
                </p>
              )}

              <div className="input-group">
                <label>Nombre Completo</label>
                <input
                  type="text"
                  placeholder="Ingresa tu nombre"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  placeholder="+56 9 1234 5678"
                  value={telefono}
                  onChange={e => setTelefono(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Región</label>
                <select
                  value={region}
                  onChange={e => { setRegion(e.target.value); setComuna(''); }}
                  required
                >
                  <option value="">Selecciona una región</option>
                  {Object.keys(chileData).map(reg => (
                    <option key={reg} value={reg}>{reg}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Comuna</label>
                <select
                  value={comuna}
                  onChange={e => setComuna(e.target.value)}
                  disabled={!region}
                  required
                >
                  <option value="">Selecciona una comuna</option>
                  {region && chileData[region].map(com => (
                    <option key={com} value={com}>{com}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Contraseña</label>
                <div className="password-box">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="show-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label>Dirección</label>
                <input
                  type="text"
                  placeholder="Ej: Av. Los Leones 1234"
                  value={direccion}
                  onChange={e => setDireccion(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="register-btn"
                disabled={enviando}
              >
                {enviando ? 'Creando cuenta...' : 'Crear Cuenta'}
              </button>

              <p className="login-link">
                ¿Ya tienes cuenta?
                <Link to="/login"> Inicia sesión</Link>
              </p>

            </form>
          </div>
        </div>
      </section>
    </>
  );
}