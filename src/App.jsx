import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
//import Login from './pages/Login';
//import Donaciones from './pages/Donaciones';
//import Logistica from './pages/Logistica';
//import Necesidades from './pages/Necesidades';
import Navbar from './components/Navbar';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}


function Layout({ children, theme, onToggleTheme }) {
  return (
    <>
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />
      {children}
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
            <Route path="/" element={
              <Layout theme={theme} onToggleTheme={switchTheme}>
                <Home />
              </Layout>
            } />
            <Route path="/home" element={
              <Layout theme={theme} onToggleTheme={switchTheme}>
                <Home />
              </Layout>
            } />
           {/* <Route path="/login" element={<Login />} />
            <Route path="/donaciones" element={
              <PrivateRoute>
                <Layout theme={theme} onToggleTheme={switchTheme}>
                  <Donaciones />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/logistica" element={
              <PrivateRoute>
                <Layout theme={theme} onToggleTheme={switchTheme}>
                  <Logistica />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/necesidades" element={
              <PrivateRoute>
                <Layout theme={theme} onToggleTheme={switchTheme}>
                  <Necesidades />
                </Layout>
              </PrivateRoute>*/}
        </Routes>
    </BrowserRouter>
  );
}