import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Games() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cargamos la pag juegos (SIN verificación de token)
        const fetchGames = async () => {
            try {
                const response = await axios.get('http://localhost:3000/games');
                setGames(response.data);
                setLoading(false);
            } 
            
            catch (error) {
                console.error('Error al cargar juegos:', error);
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    if (loading) {
        return <div style={style.cont}><p style={{ color: 'white' }}>Cargando...</p></div>;
    }

    return (
        <div style={style.cont}>
            <div style={style.card}>
                <h2 style={style.title}>Juegos Disponibles</h2>

                {/* Si no hay juegos, muestra el texto plano */}
                {games.length === 0 ? (
                    <p style={style.emptyText}>No hay juegos todavía.</p>
                ) : (
                    <div style={style.gamesList}>
                        {games.map((game) => (
                            /* Enlazamos cada tarjeta a la vista de detalle */
                            <Link key={game.id} to={`/games/${game.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={style.gameItem}>
                                    <h3 style={{ color: '#a78bfa', margin: '0 0 8px 0' }}>{game.title}</h3>
                                    <p style={{ color: '#9ca3af', margin: '0 0 4px 0' }}>{game.description}</p>
                                    <small style={{ color: '#6b7280' }}>Plataformas: {game.platforms}</small>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const style = {
    cont: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '32px' },
    card: { backgroundColor: '#1f2937', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '600px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' },
    title: { fontSize: '28px', fontWeight: '700', color: '#ffffff', marginBottom: '24px', textAlign: 'center' },
    emptyText: { color: '#9ca3af', textAlign: 'center', fontSize: '18px' },
    gamesList: { display: 'flex', flexDirection: 'column', gap: '16px' },
    gameItem: { backgroundColor: '#111827', padding: '16px', borderRadius: '8px', border: '1px solid #374151', cursor: 'pointer' }
};

export default Games;