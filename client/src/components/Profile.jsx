import Button from '@mui/material/Button';
import { useEffect } from 'react';
import axios from 'axios'
import { useState } from 'react';

function Profile() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    
    //Nos sirve para saber si el usuario tiene permiso (está logueado) o no
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    //El useEffect significa: "Ejecutá fetchMyProfile una sola vez, apenas se dibuje la pantalla".
    useEffect(() => {
        fetchMyProfile();
    }, []);

    const fetchMyProfile = async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            setIsLoggedIn(false);
            return;
        }

        setIsLoggedIn(true);

        try {
            // Hacemos un GET a la ruta que te devuelve tus propios datos.
            const response = await axios.get('http://localhost:3000/me', {
                headers: {
                    authorization: token
                }
            });
            
            // Llenamos con los datos que nos devolvió la base de datos
            setFirstName(response.data.firstName || '');
            setLastName(response.data.lastName || '');
            setEmail(response.data.email || '');
            
        } catch (error) {
            console.error(error);
            alert("No se pudo cargar tu información");
        }
    };

    const updateProfile = async (e) => {
        const token = localStorage.getItem('token');

        try {
            // Hacemos un PUT para actualizar los datos en el servidor
            const response = await axios.put('http://localhost:3000/users/update', {
                firstName,
                lastName,
                email
            }, {
                headers: {
                    authorization: token
                }
            });

            if (response.status === 200) {
                alert("¡Perfil actualizado con éxito!");
            }
        } catch (error) {
            alert("Error al actualizar el perfil");
        }
    };


    return (
        <>
        <div className="login-background">
            <div className="login-card" style={{ maxWidth: '600px' }}> 
                
                {/* Si isLoggedIn es TRUE, mostramos el formulario. Si es FALSE, mostramos el mensaje de error. */}
                {isLoggedIn ? (
                    <>
                        <h2>Mi Perfil</h2>
                        <form>
                            <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px', color: '#a78bfa' }}>Nombre</label>
                            <input 
                                type="text" 
                                value={firstName} 
                                onChange={(event) => setFirstName(event.target.value)} 
                            />
                            
                            <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px', color: '#a78bfa' }}>Apellido</label>
                            <input 
                                type="text" 
                                value={lastName} 
                                onChange={(event) => setLastName(event.target.value)} 
                            />
                            
                            <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px', color: '#a78bfa' }}>Correo electrónico</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(event) => setEmail(event.target.value)} 
                            />
                            
                            <Button variant='contained' onClick={updateProfile} style={{ marginTop: '1rem', backgroundColor: '#7c3aed' }}> Editar Pefil </Button>
                        </form>
                    </>
                ) : (
                    <h2>Debés iniciar sesión para ver tu perfil</h2>
                )}

            </div>
        </div>
        </>
    )
}

export default Profile;