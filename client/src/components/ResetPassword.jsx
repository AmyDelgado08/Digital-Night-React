import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../img/logo.png';
import fondo from '../img/Arcos orbitales bajo estrellas violetas.png';

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Estados para el icono del "ojo" en ambos campos
    const [mostrarNewPassword, setMostrarNewPassword] = useState(false);
    const [mostrarConfirmPassword, setMostrarConfirmPassword] = useState(false);

    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');

        if (newPassword.length < 1) {
            setError('La nueva contraseña no puede ser nada.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        try {
            setCargando(true);
            const response = await axios.post('http://localhost:3000/auth/reset-password', {
                token,
                newPassword
            });

            setMensaje(response.data.message || 'Contraseña actualizada con éxito');
            alert(response.data.message || 'Contraseña actualizada correctamente.');
            navigate('/login');
        } catch (err) {
            console.error('Error al restablecer contraseña:', err);
            setError(err.response?.data?.message || 'El enlace no es válido o venció');
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
                    Restablecer <span style={styles.tituloResaltado}>contraseña</span>
                </h2>
                <p style={styles.subtitulo}>
                    Ingresá tu nueva contraseña para recuperar el acceso à tu cuenta.
                </p>

                {error && (
                    <div style={styles.alertaError}>
                        {error}
                    </div>
                )}

                {mensaje && (
                    <div style={styles.alertaExito}>
                        {mensaje}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.formulario}>
                    {/* Nueva contraseña con Ojo */}
                    <div style={styles.contenedorPassword}>
                        <input
                            type={mostrarNewPassword ? 'text' : 'password'}
                            placeholder="Nueva contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={styles.campoPassword}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarNewPassword(!mostrarNewPassword)}
                            style={styles.botonOjo}
                            title={mostrarNewPassword ? "Ocultar contraseña" : "Ver contraseña"}
                        >
                            {renderEyeIcon(mostrarNewPassword)}
                        </button>
                    </div>

                    {/* Confirmar nueva contraseña con Ojo */}
                    <div style={styles.contenedorPassword}>
                        <input
                            type={mostrarConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirmar nueva contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={styles.campoPassword}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarConfirmPassword(!mostrarConfirmPassword)}
                            style={styles.botonOjo}
                            title={mostrarConfirmPassword ? "Ocultar contraseña" : "Ver contraseña"}
                        >
                            {renderEyeIcon(mostrarConfirmPassword)}
                        </button>
                    </div>

                    <button type="submit" disabled={cargando} style={styles.botonPrincipal}>
                        {cargando ? 'Actualizando...' : 'Restablecer contraseña'}
                    </button>
                </form>

                <div style={styles.separador}>
                    <div style={styles.lineaSeparador}></div>
                    <span style={styles.textoSeparador}>o</span>
                    <div style={styles.lineaSeparador}></div>
                </div>

                <button onClick={() => navigate('/login')} style={styles.botonSecundario}>
                    Volver al Login
                </button>
            </div>
        </div>
    );
}

// Función auxiliar para renderizar el ícono del ojo
const renderEyeIcon = (show) => {
    return show ? (
        /* Ícono Ojo Tachado (Ocultar) */
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
    ) : (
        /* Ícono Ojo Normal (Ver) */
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        </svg>
    );
};

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
    alertaError: {
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        border: '1px solid #ef4444',
        color: '#fca5a5',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '13px',
        marginBottom: '18px',
        textAlign: 'center',
    },
    alertaExito: {
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        border: '1px solid #22c55e',
        color: '#86efac',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '13px',
        marginBottom: '18px',
        textAlign: 'center',
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
    contenedorPassword: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    },
    campoPassword: {
        width: '100%',
        padding: '12px 44px 12px 14px', // Espacio derecho para el ícono del ojo
        backgroundColor: '#1b1726',
        border: '1px solid #2d2640',
        borderRadius: '8px',
        color: '#f1f5f9',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
    },
    botonOjo: {
        position: 'absolute',
        right: '12px',
        background: 'transparent',
        border: 'none',
        color: '#a1a1aa',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px',
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

export default ResetPassword;