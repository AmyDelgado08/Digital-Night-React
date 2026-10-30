import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Seguridad() {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Estados para el icono del "ojo" en cada campo de contraseña
    const [mostrarCurrentPassword, setMostrarCurrentPassword] = useState(false);
    const [mostrarNewPassword, setMostrarNewPassword] = useState(false);
    const [mostrarConfirmPassword, setMostrarConfirmPassword] = useState(false);

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        // 1. Verificación local de que las contraseñas nuevas coincidan
        if (newPassword !== confirmPassword) {
            return setError('La nueva contraseña y la confirmación no coinciden.');
        }

        const token = localStorage.getItem('token');
        if (!token) {
            return navigate('/login');
        }

        try {
            // Envío de datos al endpoint
            const response = await axios.put(
                'http://localhost:3000/users/password',
                { currentPassword, newPassword },
                { headers: { authorization: token } }
            );

            setMessage(response.data.message || 'Contraseña actualizada correctamente.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            // Muestra error del backend (ej: "la contraseña actual es incorrecta")
            setError(err.response?.data?.message || 'Error al cambiar la contraseña.');
        }
    };

    return (
        <div style={style.pagina}>
            {/* Menú lateral (igual que en Editar perfil) */}
            <aside style={style.menuLateral}>
                <div style={style.tituloMenu}>Configuración</div>
                <button style={style.opcionMenu} onClick={() => navigate('/editar-perfil')}>Cuenta</button>
                <button style={style.opcionMenu} onClick={() => navigate('/perfil-publico')}>Perfil público</button>
                <button style={style.opcionMenuActiva}>Seguridad</button>
                <button style={style.opcionMenu} onClick={() => navigate('/privacidad')}>Privacidad</button>
            </aside>

            <section style={style.contenido}>
                <h1 style={style.titulo}>Seguridad</h1>
                <p style={style.subtitulo}>Cambiá tu contraseña para mantener tu cuenta protegida.</p>

                <form style={style.tarjeta} onSubmit={handleSubmit}>
                    <h3 style={style.tituloTarjeta}>Cambiar contraseña</h3>
                    <p style={style.textoTarjeta}>Necesitás tu contraseña actual para poder cambiarla.</p>

                    {message && <p style={style.mensajeOk}>{message}</p>}
                    {error && <p style={style.mensajeError}>{error}</p>}

                    {/* Contraseña actual con Ojo */}
                    <div style={style.grupo}>
                        <label style={style.etiqueta}>Contraseña actual</label>
                        <div style={style.contenedorPassword}>
                            <input
                                type={mostrarCurrentPassword ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                style={style.campoPassword}
                            />
                            <button
                                type="button"
                                onClick={() => setMostrarCurrentPassword(!mostrarCurrentPassword)}
                                style={style.botonOjo}
                                title={mostrarCurrentPassword ? "Ocultar contraseña" : "Ver contraseña"}
                            >
                                {renderEyeIcon(mostrarCurrentPassword)}
                            </button>
                        </div>
                    </div>

                    {/* Nueva contraseña con Ojo */}
                    <div style={style.grupo}>
                        <label style={style.etiqueta}>Nueva contraseña</label>
                        <div style={style.contenedorPassword}>
                            <input
                                type={mostrarNewPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                style={style.campoPassword}
                            />
                            <button
                                type="button"
                                onClick={() => setMostrarNewPassword(!mostrarNewPassword)}
                                style={style.botonOjo}
                                title={mostrarNewPassword ? "Ocultar contraseña" : "Ver contraseña"}
                            >
                                {renderEyeIcon(mostrarNewPassword)}
                            </button>
                        </div>
                    </div>

                    {/* Confirmar nueva contraseña con Ojo */}
                    <div style={style.grupo}>
                        <label style={style.etiqueta}>Confirmar nueva contraseña</label>
                        <div style={style.contenedorPassword}>
                            <input
                                type={mostrarConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                style={style.campoPassword}
                            />
                            <button
                                type="button"
                                onClick={() => setMostrarConfirmPassword(!mostrarConfirmPassword)}
                                style={style.botonOjo}
                                title={mostrarConfirmPassword ? "Ocultar contraseña" : "Ver contraseña"}
                            >
                                {renderEyeIcon(mostrarConfirmPassword)}
                            </button>
                        </div>
                    </div>

                    <div style={style.acciones}>
                        <button type="submit" style={style.botonPrincipal}>
                            Guardar cambios
                        </button>
                    </div>
                </form>
            </section>
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

// Estilos de la página de seguridad
const style = {
    pagina: { display: 'flex', gap: '28px', padding: '32px', alignItems: 'flex-start', flexWrap: 'wrap', boxSizing: 'border-box', background: '#0b0b1c', minHeight: '85vh' },
    menuLateral: { width: '230px', padding: '22px 14px', borderRadius: '20px', backgroundColor: '#17152b', border: '1px solid #26233d', display: 'flex', flexDirection: 'column', gap: '8px', boxSizing: 'border-box' },
    tituloMenu: { color: '#e2e8f0', fontSize: '15px', padding: '0 10px 14px' },
    opcionMenu: { padding: '13px 14px', borderRadius: '10px', fontSize: '14px', textAlign: 'left', color: '#cbd5e1', backgroundColor: 'transparent', border: '1px solid transparent', cursor: 'pointer' },
    opcionMenuActiva: { padding: '13px 14px', borderRadius: '10px', fontSize: '14px', textAlign: 'left', color: '#ffffff', backgroundColor: '#2e2a5c', border: '1px solid #8b5cf6', cursor: 'pointer' },
    opcionMenuDeshabilitada: { padding: '13px 14px', borderRadius: '10px', fontSize: '14px', textAlign: 'left', color: '#cbd5e1', backgroundColor: 'transparent', border: '1px solid transparent', opacity: 0.6, cursor: 'not-allowed' },
    contenido: { flex: 1, minWidth: '300px' },
    titulo: { color: '#ffffff', fontSize: '40px', fontWeight: '700', margin: '0 0 6px' },
    subtitulo: { color: '#a5a5d0', fontSize: '15px', margin: '0 0 24px' },
    tarjeta: { maxWidth: '500px', padding: '24px 26px', borderRadius: '18px', backgroundColor: '#17152b', border: '1px solid #26233d', boxShadow: '0 15px 35px rgba(0, 0, 0, 0.35)', boxSizing: 'border-box' },
    tituloTarjeta: { color: '#ffffff', fontSize: '19px', fontWeight: '600', margin: '0 0 4px' },
    textoTarjeta: { color: '#a5a5d0', fontSize: '13px', margin: '0 0 24px' },
    grupo: { marginBottom: '18px' },
    etiqueta: { display: 'block', color: '#e2e8f0', fontSize: '14px', marginBottom: '8px' },
    campo: { width: '100%', height: '46px', padding: '0 14px', borderRadius: '10px', backgroundColor: '#141229', border: '1px solid #2a2842', color: '#e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
    contenedorPassword: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    },
    campoPassword: {
        width: '100%',
        height: '46px',
        padding: '0 46px 0 14px',
        borderRadius: '10px',
        backgroundColor: '#141229',
        border: '1px solid #2a2842',
        color: '#e2e8f0',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
    },
    botonOjo: {
        position: 'absolute',
        right: '12px',
        background: 'transparent',
        border: 'none',
        color: '#94a3b8',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px',
    },
    acciones: { display: 'flex', justifyContent: 'flex-end', marginTop: '6px' },
    botonPrincipal: { padding: '13px 28px', border: 'none', borderRadius: '10px', backgroundColor: '#7c5cf0', color: '#ffffff', fontWeight: '600', fontSize: '14px', cursor: 'pointer' },
    mensajeOk: { color: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '10px', borderRadius: '8px', fontSize: '14px', margin: '0 0 18px' },
    mensajeError: { color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', fontSize: '14px', margin: '0 0 18px' },
};

export default Seguridad;