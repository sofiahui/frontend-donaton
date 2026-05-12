import api from './api';

export const listarDonaciones = () => api.get('/donaciones');
export const crearDonacion = (data) => api.post('/donaciones', data);