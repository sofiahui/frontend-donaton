import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Footer from '../components/Footer';
import './Login.css';

export default function Login() {
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLogged, setKeepLogged]   = useState(false);
  const [error, setError]             = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    try {
      const response = await api.post('/auth/login', { email, password });

      localStorage.setItem('token',    response.data.token);
      localStorage.setItem('username', response.data.username || 'Usuario');

      if (keepLogged) {
        localStorage.setItem('keepLogged', 'true');
      }

      navigate('/dashboard');

    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Credenciales  inválidas'
      );
    }
  };

  return (
      <>
      <div className="login-page-wrapper">
        <div className="login-split">
          {/* Left side - coworking image */}
          <div className="coworking-side">
          <img src="/src/assets/donatonejemplo.png" alt="Donaton logo" />
        </div>
          {/* Right side - form */}
          <div className="form-side">
            <div className="form-container">
              <div className="login-hero">
                <h1>Bienvenido a Donaton</h1>
                <div className="ingresa-error">
                <h3>Por favor, ingresa tus datos para acceder a tu dashboard.</h3>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email </label>
                  <div className="input-icon-wrap">
                    <span className="input-icon">✉</span>
                    <input
                      type="email"
                      id="email"
                      placeholder="alex@ejemplo.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="label-row">
                    <label htmlFor="password">Contraseña</label>
                    <a href="#">¿Olvidaste tu contraseña?</a>
                  </div>
                  <div className="input-icon-wrap">
                    <span className="input-icon">🔒</span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="toggle-eye"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '🙈' : '👁'}
                    </button>
                  </div>
                  <div className="keep-logged">
                    <input
                      type="checkbox"
                      id="keepLogged"
                      checked={keepLogged}
                      onChange={e => setKeepLogged(e.target.checked)}
                    />
                    <label htmlFor="keepLogged">Mantenerme conectado</label>
                  </div>
                </div>
                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="submit-btn">Iniciar sesión</button>
              </form>

              <div className="divider"><span>O CONTINUAR CON </span></div>

              <div className="social-login">
                <button className="google-btn">G Google</button>
                <button className="github-btn">⬡ GitHub</button>
              </div>

              <div className="create-account">
                <span>No tienes cuenta?</span>
                <Link to="/registro">Registrate</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}