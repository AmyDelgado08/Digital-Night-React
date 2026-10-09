import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditProfile() {
    const navigate = useNavigate();

    // Variables de estado para guardar los valores de cada campo del formulario
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [birthdate, setBirthdate] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Primero debes iniciar sesión.');
            navigate('/login');
            return;
        }

        // Traemos los datos reales del usuario desde el backend
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/me', {
                    headers: { Authorization: token }
                });

                setFirstName(response.data.firstName || '');
                setLastName(response.data.lastName || '');
                setEmail(response.data.email || '');

                // Formateamos la fecha para que el input type="date" no se bloquee
                if (response.data.birthdate) {
                    setBirthdate(response.data.birthdate.split('T')[0]);
                }
            } catch (error) {
                console.error("Error al cargar los datos:", error);

                // Respaldo: si falla la BD, intentamos mostrar lo del localStorage
                setFirstName(localStorage.getItem('userFirstName') || '');
                setLastName(localStorage.getItem('userLastName') || '');
                setEmail(localStorage.getItem('userEmail') || '');
                const rawDate = localStorage.getItem('userBirthdate') || '';
                setBirthdate(rawDate ? rawDate.split('T')[0] : '');
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');

            // Enviamos los datos actualizados a la base de datos
            await axios.put('http://localhost:3000/users/update', {
                firstName,
                lastName,
                birthdate
            }, {
                headers: { Authorization: token }
            });

            // Guardamos también los datos actualizados en el almacenamiento local
            localStorage.setItem('userFirstName', firstName);
            localStorage.setItem('userLastName', lastName);
            localStorage.setItem('userBirthdate', birthdate);

            alert('Perfil actualizado correctamente en la base de datos.');
        } catch (error) {
            console.error(error);
            alert('Error al actualizar el perfil en la base de datos.');
        }
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.");

        if (confirmDelete) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete('http://localhost:3000/users/me', {
                    headers: { authorization: token }
                });
                localStorage.clear();
                alert("Tu cuenta ha sido eliminada.");
                navigate('/login');
            } catch {
                alert("No se pudo eliminar la cuenta.");
            }
        }
    };

    return (
        <div style={style.pagina}>
            {/* Menú lateral */}
            <aside style={style.menuLateral}>
                <div style={style.tituloMenu}>Configuración</div>
                <button style={style.opcionMenuActiva}>Cuenta</button>
                <button style={style.opcionMenu} onClick={() => navigate('/perfil-publico')}>Perfil público</button>
                <button style={style.opcionMenuDeshabilitada}>Seguridad</button>
                <button style={style.opcionMenuDeshabilitada}>Privacidad</button>
            </aside>

            <section style={style.contenido}>
                <h1 style={style.titulo}>Cuenta</h1>
                <p style={style.subtitulo}>Administra tu información personal y cómo te muestras en la plataforma.</p>

                <form style={style.tarjeta} onSubmit={handleSubmit}>
                    <h3 style={style.tituloTarjeta}>Información personal</h3>
                    <p style={style.textoTarjeta}>Estos datos se usan para tu cuenta y no serán visibles para otros usuarios.</p>

                    <div style={style.fila}>
                        <div style={style.grupo}>
                            <label style={style.etiqueta}>Nombre</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                style={style.campo}
                                placeholder="Tu nombre"
                            />
                        </div>
                        <div style={style.grupo}>
                            <label style={style.etiqueta}>Apellido</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                style={style.campo}
                                placeholder="Tu apellido"
                            />
                        </div>
                    </div>

                    <div style={style.grupo}>
                        <label style={style.etiqueta}>Correo electrónico</label>
                        <input type="email" value={email} style={style.campo} disabled />
                    </div>

                    <div style={style.grupo}>
                        <label style={style.etiqueta}>Fecha de nacimiento</label>
                        <input
                            type="date"
                            value={birthdate}
                            onChange={(e) => setBirthdate(e.target.value)}
                            style={style.campo}
                        />
                    </div>

                    <div style={style.acciones}>
                        <button type="button" style={style.botonEliminar} onClick={handleDeleteAccount}>
                            Eliminar mi cuenta
                        </button>
                        <button type="submit" style={style.botonPrincipal}>
                            Guardar cambios
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

const style = {
    pagina: {
        display: 'flex',
        gap: '28px',
        padding: '32px',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        boxSizing: 'border-box',
        background: '#0b0b1c',
        minHeight: '85vh',
    },
    menuLateral: {
        width: '230px',
        padding: '22px 14px',
        borderRadius: '20px',
        backgroundColor: '#17152b',
        border: '1px solid #26233d',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        boxSizing: 'border-box',
    },
    tituloMenu: {
        color: '#e2e8f0',
        fontSize: '15px',
        padding: '0 10px 14px',
    },
    opcionMenu: {
        padding: '13px 14px',
        borderRadius: '10px',
        fontSize: '14px',
        textAlign: 'left',
        color: '#cbd5e1',
        backgroundColor: 'transparent',
        border: '1px solid transparent',
        cursor: 'pointer',
    },
    opcionMenuActiva: {
        padding: '13px 14px',
        borderRadius: '10px',
        fontSize: '14px',
        textAlign: 'left',
        color: '#ffffff',
        backgroundColor: '#2e2a5c',
        border: '1px solid #8b5cf6',
        cursor: 'pointer',
    },
    opcionMenuDeshabilitada: {
        padding: '13px 14px',
        borderRadius: '10px',
        fontSize: '14px',
        textAlign: 'left',
        color: '#cbd5e1',
        backgroundColor: 'transparent',
        border: '1px solid transparent',
        opacity: 0.6,
        cursor: 'not-allowed',
    },
    contenido: {
        flex: 1,
        minWidth: '300px',
    },
    titulo: {
        color: '#ffffff',
        fontSize: '40px',
        fontWeight: '700',
        margin: '0 0 6px',
    },
    subtitulo: {
        color: '#a5a5d0',
        fontSize: '15px',
        margin: '0 0 24px',
    },
    tarjeta: {
        maxWidth: '500px',
        padding: '24px 26px',
        borderRadius: '18px',
        backgroundColor: '#17152b',
        border: '1px solid #26233d',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.35)',
        boxSizing: 'border-box',
    },
    tituloTarjeta: {
        color: '#ffffff',
        fontSize: '19px',
        fontWeight: '600',
        margin: '0 0 4px',
    },
    textoTarjeta: {
        color: '#a5a5d0',
        fontSize: '13px',
        margin: '0 0 24px',
    },
    fila: {
        display: 'flex',
        gap: '16px',
    },
    grupo: {
        flex: 1,
        minWidth: 0,
        marginBottom: '18px',
    },
    etiqueta: {
        display: 'block',
        color: '#e2e8f0',
        fontSize: '14px',
        marginBottom: '8px',
    },
    campo: {
        width: '100%',
        height: '46px',
        padding: '0 14px',
        borderRadius: '10px',
        backgroundColor: '#141229',
        border: '1px solid #2a2842',
        color: '#e2e8f0',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
        colorScheme: 'dark',
    },
    acciones: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        marginTop: '6px',
    },
    botonPrincipal: {
        padding: '13px 28px',
        border: 'none',
        borderRadius: '10px',
        backgroundColor: '#7c5cf0',
        color: '#ffffff',
        fontWeight: '600',
        fontSize: '14px',
        cursor: 'pointer',
    },
    botonEliminar: {
        padding: '12px 24px',
        borderRadius: '10px',
        backgroundColor: 'transparent',
        border: '1px solid #ef4444',
        color: '#ef4444',
        fontWeight: '600',
        fontSize: '14px',
        cursor: 'pointer',
    },
};

export default EditProfile;
