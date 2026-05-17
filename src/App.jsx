import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Donaciones from './pages/Donaciones';
import Logistica from './pages/Logistica';
import Necesidades from './pages/Necesidades';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}


function Layout({ children, theme, onToggleTheme }) {
  return (
    <>
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />
      {children}

      <Footer theme ={theme} onToggleTheme={onToggleTheme} />
    </>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const switchTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    const applyTheme = () => {
      document.documentElement.classList.toggle('dark', nextTheme === 'dark');
      localStorage.setItem('theme', nextTheme);
      setTheme(nextTheme);
    };
    if (!document.startViewTransition) {
      applyTheme();
    } else {
      document.startViewTransition(applyTheme);
    }
  };

  return (
       <BrowserRouter>
          <Routes>

                    <Route
                      path="/"
                      element={
                        <Layout theme={theme} onToggleTheme={switchTheme}>
                          <Home />
                        </Layout>
                      }
                    />

                    <Route
                      path="/home"
                      element={
                        <Layout theme={theme} onToggleTheme={switchTheme}>
                          <Home />
                        </Layout>
                      }
                    />

                   <Route
                      path="/login"
                      element={
                        <Layout theme={theme} onToggleTheme={switchTheme}>
                          <Login />
                        </Layout>
                      }
                    />
                    
                    <Route
                      path="/donaciones"
                      element={
                        <PrivateRoute>
                          <Layout theme={theme} onToggleTheme={switchTheme}>
                            <Donaciones />
                          </Layout>
                        </PrivateRoute>
                      }
                    />

                    <Route
                      path="/logistica"
                      element={
                        <PrivateRoute>
                          <Layout theme={theme} onToggleTheme={switchTheme}>
                            <Logistica />
                          </Layout>
                        </PrivateRoute>
                      }
                    />

                    <Route
                      path="/necesidades"
                      element={
                        <PrivateRoute>
                          <Layout theme={theme} onToggleTheme={switchTheme}>
                            <Necesidades />
                          </Layout>
                        </PrivateRoute>
                      }
                    />

                    <Route
                      path="/dashboard"
                      element={
                        <PrivateRoute>
                          <Layout theme={theme} onToggleTheme={switchTheme}>
                            <Dashboard />
                          </Layout>
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/registro"
                      element={
                        <Layout theme={theme} onToggleTheme={switchTheme}>
                          <Registro />
                        </Layout>
                      }
                    />

          </Routes>
    </BrowserRouter>
  );
}