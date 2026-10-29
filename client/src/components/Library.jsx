import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:3000';

function Library() {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [recentlyPlayed, setRecentlyPlayed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pestaña, setPestaña] = useState('favoritos');
    const [juegoEncima, setJuegoEncima] = useState(null); // id del juego que tiene el mouse encima

    useEffect(() => {
        const token = localStorage.getItem('token');

        // Si no hay sesion, mandamos al login (igual que las otras pantallas)
        if (!token) {
            alert('Primero debes iniciar sesión.');
            navigate('/login');
            return;
        }

        const fetchLibrary = async () => {
            try {
                const response = await axios.get(`${API}/me/library`, {
                    headers: { authorization: token }
                });
                setFavorites(response.data.favorites);
                setRecentlyPlayed(response.data.recentlyPlayed);
            } catch (error) {
                console.error('Error al cargar la biblioteca:', error);
                setError('No se pudo cargar tu biblioteca.');
            } finally {
                setLoading(false);
            }
        };

        fetchLibrary();
    }, [navigate]);

    if (loading) {
        return <div style={estilos.contenedor}><p style={estilos.mensaje}>Cargando tu biblioteca...</p></div>;
    }

    // Juegos que mostramos segun la pestaña elegida
    const juegos = pestaña === 'favoritos' ? favorites : recentlyPlayed;

    // Tarjeta de un juego (portada vertical como en las tiendas de juegos)
    const tarjetaJuego = (game) => {
        const textoExtra = pestaña === 'favoritos'
            ? game.platforms || 'Sin plataforma'
            : `Jugado el ${new Date(game.lastPlayedAt).toLocaleDateString('es-AR')}`;

        // Si tiene el mouse encima la tarjeta sube un poquito
        const estiloPortada = juegoEncima === game.id
            ? { ...estilos.portadaCaja, ...estilos.portadaCajaEncima }
            : estilos.portadaCaja;

        return (
            <Link
                key={game.id}
                to={`/games/${game.id}`}
                style={estilos.tarjetaLink}
                onMouseEnter={() => setJuegoEncima(game.id)}
                onMouseLeave={() => setJuegoEncima(null)}
            >
                <div style={estiloPortada}>
                    {game.coverImage ? (
                        <img src={API + game.coverImage} alt={game.title} style={estilos.portadaImagen} />
                    ) : (
                        <div style={{ ...estilos.portada, background: degradados[game.id % degradados.length] }}>
                            <span style={estilos.textoPortada}>{game.title}</span>
                        </div>
                    )}
                </div>
                <div style={estilos.nombreJuego}>{game.title}</div>
                <div style={estilos.datoJuego}>{textoExtra}</div>
            </Link>
        );
    };

    return (
        <div style={estilos.contenedor}>
            <h1 style={estilos.titulo}>Biblioteca</h1>

            {/* Pestañas para cambiar entre favoritos y jugados */}
            <div style={estilos.pestañas}>
                <button
                    style={pestaña === 'favoritos' ? estilos.pestañaActiva : estilos.pestaña}
                    onClick={() => setPestaña('favoritos')}
                >
                    Favoritos <span style={estilos.numero}>{favorites.length}</span>
                </button>
                <button
                    style={pestaña === 'jugados' ? estilos.pestañaActiva : estilos.pestaña}
                    onClick={() => setPestaña('jugados')}
                >
                    Jugados recientemente <span style={estilos.numero}>{recentlyPlayed.length}</span>
                </button>
            </div>

            {error && <p style={estilos.mensajeError}>{error}</p>}

            {juegos.length === 0 ? (
                <div style={estilos.vacio}>
                    <p style={estilos.tituloVacio}>
                        {pestaña === 'favoritos' ? 'Todavía no guardaste ningún juego' : 'Todavía no jugaste ningún juego'}
                    </p>
                    <p style={estilos.textoVacio}>
                        {pestaña === 'favoritos'
                            ? 'Tocá "Guardar" en un juego para verlo acá.'
                            : 'Tocá "Jugar ahora" en un juego para verlo acá.'}
                    </p>
                    <button style={estilos.boton} onClick={() => navigate('/games')}>Explorar juegos</button>
                </div>
            ) : (
                <div style={estilos.grilla}>
                    {juegos.map((game) => tarjetaJuego(game))}
                </div>
            )}
        </div>
    );
}

