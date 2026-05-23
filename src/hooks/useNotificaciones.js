import { useState, useEffect } from 'react';

export default function useNotificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    const fetchNotificaciones = () => {
      fetch('http://localhost:8084/notificaciones')
        .then(res => res.json())
        .then(data => setNotificaciones(data))
        .catch(() => {});
    };

    fetchNotificaciones();
    const interval = setInterval(fetchNotificaciones, 5000);
    return () => clearInterval(interval);
  }, []);

  const eliminar = (id) => {
    setNotificaciones(prev => prev.filter(n => n.id !== id));
    fetch(`http://localhost:8084/notificaciones/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  return { notificaciones, eliminar };
}
