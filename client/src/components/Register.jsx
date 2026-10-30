import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../img/logo.png';
import fondo from '../img/Arcos orbitales bajo estrellas violetas.png';

function Register() {
    const navigate = useNavigate();

    // Estados para guardar lo que el usuario escribe
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Estados para el icono del "ojo" en ambos campos de contraseña
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [mostrarConfirmPassword, setMostrarConfirmPassword] = useState(false);

    // Función que se ejecuta al enviar el formulario
    const registerUser = async (e) => {
        e.preventDefault(); // Evita que la página se recargue

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/users', {
                password,
                email,
                firstName,
                lastName
            });

            // Si se creó correctamente (status 201)
            if (response.status === 201) {
                alert("Cuenta creada, ya podés iniciar sesión");
                navigate('/login');
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Error al registrar el usuario. Es posible que el correo ya esté en uso.");
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

            <div style={styles.tarjeta}>
                <h2 style={styles.titulo}>
                    Crear <span style={styles.tituloResaltado}>cuenta</span>
                </h2>
                <p style={styles.subtitulo}>
                    Unite a DigitalNight y comenzá a explorar una nueva forma de aprender.
                </p>

                <form onSubmit={registerUser} style={styles.formulario}>
                    <div style={styles.fila}>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            style={styles.campo}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Apellido"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            style={styles.campo}
                            required
                        />
                    </div>

                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.campo}
                        required
                    />

                    {/* Contraseña con Ojo limpio */}
                    <div style={styles.contenedorPassword}>
                        <input
                            type={mostrarPassword ? 'text' : 'password'}
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.campoPassword}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarPassword(!mostrarPassword)}
                            style={styles.botonOjo}
                            title={mostrarPassword ? "Ocultar contraseña" : "Ver contraseña"}
                        >
                            {renderEyeIcon(mostrarPassword)}
                        </button>
                    </div>

                    {/* Confirmar Contraseña con Ojo limpio */}
                    <div style={styles.contenedorPassword}>
                        <input
                            type={mostrarConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirmar contraseña"
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

                    <button type="submit" style={styles.botonPrincipal}>
                        Registrarse
                    </button>
                </form>

                <div style={styles.separador}>
                    <div style={styles.lineaSeparador}></div>
                    <span style={styles.textoSeparador}>¿Ya tenés una cuenta?</span>
                    <div style={styles.lineaSeparador}></div>
                </div>

                <button onClick={() => navigate('/login')} style={styles.botonSecundario}>
                    Iniciar sesión
                </button>
            </div>
        </div>
    );
}

// Función auxiliar para renderizar el ícono del ojo (ubicada antes de los estilos)
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
        maxWidth: '440px',
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
        lineHeight: 1.5,
        margin: '0 0 26px 0',
        textAlign: 'center',
    },
    formulario: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    fila: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
    },
    campo: {
        width: '100%',
        minWidth: 0,
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
    contenedorPassword: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    },
    campoPassword: {
        width: '100%',
        height: '48px',
        padding: '0 46px 0 16px', // Espacio reservado a la derecha para que el texto no toque el ojo
        backgroundColor: '#141229',
        border: '1px solid rgba(255, 255, 255, 0.09)',
        borderRadius: '10px',
        color: '#ffffff',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
    },
    botonOjo: {
        position: 'absolute',
        right: '12px',
        background: 'transparent',
        border: 'none',
        color: '#a1a1c5',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px',
    },
    botonPrincipal: {
        marginTop: '10px',
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

export default Register;