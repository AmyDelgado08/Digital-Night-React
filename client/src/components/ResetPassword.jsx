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
                    Ingresá tu nueva contraseña para recuperar el acceso a tu cuenta.
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
                    <input
                        type="password"
                        placeholder="Nueva contraseña"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={styles.campo}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Confirmar nueva contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={styles.campo}
                        required
                    />

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
