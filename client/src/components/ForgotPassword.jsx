import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../img/logo.png';
import fondo from '../img/Arcos orbitales bajo estrellas violetas.png';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            alert('Por favor ingresa tu correo electrónico.');
            return;
        }

        try {
            setCargando(true);
            setMensaje('');
            const response = await axios.post('http://localhost:3000/auth/forgot-password', { email });
            setMensaje(response.data.message);
        } catch (error) {
            console.error('Error al solicitar recuperación:', error);
            setMensaje(error.response?.data?.message || 'Ocurrió un error al procesar la solicitud.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={styles.contenedor}>
            <div style={styles.contenedorLogo}>
                <img src={logo} alt="Logo" style={styles.logoImagen} />
                <div style={styles.logoTexto}>
                    DIGITAL<span style={styles.logoTextoResaltado}>NIGHT</span>
                </div>
            </div>

            <div style={styles.tarjeta}>
                <h2 style={styles.titulo}>
                    Recuperar <span style={styles.tituloResaltado}>contraseña</span>
                </h2>
                <p style={styles.subtitulo}>
                    Ingresá el correo asociado a tu cuenta para recibir las instrucciones de restablecimiento.
                </p>

                {mensaje && (
                    <div style={styles.alertaMensaje}>
                        {mensaje}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.formulario}>
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.campo}
                        required
                    />

                    <button type="submit" disabled={cargando} style={styles.botonPrincipal}>
                        {cargando ? 'Enviando...' : 'Enviar enlace de recuperación'}
                    </button>
                </form>

                <div style={styles.separador}>
                    <div style={styles.lineaSeparador}></div>
                    <span style={styles.textoSeparador}>¿Recordaste tu contraseña?</span>
                    <div style={styles.lineaSeparador}></div>
                </div>

                <button onClick={() => navigate('/login')} style={styles.botonSecundario}>
                    Volver a Iniciar Sesión
                </button>
            </div>
        </div>
    );
}

const styles = {
    contenedor: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 69px)',
        padding: '40px 16px',
        boxSizing: 'border-box',
        backgroundImage: `linear-gradient(rgba(9, 9, 20, 0.35), rgba(9, 9, 20, 0.35)), url("${fondo}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
    },
    contenedorLogo: {
        textAlign: 'center',
        marginBottom: '28px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    logoImagen: {
        height: '84px',
        marginBottom: '12px',
    },
    logoTexto: {
        fontSize: '20px',
        fontWeight: '700',
        letterSpacing: '3px',
        color: '#f1f5f9',
    },
    logoTextoResaltado: {
        color: '#7c3aed',
    },
    tarjeta: {
        backgroundColor: '#13111c',
        border: '1px solid #2d2640',
        borderRadius: '16px',
        padding: '36px 32px',
        width: '100%',
        maxWidth: '420px',
        boxSizing: 'border-box',
    },
    titulo: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#f1f5f9',
        margin: '0 0 6px 0',
        textAlign: 'center',
    },
    tituloResaltado: {
        color: '#7c3aed',
    },
    subtitulo: {
        fontSize: '13px',
        color: '#71717a',
        textAlign: 'center',
        margin: '0 0 24px 0',
        lineHeight: '1.4',
    },
    alertaMensaje: {
        backgroundColor: 'rgba(124, 58, 237, 0.15)',
        border: '1px solid #7c3aed',
        color: '#c4b5fd',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '13px',
        marginBottom: '18px',
        textAlign: 'center',
        lineHeight: '1.4',
    },
    formulario: {
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
    },
    campo: {
        width: '100%',
        padding: '12px 14px',
        backgroundColor: '#1b1726',
        border: '1px solid #2d2640',
        borderRadius: '8px',
        color: '#f1f5f9',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
    },
    botonPrincipal: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#7c3aed',
        border: 'none',
        borderRadius: '8px',
        color: '#ffffff',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    separador: {
        display: 'flex',
        alignItems: 'center',
        margin: '22px 0 16px 0',
        gap: '10px',
    },
    lineaSeparador: {
        flex: 1,
        height: '1px',
        backgroundColor: '#2d2640',
    },
    textoSeparador: {
        fontSize: '12px',
        color: '#52525b',
    },
    botonSecundario: {
        width: '100%',
        padding: '10px',
        backgroundColor: 'transparent',
        border: '1px solid #2d2640',
        borderRadius: '8px',
        color: '#a1a1aa',
        fontSize: '14px',
        cursor: 'pointer',
    },
};

export default ForgotPassword;
