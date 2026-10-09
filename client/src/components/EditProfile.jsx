import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EditProfile() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');

    useEffect(() => {
        e.preventDefault(); // Evita que la página se recargue al enviar el formulario

        const token = localStorage.getItem('token');
        
        if (!token) {
            alert('Primero debes iniciar sesión.');
            navigate('/login');
            return;
        }

        // Cargamos el nombre actual guardado para mostrarlo en el input
        const currentName = localStorage.getItem('userName') || '';
        setUsername(currentName);
    }, [navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Guardamos el nuevo nombre actualizado en el localStorage
        localStorage.setItem('userName', username);
        
        alert('Perfil actualizado correctamente.');
        navigate('/profile');
    };

    return (
        <div style={style.cont}>
            <div style={style.card}>
                <h2 style={style.title}>Editar perfil</h2>
                <form onSubmit={handleSubmit} style={style.form}>
                    <div style={style.inputGroup}>
                        <label style={style.label}>Nombre de usuario</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)}
                            style={style.input} 
                            placeholder="Tu nombre"
                        />
                    </div>
                    <button type="submit" style={style.btnSave}>
                        Guardar cambios
                    </button>
                </form>
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
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    },
    title: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: '24px',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    label: {
        fontSize: '14px',
        color: '#9ca3af',
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#111827',
        border: '1px solid #374151',
        borderRadius: '8px',
        padding: '12px',
        color: '#ffffff',
        fontSize: '16px',
        outline: 'none',
    },
    btnSave: {
        backgroundColor: '#7c3aed',
        color: '#ffffff',
        border: 'none',
        borderRadius: '20px',
        padding: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '10px',
    },
};

export default EditProfile;