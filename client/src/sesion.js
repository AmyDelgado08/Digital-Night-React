import axios from 'axios';

const cerrarSesion = () => {
    localStorage.clear();
    alert('Tu sesión venció. Volvé a iniciar sesión.');
    window.location.href = '/login';
};

const token = localStorage.getItem('token');
if (token) {
    try {
        const datos = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        if (datos.exp * 1000 < Date.now()) cerrarSesion();
    } catch {
        cerrarSesion();
    }
}

axios.interceptors.response.use(
    (respuesta) => respuesta,
    (error) => {
        if (error.response?.status === 401 && localStorage.getItem('token')) {
            cerrarSesion();
            return new Promise(() => {});
        }
        return Promise.reject(error);
    }
);
