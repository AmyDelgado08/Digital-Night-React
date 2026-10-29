import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:3000';

function Games() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    const [posDestacado, setPosDestacado] = useState(0); // cual de los destacados se esta mostrando
    const [verTodos, setVerTodos] = useState(false);
    const [juegoEncima, setJuegoEncima] = useState(null); // id del juego que tiene el mouse encima

    useEffect(() => {
        // Cargamos la pag juegos
        const fetchGames = async () => {
            try {
                const response = await axios.get(`${API}/games`);
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
        return <div style={estilos.pagina}><p style={{ color: 'white' }}>Cargando...</p></div>;
    }

    // Los destacados son los 5 juegos mas nuevos (los puntitos de abajo del banner)
    const destacados = [...games].reverse().slice(0, 5);
    const destacado = destacados[posDestacado];
    // Las 2 miniaturas de la derecha son los destacados que siguen
    const siguientes = destacados.filter((game) => game !== destacado).slice(0, 2);

    // Nombre e iniciales del usuario que creo el juego destacado
    const autor = destacado ? destacado.author : null;
    const nombreAutor = autor ? `${autor.firstName} ${autor.lastName || ''}`.trim() : 'Usuario';
    const inicialesAutor = autor
        ? (autor.firstName.charAt(0) + (autor.lastName || '').charAt(0)).toUpperCase()
        : 'U';

    // Juegos que coinciden con lo que se escribio en el buscador
    const juegosFiltrados = games.filter((game) =>
        game.title.toLowerCase().includes(busqueda.toLowerCase())
    );
    // Si no toco "Ver todos" mostramos solo 4, como en las tiendas
    const juegosGrilla = verTodos || busqueda !== '' ? juegosFiltrados : juegosFiltrados.slice(0, 4);

    // Fondo de un juego: su portada si tiene, si no un degradado
    const fondoJuego = (game) => {
        if (game.coverImage) {
            return `url(${API + game.coverImage}) center / cover`;
        }
        return degradados[game.id % degradados.length];
    };

    return (
        <div style={estilos.pagina}>
            <div style={estilos.panel}>
                {/* Buscador */}
                <div style={estilos.barraSuperior}>
                    <div style={estilos.buscador}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9c6e8" strokeWidth="1.8" strokeLinecap="round">
                            <circle cx="11" cy="11" r="7" />
                            <path d="M20 20l-4-4" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar juegos"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            style={estilos.inputBuscador}
                        />
                    </div>

                </div>

                {games.length === 0 ? (
                    <p style={estilos.mensajeVacio}>No hay juegos todavía.</p>
                ) : (
                    <>
                        {/* Si esta buscando no mostramos el destacado, solo los resultados */}
                        {busqueda === '' && (
                            <>
                                <div style={estilos.filaDestacado}>
                                    {/* Banner grande */}
                                    <Link to={`/games/${destacado.id}`} style={{ ...estilos.banner, background: fondoJuego(destacado) }}>
                                        <div style={estilos.bannerSombra} />

                                        <div style={estilos.etiquetas}>
                                            <span style={estilos.etiqueta}>Destacado</span>
                                            {destacado.subject && <span style={estilos.etiqueta}>{destacado.subject}</span>}
                                            {destacado.platforms && <span style={estilos.etiqueta}>{destacado.platforms}</span>}
                                            {destacado.grade && <span style={estilos.etiqueta}>{destacado.grade}</span>}
                                            <span style={estilos.etiquetaMas}>+</span>
                                        </div>

                                        {!destacado.coverImage && <h1 style={estilos.bannerTitulo}>{destacado.title}</h1>}

                                        {/* Avatar del usuario que creo el juego (con sus iniciales) */}
                                        <div style={estilos.jugadas}>
                                            <span style={estilos.iconoJugadas}>{inicialesAutor}</span>
                                            <span style={estilos.textoJugadas}>{nombreAutor} · {destacado.plays || 0} jugadas</span>
                                        </div>
                                    </Link>

                                    {/* Columna de la derecha */}
                                    <div style={estilos.columnaDerecha}>
                                        <div style={estilos.tarjetaInfo}>
                                            <h2 style={estilos.infoTitulo}>{destacado.title}</h2>
                                            <p style={estilos.infoDescripcion}>{destacado.description}</p>
                                            <p style={estilos.infoDato}>{destacado.subject || 'Juego educativo'}</p>
                                            <div style={estilos.filaBoton}>
                                                <Link to={`/games/${destacado.id}`} style={estilos.botonJugar}>Jugar ahora</Link>
                                            </div>
                                        </div>

                                        <div style={estilos.miniaturas}>
                                            {siguientes.map((game) => (
                                                <div
                                                    key={game.id}
                                                    style={{ ...estilos.miniatura, background: fondoJuego(game) }}
                                                    onClick={() => setPosDestacado(destacados.indexOf(game))}
                                                    title={game.title}
                                                >
                                                    {!game.coverImage && <span style={estilos.miniaturaTexto}>{game.title}</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Puntitos para cambiar el destacado */}
                                <div style={estilos.puntos}>
                                    {destacados.map((game, i) => (
                                        <span
                                            key={game.id}
                                            style={i === posDestacado ? estilos.puntoActivo : estilos.punto}
                                            onClick={() => setPosDestacado(i)}
                                        />
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Juegos */}
                        <div style={estilos.encabezadoSeccion}>
                            <h2 style={estilos.tituloSeccion}>
                                {busqueda === '' ? 'Todos los juegos' : `Resultados para "${busqueda}"`}
                            </h2>
                            {busqueda === '' && juegosFiltrados.length > 4 && (
                                <span style={estilos.verTodos} onClick={() => setVerTodos(!verTodos)}>
                                    {verTodos ? 'Ver menos' : 'Ver todos'}
                                </span>
                            )}
                        </div>

                        {juegosGrilla.length === 0 ? (
                            <p style={estilos.mensajeVacio}>No encontramos juegos con ese nombre.</p>
                        ) : (
                            <div style={estilos.grilla}>
                                {juegosGrilla.map((game, i) => {
                                    // La primera tarjeta es mas ancha (como en la foto)
                                    let estiloTarjeta = i === 0 ? { ...estilos.tarjeta, ...estilos.tarjetaAncha } : estilos.tarjeta;
                                    if (juegoEncima === game.id) {
                                        estiloTarjeta = { ...estiloTarjeta, ...estilos.tarjetaEncima };
                                    }

                                    return (
                                        <Link
                                            key={game.id}
                                            to={`/games/${game.id}`}
                                            style={{ ...estiloTarjeta, background: fondoJuego(game) }}
                                            onMouseEnter={() => setJuegoEncima(game.id)}
                                            onMouseLeave={() => setJuegoEncima(null)}
                                            title={game.title}
                                        >
                                            {/* Si no tiene portada escribimos el nombre grande, como un logo */}
                                            {!game.coverImage && <span style={estilos.tarjetaTitulo}>{game.title}</span>}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

// Portadas de los juegos que no tienen imagen (solo violetas y azules)
const degradados = [
    'radial-gradient(circle at 70% 30%, #7c3aed 0%, transparent 60%), linear-gradient(160deg, #1e1b4b 0%, #312e81 100%)',
    'radial-gradient(circle at 30% 70%, #3b82f6 0%, transparent 60%), linear-gradient(160deg, #0f172a 0%, #1e3a8a 100%)',
    'radial-gradient(circle at 60% 60%, #a78bfa 0%, transparent 55%), linear-gradient(160deg, #172554 0%, #4c1d95 100%)',
    'radial-gradient(circle at 40% 30%, #6366f1 0%, transparent 60%), linear-gradient(160deg, #0b1020 0%, #312e81 100%)',
    'radial-gradient(circle at 70% 70%, #60a5fa 0%, transparent 55%), linear-gradient(160deg, #0c1445 0%, #3730a3 100%)',
];

const violeta = 'linear-gradient(90deg, #8f84ff 0%, #6b5cf0 100%)';
const pastillaOscura = 'rgba(0, 0, 0, 0.35)';

const estilos = {
    // Fondo de toda la pagina
    pagina: {
        minHeight: '85vh',
        padding: '32px 48px 60px',
        boxSizing: 'border-box',
        fontFamily: "'Montserrat', 'Segoe UI', sans-serif",
        background:
            'radial-gradient(ellipse at 45% 0%, rgba(111, 92, 240, 0.12) 0%, transparent 55%),' +
            '#0a0a14',
    },
    panel: {
        maxWidth: '1300px',
        margin: '0 auto',
        color: '#ffffff',
    },
    mensajeVacio: {
        color: '#9a97c0',
        textAlign: 'center',
        fontSize: '15px',
        padding: '60px 0',
    },

    // ---------- Barra de arriba ----------
    barraSuperior: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '24px',
    },
    buscador: {
        flex: '0 1 445px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        height: '36px',
        padding: '0 18px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '8px',
    },
    inputBuscador: {
        flex: 1,
        background: 'transparent',
        border: 'none',
        outline: 'none',
        color: '#ffffff',
        fontSize: '13px',
    },

    // ---------- Destacado ----------
    filaDestacado: {
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
    },
    banner: {
        flex: '2.45 1 480px',
        height: '310px',
        borderRadius: '14px',
        position: 'relative',
        overflow: 'hidden',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bannerSombra: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.3) 100%)',
    },
    etiquetas: {
        position: 'absolute',
        top: '16px',
        left: '22px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        flexWrap: 'wrap',
    },
    etiqueta: {
        background: pastillaOscura,
        color: '#ffffff',
        fontSize: '11px',
        padding: '6px 16px',
        borderRadius: '20px',
    },
    etiquetaMas: {
        color: '#ffffff',
        fontSize: '18px',
        fontWeight: '300',
        width: '24px',
        textAlign: 'center',
    },
    bannerTitulo: {
        position: 'relative',
        color: '#ffffff',
        fontSize: '76px',
        fontWeight: '800',
        letterSpacing: '6px',
        textTransform: 'uppercase',
        textAlign: 'center',
        lineHeight: 1,
        textShadow: '0 6px 30px rgba(0, 0, 0, 0.5)',
        margin: '70px 0 0',
        padding: '0 30px',
    },
    jugadas: {
        position: 'absolute',
        bottom: '24px',
        left: '22px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    iconoJugadas: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: violeta,
        border: '2px solid rgba(255, 255, 255, 0.8)',
        color: '#ffffff',
        fontSize: '11px',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textoJugadas: {
        background: pastillaOscura,
        color: '#ffffff',
        fontSize: '11px',
        padding: '6px 16px',
        borderRadius: '20px',
    },

    columnaDerecha: {
        flex: '1 1 220px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    // Tarjeta con brillo: oscura arriba a la izquierda, azul a la derecha y violeta abajo
    tarjetaInfo: {
        height: '222px',
        boxSizing: 'border-box',
        borderRadius: '14px',
        padding: '22px 24px 14px',
        display: 'flex',
        flexDirection: 'column',
        background:
            'radial-gradient(circle at 0% 110%, #a99fff 0%, #8f84ff 15%, transparent 55%),' +
            'radial-gradient(circle at 105% 55%, #3b82f6 0%, transparent 55%),' +
            'linear-gradient(135deg, #2a2352 0%, #1f1a4a 100%)',
    },
    infoTitulo: {
        color: '#ffffff',
        fontSize: '21px',
        fontWeight: '500',
        margin: '0 0 8px',
    },
    infoDescripcion: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: '10.5px',
        lineHeight: 1.45,
        margin: 0,
        flex: 1,
        // Si la descripcion es muy larga la cortamos en 4 renglones
        display: '-webkit-box',
        WebkitLineClamp: 4,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
    },
    infoDato: {
        color: '#ffffff',
        fontSize: '11px',
        margin: '0 0 8px',
    },
    filaBoton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    botonJugar: {
        background: 'rgba(0, 0, 0, 0.3)',
        color: '#ffffff',
        fontSize: '14px',
        padding: '10px 24px',
        borderRadius: '12px',
        textDecoration: 'none',
    },
    miniaturas: {
        display: 'flex',
        gap: '12px',
    },
    miniatura: {
        flex: 1,
        height: '76px',
        borderRadius: '10px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '8px',
        boxSizing: 'border-box',
    },
    miniaturaTexto: {
        color: '#ffffff',
        fontSize: '10px',
        fontWeight: '600',
    },

    // Puntitos debajo del banner
    puntos: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        margin: '18px 0 30px',
    },
    punto: {
        width: '4px',
        height: '4px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.3)',
        cursor: 'pointer',
    },
    puntoActivo: {
        width: '30px',
        height: '5px',
        borderRadius: '5px',
        background: violeta,
        cursor: 'pointer',
    },

    // ---------- Grilla de juegos ----------
    encabezadoSeccion: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '14px',
    },
    tituloSeccion: {
        color: '#ffffff',
        fontSize: '15px',
        fontWeight: '500',
        margin: 0,
    },
    verTodos: {
        color: '#ffffff',
        fontSize: '12px',
        cursor: 'pointer',
    },
    // 5 columnas: la primera tarjeta ocupa 2 (queda el doble de ancha, como en la foto)
    grilla: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gridAutoRows: '235px',
        gap: '12px',
    },
    tarjeta: {
        borderRadius: '12px',
        overflow: 'hidden',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px',
        boxSizing: 'border-box',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    tarjetaAncha: {
        gridColumn: 'span 2',
    },
    tarjetaEncima: {
        transform: 'translateY(-5px)',
        boxShadow: '0 14px 34px rgba(111, 92, 240, 0.4)',
    },
    tarjetaTitulo: {
        color: '#ffffff',
        fontSize: '24px',
        fontWeight: '800',
        textTransform: 'uppercase',
        textAlign: 'center',
        lineHeight: 1.05,
        textShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
    },
};

export default Games;
