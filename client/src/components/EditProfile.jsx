import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditProfile() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Primero debes iniciar sesión.');
            navigate('/login');
            return;
        }

        // Carga opcional inicial desde backend o localStorage
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:3000/me', {
                    headers: { authorization: token }
                });
                setFirstName(response.data.firstName || '');
            } catch (error) {
                console.error('Error al cargar datos:', error);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            // Petición al backend para actualizar la BD
            await axios.put('http://localhost:3000/users/update', {
                firstName: firstName
            }, {
                headers: { authorization: token }
            });

            // Opcional: Actualizamos también localStorage para persistencia visual
            localStorage.setItem('userName', firstName);

            alert('Perfil actualizado en la base de datos con éxito.');
            navigate('/profile');
        } catch (error) {
            console.error(error);
            alert('Error al actualizar el perfil en el servidor');
        }
    };

    return (
        <div style={style.cont}>
            <div style={style.card}>
                <h2 style={style.title}>Editar perfil</h2>
                <form onSubmit={handleSubmit} style={style.form}>
                    <div style={style.inputGroup}>
                        <label style={style.label}>Nombre</label>
                        <input 
                            type="text" 
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)}
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
    cont: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '32px' },
    card: { backgroundColor: '#1f2937', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' },
    title: { fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '24px', textAlign: 'center' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '14px', color: '#9ca3af', fontWeight: '600' },
    input: { backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', padding: '12px', color: '#ffffff', fontSize: '16px', outline: 'none' },
    btnSave: { backgroundColor: '#7c3aed', color: '#ffffff', border: 'none', borderRadius: '20px', padding: '12px', fontWeight: '600', cursor: 'pointer', marginTop: '10px' },
};

export default EditProfile;