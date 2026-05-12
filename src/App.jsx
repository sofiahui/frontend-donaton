import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Donaciones from './pages/Donaciones';
import Logistica from './pages/Logistica';
import Necesidades from './pages/Necesidades';
import Navbar from './components/Navbar';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/donaciones" element={
          <PrivateRoute><Navbar /><Donaciones /></PrivateRoute>
        } />
        <Route path="/logistica" element={
          <PrivateRoute><Navbar /><Logistica /></PrivateRoute>
        } />
        <Route path="/necesidades" element={
          <PrivateRoute><Navbar /><Necesidades /></PrivateRoute>
        } />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;