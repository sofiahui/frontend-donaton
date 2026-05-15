import { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import './Registro.css';
import chileData from '../data/chileData';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);

  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
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
            <form className="register-form">

              <div className="input-group">
                <label>Nombre Completo</label>
                <input type="text" placeholder="Ingresa tu nombre" />
              </div>

              <div className="input-group">
                <label>Correo Electrónico</label>
                <input type="email" placeholder="correo@ejemplo.com" />
              </div>

              <div className="input-group">
                <label>Teléfono</label>
                <input type="tel" placeholder="+56 9 1234 5678" />
              </div>

              <div className="input-group">
                  <label>Región</label>

                  <select
                    value={region}
                    onChange={(e) => {
                      setRegion(e.target.value);
                      setComuna('');
                    }}
                  >
                    <option value="">Selecciona una región</option>

                    {Object.keys(chileData).map((reg) => (
                      <option key={reg} value={reg}>
                        {reg}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Comuna</label>

                  <select
                    value={comuna}
                    onChange={(e) => setComuna(e.target.value)}
                    disabled={!region}
                  >
                    <option value="">
                      Selecciona una comuna
                    </option>

                    {region &&
                      chileData[region].map((com) => (
                        <option key={com} value={com}>
                          {com}
                        </option>
                      ))}
                  </select>
                </div>

              <div className="input-group">
                <label>Contraseña</label>

                <div className="password-box">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
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
                />
              </div>

              <button type="submit" className="register-btn">
                Crear Cuenta
              </button>

              <p className="login-link">
                ¿Ya tienes cuenta?
                <Link to="/login"> Inicia sesión</Link>
              </p>

            </form>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}