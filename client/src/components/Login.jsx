import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

            navigate('/profile');
        } 
        catch (error) {
            alert("Error: Correo o contraseña incorrectos.");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.logoContainer}>

                <span style={styles.logoStar}>✦</span>
                <div style={styles.logoText}>
                    DIGITAL<span style={styles.logoTextHighlight}>NIGHT</span>
                </div>
            </div>

            {/* Tarjeta de Login */}
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Iniciar <span style={styles.titleHighlight}>sesión</span></h2>
                    <p style={styles.subtitle}>Volvé a tu cuenta y seguí jugando.</p>
                </div>
                
                <form onSubmit={handleLogin} style={styles.form}>
                    {/* Input Correo */}
                    <div style={styles.inputWrapper}>
                        <input 
                            type="email" 
                            placeholder="Nombre de usuario" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            style={styles.input}
                            required
                        />
                    </div>

                    {/* Input Contraseña */}
                    <div style={styles.inputWrapper}>
                        <input 
                            type="password" 
                            placeholder="Contraseña" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            style={styles.input}
                            required
                        />
                    </div>

                    {/* Opciones */}
                    <div style={styles.options}>
                        <label style={styles.checkboxLabel}>
                            <input type="checkbox" style={styles.checkbox} />
                            Recordarme
                        </label>
                        <a href="#" style={styles.forgotLink}>¿Olvidaste tu contraseña?</a>
                    </div>
                    
                    {/* Botón Principal */}
                    <button type="submit" style={styles.primaryBtn}>
                        Iniciar sesión
                    </button>
                </form>

                {/* Separador con líneas */}
                <div style={styles.dividerContainer}>
                    <div style={styles.dividerLine}></div>
                    <span style={styles.dividerText}>¿No tenés una cuenta?</span>
                    <div style={styles.dividerLine}></div>
                </div>

                {/* Botón Secundario */}
                <button onClick={() => navigate('/register')} style={styles.secondaryBtn}>
                    Registrarse
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '85vh',
        flexDirection: 'column',
    },
    logoContainer: {
        textAlign: 'center',
        marginBottom: '32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    logoStar: {
        color: '#ffffff',
        fontSize: '48px',
        marginBottom: '10px',
        textShadow: '0 0 20px rgba(167, 139, 250, 0.8)', 
    },
    logoText: {
        fontWeight: '700',
        fontSize: '19px',
        color: '#ffffff',
        letterSpacing: '2px',
    },
    logoTextHighlight: {
        color: '#6366f1', 
    },
    card: {
        backgroundColor: 'rgba(23, 21, 43, 0.6)', 
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '20px', 
        padding: '40px 32px',
        width: '100%',
        maxWidth: '360px',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)',
        boxSizing: 'border-box',
    },
    header: {
        textAlign: 'center',
        marginBottom: '32px',
    },
    title: {
        color: '#ffffff',
        fontSize: '27px',
        margin: '0 0 8px 0',
        fontWeight: '600',
    },
    titleHighlight: {
        color: '#8b5cf6', 
    },
    subtitle: {
        color: '#94a3b8',
        fontSize: '13px',
        margin: '0',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    inputWrapper: {
        position: 'relative',
        width: '100%',
    },
    input: {
        width: '100%',
        padding: '14px 40px', 
        backgroundColor: 'rgba(15, 13, 25, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '10px',
        color: '#ffffff',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border 0.3s',
    },
    options: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
        color: '#94a3b8',
        marginTop: '3px',
        marginBottom: '8px',
    },
    checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
    },
    checkbox: {
        accentColor: '#8b5cf6',
        width: '14px',
        height: '14px',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: '1px solid #64748b',
    },
    forgotLink: {
        color: '#8b5cf6',
        textDecoration: 'none',
    },
    primaryBtn: {
        background: 'linear-gradient(90deg, #7c3aed, #4f46e5)', 
        color: '#ffffff',
        border: 'none',
        padding: '14px',
        borderRadius: '10px',
        fontWeight: '600',
        fontSize: '14px',
        cursor: 'pointer',
        marginTop: '8px',
        boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)',
    },
    dividerContainer: {
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        margin: '28px 0 19px 0',
        color: '#64748b',
        fontSize: '12px',
    },
    dividerLine: {
        flex: 1,
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    },
    dividerText: {
        padding: '0 12px',
    },
    secondaryBtn: {
        backgroundColor: 'transparent',
        color: '#e2e8f0',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        padding: '13px',
        borderRadius: '10px',
        fontWeight: '600',
        fontSize: '14px',
        cursor: 'pointer',
        width: '100%',
    }
};

export default Login;