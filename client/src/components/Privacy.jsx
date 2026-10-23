import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Privacidad() {
    const navigate = useNavigate();
    const [isPublic, setIsPublic] = useState(true);
    const [showEmail, setShowEmail] = useState(false);
    const [showBirthdate, setShowBirthdate] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');

    // Al entrar, cargamos los ajustes actuales del usuario (GET /me)
    useEffect(() => {
        if (!token) return navigate('/login');

        const cargar = async () => {
            try {
                const { data } = await axios.get('http://localhost:3000/me', {
                    headers: { authorization: token }
                });
                setIsPublic(data.isPublic ?? true);
                setShowEmail(data.showEmail ?? false);
                setShowBirthdate(data.showBirthdate ?? false);
            } catch (err) {
                setError('No se pudieron cargar tus ajustes de privacidad.');
            }
        };
        cargar();
    }, []);

    // Al guardar, mandamos solo los 3 ajustes a PUT /users/me
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.put(
                'http://localhost:3000/users/me',
                { isPublic, showEmail, showBirthdate },
                { headers: { authorization: token } }
            );
            setMessage(response.data.message || 'Ajustes guardados.');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al guardar los ajustes.');
        }
    };

    return (
        <div style={style.pagina}>
            <aside style={style.menuLateral}>
                <div style={style.tituloMenu}>Configuración</div>
                <button style={style.opcionMenu} onClick={() => navigate('/editar-perfil')}>Cuenta</button>
                <button style={style.opcionMenu} onClick={() => navigate('/perfil-publico')}>Perfil público</button>
                <button style={style.opcionMenu} onClick={() => navigate('/seguridad')}>Seguridad</button>
                <button style={style.opcionMenuActiva}>Privacidad</button>
            </aside>

            <section style={style.contenido}>
                <h1 style={style.titulo}>Privacidad</h1>
                <p style={style.subtitulo}>Elegí qué información pueden ver otras personas.</p>

                <form style={style.tarjeta} onSubmit={handleSubmit}>
                    <h3 style={style.tituloTarjeta}>Visibilidad de tu perfil</h3>

                    {message && <p style={style.mensajeOk}>{message}</p>}
                    {error && <p style={style.mensajeError}>{error}</p>}

                    <label style={style.fila}>
                        <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
                        <span>Perfil público <small style={style.ayuda}>(si lo desmarcás, tu perfil es privado)</small></span>
                    </label>

                    <label style={style.fila}>
                        <input type="checkbox" checked={showEmail} onChange={(e) => setShowEmail(e.target.checked)} />
                        <span>Mostrar mi email</span>
                    </label>

                    <label style={style.fila}>
                        <input type="checkbox" checked={showBirthdate} onChange={(e) => setShowBirthdate(e.target.checked)} />
                        <span>Mostrar mi fecha de nacimiento</span>
                    </label>

                    <div style={style.acciones}>
                        <button type="submit" style={style.botonPrincipal}>Guardar cambios</button>
                    </div>
                </form>
            </section>
        </div>
    );
}

// Mismos estilos que Security/EditProfile para que se vea igual
const style = {
    pagina: { display: 'flex', gap: '28px', padding: '32px', alignItems: 'flex-start', flexWrap: 'wrap', boxSizing: 'border-box', background: '#0b0b1c', minHeight: '85vh' },
    menuLateral: { width: '230px', padding: '22px 14px', borderRadius: '20px', backgroundColor: '#17152b', border: '1px solid #26233d', display: 'flex', flexDirection: 'column', gap: '8px', boxSizing: 'border-box' },
    tituloMenu: { color: '#e2e8f0', fontSize: '15px', padding: '0 10px 14px' },
    opcionMenu: { padding: '13px 14px', borderRadius: '10px', fontSize: '14px', textAlign: 'left', color: '#cbd5e1', backgroundColor: 'transparent', border: '1px solid transparent', cursor: 'pointer' },
    opcionMenuActiva: { padding: '13px 14px', borderRadius: '10px', fontSize: '14px', textAlign: 'left', color: '#ffffff', backgroundColor: '#2e2a5c', border: '1px solid #8b5cf6', cursor: 'pointer' },
    contenido: { flex: 1, minWidth: '300px' },
    titulo: { color: '#ffffff', fontSize: '40px', fontWeight: '700', margin: '0 0 6px' },
    subtitulo: { color: '#a5a5d0', fontSize: '15px', margin: '0 0 24px' },
    tarjeta: { maxWidth: '500px', padding: '24px 26px', borderRadius: '18px', backgroundColor: '#17152b', border: '1px solid #26233d', boxShadow: '0 15px 35px rgba(0, 0, 0, 0.35)', boxSizing: 'border-box' },
    tituloTarjeta: { color: '#ffffff', fontSize: '19px', fontWeight: '600', margin: '0 0 20px' },
    fila: { display: 'flex', alignItems: 'center', gap: '12px', color: '#e2e8f0', fontSize: '14px', marginBottom: '18px', cursor: 'pointer' },
    ayuda: { color: '#a5a5d0', fontSize: '12px' },
    acciones: { display: 'flex', justifyContent: 'flex-end', marginTop: '6px' },
    botonPrincipal: { padding: '13px 28px', border: 'none', borderRadius: '10px', backgroundColor: '#7c5cf0', color: '#ffffff', fontWeight: '600', fontSize: '14px', cursor: 'pointer' },
    mensajeOk: { color: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '10px', borderRadius: '8px', fontSize: '14px', margin: '0 0 18px' },
    mensajeError: { color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', fontSize: '14px', margin: '0 0 18px' },
};

export default Privacidad;
