import api from './api';

export const listarNecesidades = () => api.get('/necesidades');
export const crearNecesidad = (data) => api.post('/necesidades', data);