import Button from '@mui/material/Button';
import { useState } from 'react';
import axios from 'axios'

function Register() {
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    //Le pasamos las 4 variables que guardan lo que el usuario escribió.
    const registerUser = async () => {
        // Evita que la página se recargue al enviar el formulario

        const response = await axios.post('http://localhost:3000/users', {
            password,
            email,
            firstName,
            lastName
        })

        //Imprimimos en la consola lo que responde el servidor para control
        // localStorage.setItem('token', response.data.token)
        console.log(response.data);

        if (response.status === 200) {
            alert("Salio todo bien")

            //Vaciamos todas las memorias.
            //al ponerlas en "", el formulario vuelve a quedar totalmente en blanco.
            setEmail("")
            setPassword("")
            setFirstName("")
            setLastName("")
        }
    }

    return (
        <>
            <div style={styles.container}>
                <div style={styles.logoContainer}>
                    <span style={styles.logoStar}>✦</span>
                    <div style={styles.logoText}>
                        DIGITAL<span style={styles.logoTextHighlight}>NIGHT</span>
                    </div>
                </div>

                <div style={styles.card}>
                    <h2 style={styles.title}>
                        Crear <span style={styles.titleHighlight}>cuenta</span>
                    </h2>

                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        style={styles.input}
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        style={styles.input}
                    />

                    <input
                        type="text"
                        placeholder="Nombre"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        style={styles.input}
                    />

                    <input
                        type="text"
                        placeholder="Apellido"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        style={styles.input}
                    />

                    <Button
                        variant='contained'
                        onClick={registerUser}
                        style={styles.primaryBtn}
                    >
                        Registrarse
                    </Button>
                </div>
            </div>
        </>
    )
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '85vh',
        flexDirection: 'column',
        marginBottom:'50px',
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
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    title: {
        color: '#ffffff',
        fontSize: '27px',
        margin: '0 0 16px 0',
        fontWeight: '600',
        textAlign: 'center',
    },
    titleHighlight: {
        color: '#8b5cf6',
    },
    input: {
        width: '100%',
        padding: '14px 16px',
        backgroundColor: 'rgba(15, 13, 25, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '10px',
        color: '#ffffff',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
    },
    primaryBtn: {
        background: 'linear-gradient(90deg, #7c3aed, #4f46e5)',
        color: '#ffffff',
        padding: '14px',
        borderRadius: '10px',
        fontWeight: '600',
        fontSize: '14px',
        marginTop: '8px',
        boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)',
    }
};

export default Register;