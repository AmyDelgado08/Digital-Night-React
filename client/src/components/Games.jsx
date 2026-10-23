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
        return <div style={estilos.contenedor}><p style={{ color: 'white' }}>Cargando...</p></div>;
    }

    // Destacado = el primer juego; barra lateral = los primeros 6; recientes = los más nuevos
    const destacado = games[0];
    const juegosLaterales = games.slice(0, 6);
    const recientes = [...games].reverse();

    return (
        <div style={estilos.contenedor}>
            {games.length === 0 ? (
                <p style={estilos.mensajeVacio}>No hay juegos todavía.</p>
            ) : (
                <>
                    {/* Juego destacado + barra lateral */}
                    <div style={estilos.fila}>
                        <div style={{ ...estilos.destacado, background: degradados[destacado.id % degradados.length] }}>
                            <div style={estilos.destacadoTexto}>
                                <small style={estilos.etiquetaDestacado}>JUEGO DESTACADO</small>
                                <h1 style={estilos.tituloDestacado}>{destacado.title}</h1>
                                {destacado.platforms && <span style={estilos.etiqueta}>{destacado.platforms}</span>}
                                <p style={estilos.descripcionDestacado}>{destacado.description}</p>
                                <Link to={`/games/${destacado.id}`} style={estilos.botonJugar}>Jugar ahora</Link>
                            </div>
                        </div>

                        <div style={estilos.barralateral}>
                            {juegosLaterales.map((game, i) => (
                                <Link key={game.id} to={`/games/${game.id}`} style={{ textDecoration: 'none' }}>
                                    <div style={i === 0 ? estilos.itemLateralActivo : estilos.itemLateral}>
                                        <div style={{ ...estilos.miniatura, background: degradados[game.id % degradados.length] }} />
                                        <div style={{ minWidth: 0 }}>
                                            <div style={estilos.tituloLateral}>{game.title}</div>
                                            <div style={estilos.datoLateral}>{game.platforms}</div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Recién llegados */}
                    <h2 style={estilos.tituloSeccion}>Recién llegados</h2>

                    <div style={estilos.filaTarjetas}>
                        {recientes.map((game) => (
                            <Link key={game.id} to={`/games/${game.id}`} style={{ textDecoration: 'none', flex: '0 0 auto' }}>
                                <div style={estilos.tarjeta}>
                                    <div style={{ ...estilos.portada, background: degradados[game.id % degradados.length] }}>
                                        <span style={estilos.textoPortada}>{game.title}</span>
                                    </div>
                                    <div style={estilos.nombreJuego}>{game.title}</div>
                                    <div style={estilos.datoJuego}>{game.platforms}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

// Degradados que se usan como "portada" de cada juego (según su id)
const degradados = [
    'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 55%, #7c3aed 100%)',
    'linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #3b82f6 100%)',
    'linear-gradient(135deg, #2e1065 0%, #86198f 55%, #db2777 100%)',
    'linear-gradient(135deg, #172554 0%, #6d28d9 60%, #a78bfa 100%)',
    'linear-gradient(135deg, #0b1020 0%, #312e81 55%, #6366f1 100%)',
];

const estilos = {
    contenedor: { background: '#0a0a1a', minHeight: '85vh', padding: '32px', boxSizing: 'border-box', color: '#e2e8f0', fontFamily: "'Montserrat', 'Segoe UI', sans-serif" },
    mensajeVacio: { color: '#9ca3af', textAlign: 'center', fontSize: '18px', padding: '60px 0' },

    fila: { display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '32px' },

    destacado: { flex: '1 1 560px', minHeight: '300px', borderRadius: '18px', border: '1px solid #26233d', display: 'flex', alignItems: 'flex-end', boxSizing: 'border-box', overflow: 'hidden' },
    destacadoTexto: { padding: '32px', maxWidth: '440px' },
    etiquetaDestacado: { color: '#c4b5fd', fontSize: '10px', letterSpacing: '1.5px' },
    tituloDestacado: { color: '#ffffff', fontSize: '38px', fontWeight: '700', margin: '6px 0 12px' },
    etiqueta: { display: 'inline-block', background: 'rgba(255,255,255,0.12)', color: '#e2e8f0', fontSize: '11px', padding: '3px 9px', borderRadius: '6px' },
    descripcionDestacado: { color: '#cbd5e1', fontSize: '13px', lineHeight: 1.5, margin: '14px 0 20px' },
    botonJugar: { display: 'inline-block', background: '#ffffff', color: '#0a0a1a', fontWeight: '600', fontSize: '13px', padding: '10px 22px', borderRadius: '10px', textDecoration: 'none' },

    barralateral: { flex: '0 0 260px', display: 'flex', flexDirection: 'column', gap: '6px' },
    itemLateral: { display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', borderRadius: '10px', cursor: 'pointer' },
    itemLateralActivo: { display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', borderRadius: '10px', background: '#26233d', border: '1px solid #3b3760', cursor: 'pointer' },
    miniatura: { width: '38px', height: '38px', borderRadius: '8px', flexShrink: 0 },
    tituloLateral: { color: '#ffffff', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    datoLateral: { color: '#94a3b8', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },

    tituloSeccion: { color: '#ffffff', fontSize: '18px', fontWeight: '600', margin: '0 0 14px' },

    filaTarjetas: { display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '10px' },
    tarjeta: { width: '170px' },
    portada: { height: '190px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', boxSizing: 'border-box', marginBottom: '8px' },
    textoPortada: { color: '#ffffff', fontSize: '18px', fontWeight: '700', textAlign: 'center' },
    nombreJuego: { color: '#ffffff', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    datoJuego: { color: '#94a3b8', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
};

export default Games;