// Portadas de los juegos que no tienen imagen (solo violetas y azules)
const degradados = [
    'linear-gradient(160deg, #1e1b4b 0%, #4c1d95 55%, #7c3aed 100%)',
    'linear-gradient(160deg, #0f172a 0%, #1e3a8a 55%, #3b82f6 100%)',
    'linear-gradient(160deg, #172554 0%, #6d28d9 60%, #a78bfa 100%)',
    'linear-gradient(160deg, #0b1020 0%, #312e81 55%, #6366f1 100%)',
    'linear-gradient(160deg, #0c1445 0%, #1d4ed8 55%, #8f84ff 100%)',
];

const textoGris = '#9a97c0';

const estilos = {
    contenedor: {
        minHeight: '85vh',
        padding: '48px',
        boxSizing: 'border-box',
        color: '#e2e8f0',
        fontFamily: "'Montserrat', 'Segoe UI', sans-serif",
        // Un brillo azul/violeta arriba que se va apagando hacia el negro (como la PlayStation)
        background:
            'radial-gradient(ellipse at 15% 0%, rgba(59, 70, 200, 0.28) 0%, transparent 50%),' +
            'radial-gradient(ellipse at 85% 0%, rgba(111, 92, 240, 0.22) 0%, transparent 45%),' +
            '#0a0a14',
    },
    mensaje: {
        color: '#ffffff',
    },
    mensajeError: {
        color: '#fca5a5',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        padding: '12px 16px',
        borderRadius: '12px',
        fontSize: '13px',
    },
    titulo: {
        color: '#ffffff',
        fontSize: '44px',
        fontWeight: '700',
        letterSpacing: '-1px',
        margin: '0 0 24px',
    },

    // ---------- Pestañas ----------
    pestañas: {
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        paddingBottom: '24px',
        marginBottom: '32px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    },
    pestaña: {
        background: 'rgba(255, 255, 255, 0.06)',
        color: '#d4d2ee',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '30px',
        height: '40px',
        padding: '0 20px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    pestañaActiva: {
        background: '#ffffff',
        color: '#0a0a14',
        border: '1px solid #ffffff',
        borderRadius: '30px',
        height: '40px',
        padding: '0 20px',
        fontSize: '13px',
        fontWeight: '700',
        cursor: 'pointer',
    },
    numero: {
        marginLeft: '6px',
        opacity: 0.6,
    },

    // ---------- Grilla de juegos ----------
    // Pone tantas columnas como entren en la pantalla (cada portada minimo 190px)
    grilla: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
        gap: '28px 22px',
    },
    tarjetaLink: {
        textDecoration: 'none',
    },
    portadaCaja: {
        borderRadius: '14px',
        overflow: 'hidden',
        aspectRatio: '3 / 4',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.45)',
        marginBottom: '12px',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    portadaCajaEncima: {
        transform: 'translateY(-6px)',
        border: '1px solid rgba(143, 132, 255, 0.6)',
        boxShadow: '0 16px 40px rgba(111, 92, 240, 0.35)',
    },
    portada: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '18px',
        boxSizing: 'border-box',
    },
    portadaImagen: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    },
    textoPortada: {
        color: '#ffffff',
        fontSize: '24px',
        fontWeight: '700',
        lineHeight: 1.1,
    },
    nombreJuego: {
        color: '#ffffff',
        fontSize: '15px',
        fontWeight: '600',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    datoJuego: {
        color: textoGris,
        fontSize: '12px',
        marginTop: '4px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },

    // ---------- Sin juegos ----------
    vacio: {
        textAlign: 'center',
        padding: '80px 20px',
    },
    tituloVacio: {
        color: '#ffffff',
        fontSize: '20px',
        fontWeight: '600',
        margin: '0 0 8px',
    },
    textoVacio: {
        color: textoGris,
        fontSize: '14px',
        margin: '0 0 24px',
    },
    boton: {
        background: 'linear-gradient(90deg, #8f84ff 0%, #6b5cf0 100%)',
        color: '#ffffff',
        border: 'none',
        borderRadius: '30px',
        height: '42px',
        padding: '0 26px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(111, 92, 240, 0.4)',
    },
};

export default Library;
