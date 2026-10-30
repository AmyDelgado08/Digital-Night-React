import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import imagen404 from '../img/404.png';

function NotFound() {
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`http://localhost:3000/frontend${location.pathname}`, {
            headers: token ? { authorization: token } : {}
        }).catch(() => {});
    }, [location.pathname]);

    return (
        <div style={style.contenedor}>
            <img src={imagen404} alt="Página no encontrada" style={style.imagen} />
            <h1 style={style.numero}>404</h1>
            <p style={style.texto}>Página no encontrada</p>
            <Link to="/" style={style.boton}>Volver al inicio</Link>
        </div>
    );
}

const style = {
    contenedor: {
        minHeight: 'calc(100vh - 70px)',
        backgroundColor: '#09090e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        boxSizing: 'border-box',
        textAlign: 'center',
    },
    imagen: {
        width: '320px',
        maxWidth: '80%',
    },
    numero: {
        fontSize: '64px',
        margin: '16px 0 0',
        color: '#7c3aed',
    },
    texto: {
        fontSize: '18px',
        color: '#a1a1aa',
        margin: '8px 0 24px',
    },
    boton: {
        backgroundColor: '#7c3aed',
        color: '#ffffff',
        padding: '10px 20px',
        borderRadius: '20px',
        textDecoration: 'none',
        fontWeight: '500',
    },
};

export default NotFound;
