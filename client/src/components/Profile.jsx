import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({ name: '', email: '' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            alert('Primero debes iniciar sesión.');
            navigate('/login');
            return;
        }

        // Obtenemos los datos del usuario guardados durante el login en el localStorage
        const storedName = localStorage.getItem('userName') || 'Usuario';
        const storedEmail = localStorage.getItem('userEmail') || 'correo@example.com';

        setUserData({
            name: storedName,
            email: storedEmail
        });
    }, [navigate]);

    return (
        <div style={style.cont}>
            <div style={style.card}>
                <div style={style.avatarPlaceholder}>
                    {userData.name ? userData.name.substring(0, 2).toUpperCase() : 'US'}
                </div>
                <h2 style={style.name}>{userData.name}</h2>
                <p style={style.email}>{userData.email}</p>
                
                {/* Botón para Editar Perfil */}
                <button 
                    style={style.btnEdit} 
                    onClick={() => navigate('/editar-perfil')}
                >
                    Editar perfil
                </button>
            </div>
        </div>
    );
}

const style = {
    cont: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
        padding: '32px',
    },
    card: {
        backgroundColor: '#1f2937',
        padding: '40px',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    },
    avatarPlaceholder: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#7c3aed',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: '16px',
    },
    name: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#ffffff',
        margin: '0 0 4px 0',
    },
    email: {
        fontSize: '14px',
        color: '#9ca3af',
        marginBottom: '24px',
    },
    btnEdit: {
        backgroundColor: 'transparent',
        color: '#a78bfa',
        border: '1px solid #7c3aed',
        padding: '10px 24px',
        borderRadius: '20px',
        fontWeight: '600',
        cursor: 'pointer',
        width: '100%',
        transition: 'background-color 0.2s',
    },
};

export default Profile;