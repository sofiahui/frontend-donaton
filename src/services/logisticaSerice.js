import api from './api';

export const listarCentros = () => api.get('/centros');
export const crearCentro = (data) => api.post('/centros', data);
export const listarEnvios = () => api.get('/envios');
export const crearEnvio = (data) => api.post('/envios', data);