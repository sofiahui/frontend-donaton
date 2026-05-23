import { useState, useEffect } from 'react';
import useNotificaciones from '../hooks/useNotificaciones';
import './AnnouncementBar.css';

export default function AnnouncementBar() {
  const { notificaciones, eliminar } = useNotificaciones();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (notificaciones.length === 0) return;

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        eliminar(notificaciones[0].id);
        setVisible(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, [notificaciones]);

  return (
    <div className="announcement-bar">
      {notificaciones.length > 0 && (
        <span className={`announcement-text ${visible ? 'announcement-text--visible' : ''}`}>
          📦 {notificaciones[0].mensaje}
        </span>
      )}
    </div>
  );
}
