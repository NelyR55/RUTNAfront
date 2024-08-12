// api.js
import axios from 'axios';

// Configura Axios con el token
const api = axios.create({
  baseURL: 'https://rutnaback-production.up.railway.app',
});

// Agrega el token a cada solicitud
api.interceptors.request.use(
  config => {
    const token = 'tu_token_aqui'; // Obtén el token desde donde lo guardas (AsyncStorage, Context, etc.)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Maneja los errores de respuesta
api.interceptors.response.use(
  response => response,
  error => {
    console.log('Error de respuesta:', error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

export default api;
