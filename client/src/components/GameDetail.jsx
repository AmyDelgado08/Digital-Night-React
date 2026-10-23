import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function GameDetail() {
    const { id } = useParams(); // Lee el id
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/games/${id}`);
                setGame(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar detalle del juego:', error);
                setLoading(false);
            }
        };

        fetchGame();
    }, [id]);

    if (loading) {
        return <div style={style.cont}><p style={{ color: 'white' }}>Cargando juego...</p></div>;
    }

    if (!game) {
        return <div style={style.cont}><p style={{ color: 'white' }}>Juego no encontrado.</p></div>;
    }

    return (
        <div style={style.cont}>
            <div style={style.card}>
                <button onClick={() => navigate('/games')} style={style.backBtn}>
                    ← Volver a Juegos
                </button>
                <h2 style={style.title}>{game.title}</h2>
                <p style={style.desc}>{game.description}</p>
                <small style={style.platforms}>Plataformas: {game.platforms}</small>
            </div>
        </div>
    );
}

const style = {
    cont: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', padding: '32px' },
    card: { backgroundColor: '#1f2937', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '600px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' },
    title: { fontSize: '28px', fontWeight: '700', color: '#ffffff', marginBottom: '16px' },
    desc: { color: '#9ca3af', fontSize: '16px', marginBottom: '16px', lineHeight: '1.5' },
    platforms: { color: '#a78bfa', fontSize: '14px', fontWeight: '600' },
    backBtn: { backgroundColor: 'transparent', color: '#a78bfa', border: '1px solid #a78bfa', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginBottom: '20px' }
};

export default GameDetail;