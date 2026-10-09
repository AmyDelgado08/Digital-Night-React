import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        // Pedimos la lista completa. Si no es Admin, el backend devolverá 403 y saltará al .catch()
        axios.get('http://localhost:3000/users', {
            headers: { authorization: token }
        })
        .then(res => setUsers(res.data))
        .catch(() => {
            alert('No tienes permisos de administrador para ver esta sección.');
            navigate('/perfil-publico'); // Expulsa al usuario al perfil
        });
    }, [navigate]);

    const deleteUserByAdmin = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:3000/users/${id}`, {
                headers: { authorization: token }
            });
            setUsers(users.filter(u => u.id !== id)); // Quita el usuario de la tabla sin recargar
        } catch (error) {
            alert("Error al eliminar el usuario.");
        }
    };

    return (
        <div style={{ padding: '40px', color: 'white' }}>
            <h2>Panel de Administración - Gestión de Usuarios</h2>
            <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #4b5563', padding: '10px' }}>
                        <th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #374151' }}>
                            <td style={{ padding: '12px 0' }}>{u.id}</td>
                            <td>{u.firstName} {u.lastName}</td>
                            <td>{u.email}</td>
                            <td>{u.rol}</td>
                            <td>
                                <button 
                                    onClick={() => deleteUserByAdmin(u.id)} 
                                    style={{ color: '#ef4444', backgroundColor: 'transparent', border: '1px solid #ef4444', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>
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