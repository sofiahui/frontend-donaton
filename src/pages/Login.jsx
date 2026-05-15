import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLogged, setKeepLogged] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    try {

      // PETICION A TU API GATEWAY
      const response = await axios.post(
        'http://localhost:8080/api/login',
        {
          email,
          password
        }
      );

      // GUARDAR DATOS DEL USUARIO
      localStorage.setItem(
        'username',
        response.data.username || 'Usuario'
      );

      // OPCIONAL: guardar token
      localStorage.setItem(
        'token',
        response.data.token
      );

      alert('¡Bienvenido a Donaton!');

      // REDIRECCION
      navigate('/dashboard');

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        'Error al iniciar sesión'
      );
    }
  };

  return (
      <>
      <div className="login-page-wrapper">
        <div className="login-split">
          {/* Left side - coworking image */}
          <div className="coworking-side">
          </div>

          {/* Right side - form */}
          <div className="form-side">
            <div className="form-container">
              <div className="login-hero">
                <h1>Welcome Back</h1>
                <h3>Please enter your details to access your dashboard.</h3>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-icon-wrap">
                    <span className="input-icon">✉</span>
                    <input
                      type="email"
                      id="email"
                      placeholder="alex@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="label-row">
                    <label htmlFor="password">Password</label>
                    <a href="#">Forgot Password?</a>
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
                    <label htmlFor="keepLogged">Keep me logged in</label>
                  </div>
                </div>

                <button type="submit" className="submit-btn">Sign In</button>
              </form>

              <div className="divider"><span>OR CONTINUE WITH</span></div>

              <div className="social-login">
                <button className="google-btn">G Google</button>
                <button className="github-btn">⬡ GitHub</button>
              </div>

              <div className="create-account">
                <span>Don't have an account?</span>
                <Link to="/registro">Create an account</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}