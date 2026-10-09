import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../img/logo.png';
import fondo from '../img/Arcos orbitales bajo estrellas violetas.png';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Evita que la página se recargue al enviar el formulario

        try {
            const response = await axios.post('http://localhost:3000/login', {
                email,
                password
            });

            // Guardamos el token de sesión
            localStorage.setItem('token', response.data.token);

            // Guardamos el correo (que ya tenemos en el estado) y el nombre (que debería venir de tu backend)
            // Si el backend lo manda diferente, ajustá 'response.data.name' a como lo devuelva tu API
            const userName = response.data.name || response.data.user?.name || 'Amy';
            localStorage.setItem('userName', userName);
            localStorage.setItem('userEmail', email);

            navigate('/editar-perfil');
        }
        catch {
            alert("Error: Correo o contraseña incorrectos.");
        }
    };

    return (
        <div style={styles.contenedor}>
            <div style={styles.contenedorLogo}>
                <img src={logo} alt="" style={styles.logoImagen} />
                <div style={styles.logoTexto}>
                    DIGITAL<span style={styles.logoTextoResaltado}>NIGHT</span>
                </div>
            </div>

            {/* Tarjeta de Login */}
            <div style={styles.tarjeta}>
                <h2 style={styles.titulo}>Iniciar <span style={styles.tituloResaltado}>sesión</span></h2>
                <p style={styles.subtitulo}>Volvé a tu cuenta y seguí explorando.</p>

                <form onSubmit={handleLogin} style={styles.formulario}>
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.campo}
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.campo}
                    />

                    {/* Opciones */}
                    <div style={styles.opciones}>
                        <label style={styles.etiquetaCheckbox}>
                            <input type="checkbox" style={styles.casilla} />
                            Recordarme
                        </label>
                        <a href="#" style={styles.enlaceOlvido}>¿Olvidaste tu contraseña?</a>
                    </div>

                    <button type="submit" style={styles.botonPrincipal}>
                        Iniciar sesión
                    </button>
                </form>

                {/* Separador con líneas */}
                <div style={styles.separador}>
                    <div style={styles.lineaSeparador}></div>
                    <span style={styles.textoSeparador}>¿No tenés una cuenta?</span>
                    <div style={styles.lineaSeparador}></div>
                </div>

                <button onClick={() => navigate('/register')} style={styles.botonSecundario}>
                    Registrarse
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
        fontWeight: '700',
        fontSize: '19px',
        color: '#ffffff',
        letterSpacing: '4px',
    },
    logoTextoResaltado: {
        color: '#818cf8',
    },
    tarjeta: {
        backgroundColor: 'rgba(23, 21, 43, 0.55)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        borderRadius: '24px',
        padding: '36px 32px 32px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.45)',
        boxSizing: 'border-box',
    },
    titulo: {
        color: '#ffffff',
        fontSize: '30px',
        margin: '0 0 10px 0',
        fontWeight: '600',
        textAlign: 'center',
    },
    tituloResaltado: {
        color: '#8b5cf6',
    },
    subtitulo: {
        color: '#a1a1c5',
        fontSize: '13px',
        margin: '0 0 26px 0',
        textAlign: 'center',
    },
    formulario: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    campo: {
        width: '100%',
        height: '48px',
        padding: '0 16px',
        backgroundColor: '#141229',
        border: '1px solid rgba(255, 255, 255, 0.09)',
        borderRadius: '10px',
        color: '#ffffff',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
    },
    opciones: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
        color: '#a1a1c5',
        marginTop: '2px',
    },
    etiquetaCheckbox: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
    },
    casilla: {
        accentColor: '#8b5cf6',
        width: '14px',
        height: '14px',
        cursor: 'pointer',
    },
    enlaceOlvido: {
        color: '#8b8cff',
        textDecoration: 'none',
    },
    botonPrincipal: {
        marginTop: '4px',
        height: '50px',
        border: 'none',
        borderRadius: '14px',
        background: 'linear-gradient(90deg, #6d8cff, #8b5cf6)',
        color: '#ffffff',
        fontWeight: '600',
        fontSize: '15px',
        cursor: 'pointer',
        boxShadow: '0 6px 22px rgba(124, 92, 246, 0.4)',
    },
    separador: {
        display: 'flex',
        alignItems: 'center',
        margin: '24px 0 16px',
        color: '#8b8bab',
        fontSize: '12px',
    },
    lineaSeparador: {
        flex: 1,
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    },
    textoSeparador: {
        padding: '0 12px',
    },
    botonSecundario: {
        backgroundColor: 'rgba(15, 13, 30, 0.35)',
        color: '#e2e8f0',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        height: '46px',
        borderRadius: '12px',
        fontWeight: '600',
        fontSize: '14px',
        cursor: 'pointer',
        width: '100%',
    },
};

export default Login;
