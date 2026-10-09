import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        // Validamos que sea Admin y traemos los usuarios
        axios.get('http://localhost:3000/users', {
            headers: { authorization: token }
        })
        .then(res => setUsers(res.data))
        .catch(() => {
            alert('No tienes permisos para ver esta sección.');
            navigate('/profile');
        });
    }, [navigate]);

    const deleteUserByAdmin = async (id) => {
        if (!window.confirm("¿Eliminar usuario?")) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:3000/users/${id}`, {
                headers: { authorization: token }
            });
            setUsers(users.filter(u => u.id !== id));
        } catch (error) {
            alert("Error al eliminar usuario.");
        }
    };

    return (
        <div style={{ padding: '40px', color: 'white' }}>
            <h2>Panel de Administración - Gestión de Usuarios</h2>
            <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #4b5563' }}>
                        <th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #374151' }}>
                            <td>{u.id}</td>
                            <td>{u.firstName} {u.lastName}</td>
                            <td>{u.email}</td>
                            <td>{u.rol}</td>
                            <td>
                                <button onClick={() => deleteUserByAdmin(u.id)} style={{ color: '#ef4444' }}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminDashboard;