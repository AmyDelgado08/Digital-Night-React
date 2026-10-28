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

    // Tarjeta de un juego (igual a las del catálogo)
    const tarjetaJuego = (game, textoExtra) => (
        <Link key={game.id} to={`/games/${game.id}`} style={{ textDecoration: 'none', flex: '0 0 auto' }}>
            <div style={estilos.tarjeta}>
                {game.coverImage ? (
                    <img src={API + game.coverImage} alt={game.title} style={estilos.portadaImagen} />
                ) : (
                    <div style={{ ...estilos.portada, background: degradados[game.id % degradados.length] }}>
                        <span style={estilos.textoPortada}>{game.title}</span>
                    </div>
                )}
                <div style={estilos.nombreJuego}>{game.title}</div>
                <div style={estilos.datoJuego}>{textoExtra}</div>
            </div>
        </Link>
    );

    return (
        <div style={estilos.contenedor}>
            <h1 style={estilos.titulo}>Biblioteca</h1>
            <p style={estilos.subtitulo}>Los juegos que guardaste y los que jugaste hace poco.</p>

            {error && <p style={estilos.mensajeError}>{error}</p>}

            {/* Favoritos */}
            <h2 style={estilos.tituloSeccion}>Favoritos ({favorites.length})</h2>
            {favorites.length === 0 ? (
                <div style={estilos.vacio}>
                    <p style={estilos.textoVacio}>Todavía no guardaste ningún juego. Tocá "Guardar" en un juego para verlo acá.</p>
                    <button style={estilos.boton} onClick={() => navigate('/games')}>Explorar juegos</button>
                </div>
            ) : (
                <div style={estilos.filaTarjetas}>
                    {favorites.map((game) => tarjetaJuego(game, game.platforms || 'Sin plataforma'))}
                </div>
            )}

            {/* Jugados recientemente */}
            <h2 style={estilos.tituloSeccion}>Jugados recientemente</h2>
            {recentlyPlayed.length === 0 ? (
                <div style={estilos.vacio}>
                    <p style={estilos.textoVacio}>Todavía no jugaste ningún juego. Tocá "Jugar ahora" en un juego para verlo acá.</p>
                </div>
            ) : (
                <div style={estilos.filaTarjetas}>
                    {recentlyPlayed.map((game) =>
                        tarjetaJuego(game, `Jugado el ${new Date(game.lastPlayedAt).toLocaleDateString('es-AR')}`)
                    )}
                </div>
            )}
        </div>
    );
}

const degradados = [
    'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 55%, #7c3aed 100%)',
    'linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #3b82f6 100%)',
    'linear-gradient(135deg, #2e1065 0%, #86198f 55%, #db2777 100%)',
    'linear-gradient(135deg, #172554 0%, #6d28d9 60%, #a78bfa 100%)',
    'linear-gradient(135deg, #0b1020 0%, #312e81 55%, #6366f1 100%)',
];

const estilos = {
    contenedor: {
        background: '#0a0a1a',
        minHeight: '85vh',
        padding: '32px',
        boxSizing: 'border-box',
        color: '#e2e8f0',
        fontFamily: "'Montserrat', 'Segoe UI', sans-serif",
    },
    mensaje: {
        color: '#ffffff',
    },
    mensajeError: {
        color: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '14px',
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
        margin: '0 0 32px',
    },
    tituloSeccion: {
        color: '#ffffff',
        fontSize: '18px',
        fontWeight: '600',
        margin: '0 0 14px',
    },
    filaTarjetas: {
        display: 'flex',
        gap: '16px',
        overflowX: 'auto',
        paddingBottom: '10px',
        marginBottom: '36px',
    },
    tarjeta: {
        width: '170px',
    },
    portada: {
        height: '190px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        boxSizing: 'border-box',
        marginBottom: '8px',
    },
    portadaImagen: {
        width: '170px',
        height: '190px',
        objectFit: 'cover',
        borderRadius: '12px',
        marginBottom: '8px',
        display: 'block',
    },
    textoPortada: {
        color: '#ffffff',
        fontSize: '18px',
        fontWeight: '700',
        textAlign: 'center',
    },
    nombreJuego: {
        color: '#ffffff',
        fontSize: '13px',
        fontWeight: '600',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    datoJuego: {
        color: '#94a3b8',
        fontSize: '11px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    vacio: {
        background: '#17152b',
        border: '1px solid #26233d',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '36px',
    },
    textoVacio: {
        color: '#a5a5d0',
        fontSize: '14px',
        margin: '0 0 14px',
    },
    boton: {
        backgroundColor: '#7c3aed',
        color: '#ffffff',
        border: 'none',
        borderRadius: '20px',
        padding: '10px 20px',
        fontWeight: '600',
        cursor: 'pointer',
    },
};

export default Library;
