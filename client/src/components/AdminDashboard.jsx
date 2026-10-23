import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    
    // Estados para controlar qué usuario se está editando actualmente
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ firstName: '', lastName: '', email: '', rol: '' });

    // Estados para el formulario de "Crear usuario"
    const emptyNewUser = { firstName: '', lastName: '', email: '', password: '', rol: 'user' };
    const [showCreate, setShowCreate] = useState(false);
    const [newUser, setNewUser] = useState(emptyNewUser);
    const [createError, setCreateError] = useState('');

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

    // Activa el modo edición para un usuario específico y carga sus datos en el form
    const startEditing = (user) => {
        setEditingId(user.id);
        setEditForm({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            rol: user.rol
        });
    };

    // Cancela la edición
    const cancelEditing = () => {
        setEditingId(null);
        setEditForm({ firstName: '', lastName: '', email: '', rol: '' });
    };

    // Guarda los cambios hechos por el admin
    const saveUserChanges = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.put(`http://localhost:3000/users/${id}`, editForm, {
                headers: { authorization: token }
            });

            // Actualizamos la tabla localmente con la respuesta del backend
            setUsers(users.map(u => u.id === id ? res.data.user : u));
            alert("Usuario actualizado correctamente.");
            cancelEditing();
        } catch (error) {
            alert(error.response?.data?.message || "Error al actualizar el usuario.");
        }
    };

    // Crea un usuario nuevo llamando a POST /admin/users
    const createUser = async (e) => {
        e.preventDefault();
        setCreateError('');
        const token = localStorage.getItem('token');
        try {
            const res = await axios.post('http://localhost:3000/admin/users', newUser, {
                headers: { authorization: token }
            });

            // Agregamos el usuario nuevo a la tabla sin recargar
            setUsers([...users, res.data.user]);
            setNewUser(emptyNewUser);
            setShowCreate(false);
        } catch (error) {
            // Mostramos el mensaje del backend (ej: "Ese email ya existe")
            setCreateError(error.response?.data?.message || 'Error al crear el usuario.');
        }
    };

    const inputStyle = { padding: '8px', background: '#1f2937', color: 'white', border: '1px solid #4b5563', borderRadius: '4px' };

    return (
        <div style={{ padding: '40px', color: 'white' }}>
            <h2>Panel de Administración - Gestión de Usuarios</h2>

            <button
                onClick={() => { setShowCreate(!showCreate); setCreateError(''); }}
                style={{ color: 'white', backgroundColor: '#7c5cf0', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' }}>
                {showCreate ? 'Cerrar formulario' : 'Crear usuario'}
            </button>

            {showCreate && (
                <form onSubmit={createUser} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px', alignItems: 'center' }}>
                    <input type="text" placeholder="Nombre" required value={newUser.firstName}
                        onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })} style={inputStyle} />
                    <input type="text" placeholder="Apellido" value={newUser.lastName}
                        onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })} style={inputStyle} />
                    <input type="email" placeholder="Email" required value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} style={inputStyle} />
                    <input type="password" placeholder="Contraseña" required value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} style={inputStyle} />
                    <select value={newUser.rol} onChange={(e) => setNewUser({ ...newUser, rol: e.target.value })} style={inputStyle}>
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                    </select>
                    <button type="submit"
                        style={{ color: '#22c55e', backgroundColor: 'transparent', border: '1px solid #22c55e', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                        Guardar
                    </button>
                    {createError && <p style={{ color: '#ef4444', width: '100%', margin: 0 }}>{createError}</p>}
                </form>
            )}

            <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #4b5563', padding: '10px' }}>
                        <th>ID</th><th>Nombre y Apellido</th><th>Email</th><th>Rol</th><th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => {
                        const isEditing = editingId === u.id;
                        return (
                            <tr key={u.id} style={{ borderBottom: '1px solid #374151' }}>
                                <td style={{ padding: '12px 0' }}>{u.id}</td>
                                
                                {/* Si está en modo edición mostramos Inputs, sino el texto normal */}
                                <td>
                                    {isEditing ? (
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <input 
                                                type="text" 
                                                value={editForm.firstName} 
                                                onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                                                style={{ padding: '4px', background: '#1f2937', color: 'white', border: '1px solid #4b5563', borderRadius: '4px' }}
                                            />
                                            <input 
                                                type="text" 
                                                value={editForm.lastName} 
                                                onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                                                style={{ padding: '4px', background: '#1f2937', color: 'white', border: '1px solid #4b5563', borderRadius: '4px' }}
                                            />
                                        </div>
                                    ) : (
                                        `${u.firstName} ${u.lastName}`
                                    )}
                                </td>

                                <td>
                                    {isEditing ? (
                                        <input 
                                            type="email" 
                                            value={editForm.email} 
                                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                            style={{ padding: '4px', background: '#1f2937', color: 'white', border: '1px solid #4b5563', borderRadius: '4px' }}
                                        />
                                    ) : (
                                        u.email
                                    )}
                                </td>

                                <td>
                                    {isEditing ? (
                                        <select 
                                            value={editForm.rol} 
                                            onChange={(e) => setEditForm({...editForm, rol: e.target.value})}
                                            style={{ padding: '4px', background: '#1f2937', color: 'white', border: '1px solid #4b5563', borderRadius: '4px' }}
                                        >
                                            <option value="user">user</option>
                                            <option value="admin">admin</option>
                                        </select>
                                    ) : (
                                        u.rol
                                    )}
                                </td>

                                <td>
                                    {isEditing ? (
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button 
                                                onClick={() => saveUserChanges(u.id)}
                                                style={{ color: '#22c55e', backgroundColor: 'transparent', border: '1px solid #22c55e', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>
                                                Guardar
                                            </button>
                                            <button 
                                                onClick={cancelEditing}
                                                style={{ color: '#a1a1aa', backgroundColor: 'transparent', border: '1px solid #a1a1aa', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>
                                                Cancelar
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button 
                                                onClick={() => startEditing(u)}
                                                style={{ color: '#3b82f6', backgroundColor: 'transparent', border: '1px solid #3b82f6', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => deleteUserByAdmin(u.id)} 
                                                style={{ color: '#ef4444', backgroundColor: 'transparent', border: '1px solid #ef4444', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>
                                                Eliminar
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default AdminDashboard;