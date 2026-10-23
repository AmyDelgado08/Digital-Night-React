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
        return <div style={estilos.contenedor}><p style={{ color: 'white' }}>Cargando juego...</p></div>;
    }

    if (!game) {
        return <div style={estilos.contenedor}><p style={{ color: 'white' }}>Juego no encontrado.</p></div>;
    }

    return (
        <div style={estilos.contenedor}>
            {/* Cabecera: datos principales + vista previa */}
            <div style={{ ...estilos.cabecera, background: degradados[game.id % degradados.length] }}>
                <div style={estilos.cabeceraInterior}>
                    <div style={estilos.cabeceraTexto}>
                        <p style={estilos.ruta}>Explorar / Juegos / {game.title}</p>
                        {game.platforms && <span style={estilos.etiqueta}>{game.platforms}</span>}
                        <h1 style={estilos.titulo}>{game.title}</h1>
                        <p style={estilos.resumen}>{game.description}</p>
                        <div style={estilos.botones}>
                            <button style={estilos.botonJugar}>Jugar ahora</button>
                            <button onClick={() => navigate('/games')} style={estilos.botonSecundario}>Volver a juegos</button>
                        </div>
                    </div>

                    <div style={{ ...estilos.vistaPrevia, background: degradados[(game.id + 1) % degradados.length] }}>
                        <span style={estilos.textoVistaPrevia}>{game.title}</span>
                    </div>
                </div>
            </div>

            {/* Contenido: descripción + ficha */}
            <div style={estilos.contenido}>
                <div style={estilos.columnaPrincipal}>
                    <h2 style={estilos.subtitulo}>Sobre el juego</h2>
                    <p style={estilos.parrafo}>{game.description}</p>

                    <h2 style={estilos.subtitulo}>Plataformas</h2>
                    <div style={estilos.fila}>
                        <span style={estilos.etiquetaOscura}>{game.platforms}</span>
                    </div>
                </div>

                <div style={estilos.barralateral}>
                    <div style={estilos.tarjeta}>
                        <h3 style={estilos.tituloTarjeta}>Ficha del juego</h3>
                        <div style={estilos.dato}>
                            <span style={estilos.datoNombre}>Título</span>
                            <span style={estilos.datoValor}>{game.title}</span>
                        </div>
                        <div style={estilos.dato}>
                            <span style={estilos.datoNombre}>Plataformas</span>
                            <span style={estilos.datoValor}>{game.platforms}</span>
                        </div>
                        <div style={estilos.dato}>
                            <span style={estilos.datoNombre}>Publicado</span>
                            <span style={estilos.datoValor}>{new Date(game.createdAt).toLocaleDateString('es-AR')}</span>
                        </div>
                        <div style={estilos.dato}>
                            <span style={estilos.datoNombre}>Autor</span>
                            <span style={estilos.datoValor}>Usuario {game.authorId}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Degradados que se usan como imagen del juego (según su id)
const degradados = [
    'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 55%, #7c3aed 100%)',
    'linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #3b82f6 100%)',
    'linear-gradient(135deg, #2e1065 0%, #86198f 55%, #db2777 100%)',
    'linear-gradient(135deg, #172554 0%, #6d28d9 60%, #a78bfa 100%)',
    'linear-gradient(135deg, #0b1020 0%, #312e81 55%, #6366f1 100%)',
];

const estilos = {
    contenedor: { background: '#07070f', minHeight: '85vh', color: '#e2e8f0', fontFamily: "'Montserrat', 'Segoe UI', sans-serif" },

    cabecera: { padding: '48px 32px' },
    cabeceraInterior: { maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'center' },
    cabeceraTexto: { flex: '1 1 420px' },
    ruta: { color: '#94a3b8', fontSize: '12px', margin: '0 0 14px' },
    etiqueta: { display: 'inline-block', background: 'rgba(255,255,255,0.15)', color: '#ffffff', fontSize: '12px', padding: '4px 12px', borderRadius: '20px' },
    titulo: { color: '#ffffff', fontSize: '48px', fontWeight: '700', margin: '14px 0' },
    resumen: { color: '#cbd5e1', fontSize: '15px', lineHeight: 1.6, margin: '0 0 24px' },
    botones: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
    botonJugar: { background: '#ffffff', color: '#07070f', border: 'none', borderRadius: '10px', padding: '12px 28px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
    botonSecundario: { background: 'rgba(255,255,255,0.12)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '12px 24px', fontSize: '14px', cursor: 'pointer' },

    vistaPrevia: { flex: '1 1 380px', minHeight: '240px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' },
    textoVistaPrevia: { color: '#ffffff', fontSize: '28px', fontWeight: '700', textAlign: 'center' },

    contenido: { maxWidth: '1100px', margin: '0 auto', padding: '40px 32px', display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start', boxSizing: 'border-box' },
    columnaPrincipal: { flex: '1 1 480px' },
    subtitulo: { color: '#ffffff', fontSize: '22px', fontWeight: '600', margin: '0 0 14px' },
    parrafo: { color: '#cbd5e1', fontSize: '14px', lineHeight: 1.7, margin: '0 0 32px' },
    fila: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
    etiquetaOscura: { background: '#141229', border: '1px solid #2a2842', color: '#e2e8f0', fontSize: '13px', padding: '8px 14px', borderRadius: '8px' },

    barralateral: { flex: '0 0 300px' },
    tarjeta: { background: '#110f22', border: '1px solid #26233d', borderRadius: '16px', padding: '22px' },
    tituloTarjeta: { color: '#ffffff', fontSize: '16px', fontWeight: '600', margin: '0 0 16px' },
    dato: { display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '10px 0', borderBottom: '1px solid #1d1b33', fontSize: '13px' },
    datoNombre: { color: '#94a3b8' },
    datoValor: { color: '#ffffff', textAlign: 'right' },
};

export default GameDetail;
