import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PublicProfile() {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Primero debes iniciar sesión.');
            navigate('/login');
            return;
        }

        // Traemos el nombre y apellido reales del usuario desde el backend
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/me', {
                    headers: { Authorization: token }
                });

                setFirstName(response.data.firstName || '');
                setLastName(response.data.lastName || '');
            } catch (error) {
                console.error("Error al cargar los datos:", error);

                //Si falla la BD, intentamos mostrar lo del localStorage
                setFirstName(localStorage.getItem('userFirstName') || '');
                setLastName(localStorage.getItem('userLastName') || '');
            }
        };

        fetchUserData();
    }, [navigate]);

    // Iniciales para el avatar
    const iniciales = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();

    return (
        <div style={style.pagina}>
            {/* Menú lateral */}
            <aside style={style.menuLateral}>
                <div style={style.tituloMenu}>Configuración</div>
                <button style={style.opcionMenu} onClick={() => navigate('/editar-perfil')}>Cuenta</button>
                <button style={style.opcionMenuActiva}>Perfil público</button>
                <button style={style.opcionMenuDeshabilitada}>Seguridad</button>
                <button style={style.opcionMenuDeshabilitada}>Privacidad</button>
            </aside>

            <section style={style.contenido}>
                <h1 style={style.titulo}>Perfil público</h1>
                <p style={style.subtitulo}>Administra tu información personal y cómo te muestras en la plataforma.</p>

                <div style={style.tarjeta}>
                    <h3 style={style.tituloTarjeta}>Perfil público</h3>
                    <p style={style.textoTarjeta}>Esta información será visible para otros usuarios en la comunidad.</p>

                    <div style={style.centro}>
                        <div style={style.avatar}>{iniciales}</div>
                        <h2 style={style.nombre}>{firstName} {lastName}</h2>
                    </div>
                </div>
            </section>
        </div>
    );
}

const style = {
    pagina: {
        display: 'flex',
        gap: '28px',
        padding: '32px',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        boxSizing: 'border-box',
        background: '#0b0b1c',
        minHeight: '85vh',
    },
    menuLateral: {
        width: '230px',
        padding: '22px 14px',
        borderRadius: '20px',
        backgroundColor: '#17152b',
        border: '1px solid #26233d',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        boxSizing: 'border-box',
    },
    tituloMenu: {
        color: '#e2e8f0',
        fontSize: '15px',
        padding: '0 10px 14px',
    },
    opcionMenu: {
        padding: '13px 14px',
        borderRadius: '10px',
        fontSize: '14px',
        textAlign: 'left',
        color: '#cbd5e1',
        backgroundColor: 'transparent',
        border: '1px solid transparent',
        cursor: 'pointer',
    },
    opcionMenuActiva: {
        padding: '13px 14px',
        borderRadius: '10px',
        fontSize: '14px',
        textAlign: 'left',
        color: '#ffffff',
        backgroundColor: '#2e2a5c',
        border: '1px solid #8b5cf6',
        cursor: 'pointer',
    },
    opcionMenuDeshabilitada: {
        padding: '13px 14px',
        borderRadius: '10px',
        fontSize: '14px',
        textAlign: 'left',
        color: '#cbd5e1',
        backgroundColor: 'transparent',
        border: '1px solid transparent',
        opacity: 0.6,
        cursor: 'not-allowed',
    },
    contenido: {
        flex: 1,
        minWidth: '300px',
    },
    titulo: {
        color: '#ffffff',
        fontSize: '40px',
        fontWeight: '700',
        margin: '0 0 6px',
    },
    subtitulo: {
        color: '#a5a5d0',
        fontSize: '15px',
        margin: '0 0 24px',
    },
    tarjeta: {
        width: '100%',
        minHeight: '440px',
        padding: '24px 26px',
        borderRadius: '18px',
        backgroundColor: '#17152b',
        border: '1px solid #26233d',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.35)',
        boxSizing: 'border-box',
    },
    tituloTarjeta: {
        color: '#ffffff',
        fontSize: '19px',
        fontWeight: '600',
        margin: '0 0 4px',
    },
    textoTarjeta: {
        color: '#a5a5d0',
        fontSize: '13px',
        margin: '0 0 24px',
    },
    centro: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '60px',
    },
    avatar: {
        width: '110px',
        height: '110px',
        borderRadius: '50%',
        backgroundColor: '#6366f1',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '38px',
        fontWeight: '700',
        marginBottom: '22px',
    },
    nombre: {
        color: '#ffffff',
        fontSize: '24px',
        fontWeight: '600',
        margin: 0,
    },
};

export default PublicProfile;
