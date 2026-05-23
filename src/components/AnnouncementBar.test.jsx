import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AnnouncementBar from './AnnouncementBar';
import useNotificaciones from '../hooks/useNotificaciones';

vi.mock('../hooks/useNotificaciones', () => ({
  default: vi.fn(),
}));

describe('AnnouncementBar', () => {
  it('renderiza la barra con fondo pero sin texto cuando el array está vacío', () => {
    vi.mocked(useNotificaciones).mockReturnValue([]);
    const { container } = render(<AnnouncementBar />);
    expect(container.querySelector('.announcement-bar')).toBeInTheDocument();
    expect(container.querySelector('.announcement-text')).not.toBeInTheDocument();
  });

  it('muestra el primer mensaje cuando hay notificaciones', () => {
    vi.mocked(useNotificaciones).mockReturnValue([
      'Nueva donacion: 10 unidades de ropa en Centro Santiago',
      'Nueva donacion: 5 unidades de alimento en Centro Norte',
    ]);
    render(<AnnouncementBar />);
    expect(
      screen.getByText(/Nueva donacion: 10 unidades de ropa en Centro Santiago/)
    ).toBeInTheDocument();
  });
});
