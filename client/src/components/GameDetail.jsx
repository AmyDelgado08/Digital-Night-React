import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:3000';

// Las capturas pueden venir como lista o como texto JSON, las pasamos siempre a lista
const leerCapturas = (screenshots) => {
    if (!screenshots) return [];
    if (Array.isArray(screenshots)) return screenshots;
    try {
        return JSON.parse(screenshots);
    } catch {
        return [];
    }
};

// Muestra los numeros grandes cortitos: 12400 -> "12,4k"
const formatearNumero = (numero) => {
    if (!numero) return 0;
    if (numero >= 1000) {
        return (numero / 1000).toFixed(1).replace('.', ',') + 'k';
    }
    return numero;
};

function GameDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pestaña, setPestaña] = useState('descripcion');

    useEffect(() => {
        const fetchGame = async () => {
            try {
                // Si hay sesion mandamos el token, asi el back nos dice si ya lo guardamos en favoritos
                const token = localStorage.getItem('token');
                const config = token ? { headers: { authorization: token } } : {};

                const response = await axios.get(`${API}/games/${id}`, config);
                setGame(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar detalle del juego:', error);
                setLoading(false);
            }
        };

        fetchGame();
    }, [id]);

    // Guardar o quitar de favoritos
    const toggleFavorito = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Tenés que iniciar sesión para guardar juegos en favoritos.');
            navigate('/login');
            return;
        }

        try {
            let response;
            if (game.isFavorite) {
                response = await axios.delete(`${API}/games/${id}/favorite`, {
                    headers: { authorization: token }
                });
            } else {
                response = await axios.post(`${API}/games/${id}/favorite`, {}, {
                    headers: { authorization: token }
                });
            }

            // Actualizamos el boton y el contador sin recargar
            setGame({
                ...game,
                isFavorite: response.data.isFavorite,
                favoritesCount: response.data.favoritesCount
            });
        } catch (error) {
            alert(error.response?.data?.message || 'No se pudo actualizar tus favoritos.');
        }
    };

    // Jugar: suma una jugada y abre el link o el archivo del juego
    const jugar = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = token ? { headers: { authorization: token } } : {};

            const response = await axios.post(`${API}/games/${id}/play`, {}, config);
            setGame({ ...game, plays: response.data.plays });

            if (response.data.gameUrl) {
                window.open(response.data.gameUrl, '_blank');
            } else if (response.data.gameFile) {
                window.open(API + response.data.gameFile, '_blank');
            } else {
                alert('Este juego todavía no tiene un link ni un archivo para jugar.');
            }
        } catch (error) {
            alert(error.response?.data?.message || 'No se pudo iniciar el juego.');
        }
    };

    // Compartir: copia el link de esta pagina
    const compartir = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert('¡Link copiado! Ya lo podés pegar donde quieras.');
        } catch {
            alert('No se pudo copiar. Copiá el link desde la barra del navegador.');
        }
    };

    if (loading) {
        return <div style={estilos.contenedor}><p style={estilos.mensaje}>Cargando juego...</p></div>;
    }

    if (!game) {
        return <div style={estilos.contenedor}><p style={estilos.mensaje}>Juego no encontrado.</p></div>;
    }

    const capturas = leerCapturas(game.screenshots);
    const nombreAutor = game.author
        ? `${game.author.firstName} ${game.author.lastName || ''}`.trim()
        : `Usuario ${game.authorId}`;
    const inicialesAutor = game.author
        ? (game.author.firstName.charAt(0) + (game.author.lastName || '').charAt(0)).toUpperCase()
        : 'U';
    const tieneValoraciones = game.ratingsCount > 0;
    const fechaPublicado = new Date(game.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
    const verPerfilAutor = () => navigate(`/usuarios/${game.authorId}`);

    const esYoutube = game.videoUrl && game.videoUrl.includes('youtube.com/watch');

    const imagenPrincipal = game.coverImage || capturas[0];

    const seccionCapturas = (
        <>
            <h2 style={estilos.subtitulo}>Capturas</h2>
            {capturas.length > 0 ? (
                <div style={estilos.capturas}>
                    {capturas.map((captura, i) => (
                        <a key={i} href={API + captura} target="_blank" rel="noreferrer" style={estilos.capturaLink}>
                            <img src={API + captura} alt={`Captura ${i + 1}`} style={estilos.capturaImagen} />
                        </a>
                    ))}
                </div>
            ) : (
                <p style={estilos.textoVacio}>Este juego todavía no tiene capturas.</p>
            )}
        </>
    );

    return (
        <div style={estilos.contenedor}>
            {/* Aviso si el juego todavia no esta publicado (solo lo ven el autor y los admin) */}
            {game.status === 'pendiente' && (
                <div style={estilos.aviso}>
                    Este juego está <strong>en revisión</strong>. Un administrador lo tiene que aprobar antes de que aparezca en el catálogo.
                </div>
            )}
            {game.status === 'rechazado' && (
                <div style={estilos.avisoRechazo}>
                    Este juego fue <strong>rechazado</strong>.
                    {game.rejectionReason && <> Motivo: {game.rejectionReason}</>}
                </div>
            )}

            {/* Cabecera: datos principales + portada */}
            <div style={estilos.cabecera}>
                <div style={estilos.cabeceraInterior}>
                    <div style={estilos.cabeceraTexto}>
                        <p style={estilos.ruta}>
                            <span style={estilos.rutaLink} onClick={() => navigate('/games')}>Explorar</span>
                            <span style={estilos.rutaBarra}>/</span>
                            <span style={estilos.rutaLink} onClick={() => navigate('/games')}>Juegos</span>
                            <span style={estilos.rutaBarra}>/</span>
                            <span style={estilos.rutaActual}>{game.title}</span>
                        </p>

                        <div style={estilos.etiquetas}>
                            {game.subject && <span style={estilos.etiquetaPrincipal}>{game.subject}</span>}
                            {game.platforms && <span style={estilos.etiqueta}>{game.platforms}</span>}
                            {game.grade && <span style={estilos.etiqueta}>{game.grade}</span>}
                        </div>

                        <h1 style={estilos.titulo}>{game.title}</h1>
                        <p style={estilos.resumen}>{game.description}</p>

                        <div style={estilos.autor}>
                            <div style={estilos.avatar}>{inicialesAutor}</div>
                            <div>
                                <div style={estilos.autorLink} onClick={verPerfilAutor}>{nombreAutor}</div>
                                <div style={estilos.autorDato}>Publicado el {fechaPublicado}</div>
                            </div>

                            {/* Valoracion promedio real (si todavia no hay votos, lo decimos) */}
                            <div style={estilos.separador} />
                            {tieneValoraciones ? (
                                <>
                                    <div style={estilos.valoracionNota}>{game.avgRating}</div>
                                    <div>
                                        <div style={estilos.estrellas}>
                                            {[1, 2, 3, 4, 5].map((n) => (
                                                <svg key={n} width="11" height="11" viewBox="0 0 24 24" fill={n <= Math.round(game.avgRating) ? '#fbbf24' : '#3a3760'}>
                                                    <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <div style={estilos.autorDato}>{game.ratingsCount} valoraciones</div>
                                    </div>
                                </>
                            ) : (
                                <div style={estilos.autorDato}>Sin valoraciones todavía</div>
                            )}
                        </div>

                        <div style={estilos.botones}>
                            <button style={estilos.botonJugar} onClick={jugar}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
                                    <path d="M7 4l13 8-13 8z" />
                                </svg>
                                Jugar ahora
                            </button>
                            <button
                                style={game.isFavorite ? estilos.botonGuardado : estilos.botonSecundario}
                                onClick={toggleFavorito}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill={game.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                                    <path d="M6 3h12v18l-6-4-6 4z" />
                                </svg>
                                {game.isFavorite ? 'Guardado' : 'Guardar'}
                            </button>
                            <button style={estilos.botonSecundario} onClick={compartir}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 15V3M7 8l5-5 5 5M4 14v6h16v-6" />
                                </svg>
                                Compartir
                            </button>
                        </div>
                    </div>

                    {/* Video del juego. Si no tiene video mostramos la portada o la primera captura. Si no tiene nada queda vacio */}
                    <div style={estilos.portadaCaja}>
                        {esYoutube ? (
                            <iframe
                                src={game.videoUrl.replace('watch?v=', 'embed/')}
                                title={`Video de ${game.title}`}
                                style={estilos.video}
                                allowFullScreen
                            />
                        ) : game.videoUrl ? (
                            <video src={game.videoUrl} controls style={estilos.video} />
                        ) : imagenPrincipal ? (
                            <img src={API + imagenPrincipal} alt={`Imagen de ${game.title}`} style={estilos.portada} />
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Contenido: pestañas + barra lateral */}
            <div style={estilos.contenido}>
                <div style={estilos.columnaPrincipal}>
                    <div style={estilos.pestañas}>
                        <span
                            style={pestaña === 'descripcion' ? estilos.pestañaActiva : estilos.pestaña}
                            onClick={() => setPestaña('descripcion')}
                        >
                            Descripción
                        </span>
                        <span
                            style={pestaña === 'capturas' ? estilos.pestañaActiva : estilos.pestaña}
                            onClick={() => setPestaña('capturas')}
                        >
                            Capturas
                        </span>
                        <span
                            style={pestaña === 'valoraciones' ? estilos.pestañaActiva : estilos.pestaña}
                            onClick={() => setPestaña('valoraciones')}
                        >
                            Valoraciones ({game.ratingsCount || 0})
                        </span>
                    </div>

                    {pestaña === 'descripcion' && (
                        <>
                            <h2 style={estilos.subtitulo}>Sobre el juego</h2>
                            <p style={estilos.parrafo}>{game.description}</p>
                            {seccionCapturas}
                        </>
                    )}

                    {pestaña === 'capturas' && seccionCapturas}

                    {pestaña === 'valoraciones' && (
                        <>
                            <h2 style={estilos.subtitulo}>Valoraciones</h2>
                            {/* Acá van las valoraciones y los comentarios (parte de Luciano) */}
                            <p style={estilos.textoVacio}>Todavía no hay valoraciones para este juego.</p>
                        </>
                    )}
                </div>

                <div style={estilos.barralateral}>
                    <div style={estilos.tarjeta}>
                        <h3 style={estilos.tituloTarjeta}>Ficha del juego</h3>
                        <div style={estilos.dato}>
                            <span style={estilos.datoNombre}>Materia</span>
                            <span style={estilos.datoValor}>{game.subject || '-'}</span>
                        </div>
                        <div style={estilos.dato}>
                            <span style={estilos.datoNombre}>Curso</span>
                            <span style={estilos.datoValor}>{game.grade || '-'}</span>
                        </div>
                        <div style={estilos.dato}>
                            <span style={estilos.datoNombre}>Plataforma</span>
                            <span style={estilos.datoValor}>{game.platforms || '-'}</span>
                        </div>
                        <div style={estilos.dato}>
                            <span style={estilos.datoNombre}>Lanzamiento</span>
                            <span style={estilos.datoValor}>{fechaPublicado}</span>
                        </div>
                        <div style={estilos.datoUltimo}>
                            <span style={estilos.datoNombre}>Actualizado</span>
                            <span style={estilos.datoValor}>{new Date(game.updatedAt).toLocaleDateString('es-AR')}</span>
                        </div>
                    </div>

                    <div style={estilos.estadisticas}>
                        <div style={estilos.estadistica}>
                            <div style={estilos.estadisticaNumero}>{formatearNumero(game.plays)}</div>
                            <div style={estilos.estadisticaNombre}>Jugadas</div>
                        </div>
                        <div style={estilos.estadistica}>
                            <div style={estilos.estadisticaNumero}>{formatearNumero(game.favoritesCount)}</div>
                            <div style={estilos.estadisticaNombre}>Favoritos</div>
                        </div>
                        <div style={estilos.estadistica}>
                            <div style={estilos.estadisticaNumero}>{tieneValoraciones ? game.avgRating : '-'}</div>
                            <div style={estilos.estadisticaNombre}>Nota</div>
                        </div>
                    </div>

                    <div style={estilos.tarjeta}>
                        <div style={estilos.autorTarjeta}>
                            <div style={estilos.avatarGrande}>{inicialesAutor}</div>
                            <div>
                                <div style={estilos.autorNombre}>{nombreAutor}</div>
                                <div style={estilos.autorDato}>Autor del juego</div>
                            </div>
                        </div>
                        <button style={estilos.botonPerfil} onClick={verPerfilAutor}>Ver perfil</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Colores que se repiten en toda la pagina
const violeta = 'linear-gradient(90deg, #8f84ff 0%, #6b5cf0 100%)';
const fondoTarjeta = 'rgba(24, 21, 58, 0.65)';
const bordeTarjeta = '1px solid rgba(143, 132, 255, 0.18)';
const textoGris = '#9a97c0';

// Estrellitas del fondo (cada radial-gradient es un puntito blanco)
const estrellas =
    'radial-gradient(1.5px 1.5px at 8% 20%, #ffffff, transparent),' +
    'radial-gradient(1px 1px at 22% 70%, #ffffff, transparent),' +
    'radial-gradient(1.5px 1.5px at 35% 12%, #c7c2ff, transparent),' +
    'radial-gradient(1px 1px at 47% 85%, #ffffff, transparent),' +
    'radial-gradient(2px 2px at 52% 30%, #ffffff, transparent),' +
    'radial-gradient(1px 1px at 63% 8%, #ffffff, transparent),' +
    'radial-gradient(1.5px 1.5px at 74% 92%, #c7c2ff, transparent),' +
    'radial-gradient(1px 1px at 88% 18%, #ffffff, transparent),' +
    'radial-gradient(2px 2px at 95% 60%, #ffffff, transparent),' +
    'radial-gradient(1px 1px at 15% 45%, #ffffff, transparent)';

const estilos = {
    contenedor: {
        background: '#0b0a1c',
        minHeight: '85vh',
        color: '#e2e8f0',
        fontFamily: "'Montserrat', 'Segoe UI', sans-serif",
    },
    mensaje: {
        color: '#ffffff',
        padding: '40px 32px',
    },
    aviso: {
        background: '#3b2f0b',
        color: '#fcd34d',
        borderBottom: '1px solid #854d0e',
        padding: '14px 32px',
        fontSize: '14px',
        textAlign: 'center',
    },
    avisoRechazo: {
        background: '#3b0b0b',
        color: '#fca5a5',
        borderBottom: '1px solid #991b1b',
        padding: '14px 32px',
        fontSize: '14px',
        textAlign: 'center',
    },

    // ---------- Cabecera ----------
    cabecera: {
        padding: '70px 32px 90px',
        minHeight: '460px',
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        borderBottom: '1px solid rgba(143, 132, 255, 0.12)',
        background:
            estrellas + ',' +
            'radial-gradient(ellipse at 70% 45%, rgba(111, 92, 240, 0.35) 0%, transparent 55%),' +
            'radial-gradient(ellipse at 10% 100%, rgba(59, 70, 200, 0.25) 0%, transparent 50%),' +
            'linear-gradient(180deg, #0d0b26 0%, #120f36 100%)',
    },
    cabeceraInterior: {
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto',
        display: 'flex',
        gap: '60px',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    cabeceraTexto: {
        flex: '1 1 360px',
    },
    ruta: {
        color: textoGris,
        fontSize: '11px',
        margin: '0 0 14px',
    },
    rutaLink: {
        cursor: 'pointer',
    },
    rutaBarra: {
        margin: '0 8px',
        opacity: 0.5,
    },
    rutaActual: {
        color: '#ffffff',
    },
    etiquetas: {
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap',
    },
    etiquetaPrincipal: {
        background: violeta,
        color: '#ffffff',
        fontSize: '10px',
        fontWeight: '600',
        padding: '5px 12px',
        borderRadius: '20px',
    },
    etiqueta: {
        background: 'rgba(255, 255, 255, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        color: '#e2e0ff',
        fontSize: '10px',
        fontWeight: '600',
        padding: '4px 12px',
        borderRadius: '20px',
    },
    titulo: {
        color: '#ffffff',
        fontSize: '54px',
        fontWeight: '700',
        letterSpacing: '-1px',
        lineHeight: 1.1,
        margin: '14px 0 16px',
    },
    resumen: {
        color: '#cfcde8',
        fontSize: '14px',
        lineHeight: 1.6,
        margin: '0 0 22px',
        maxWidth: '380px',
    },
    autor: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '26px',
    },
    avatar: {
        width: '34px',
        height: '34px',
        borderRadius: '50%',
        background: violeta,
        color: '#ffffff',
        fontSize: '11px',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    autorNombre: {
        color: '#ffffff',
        fontSize: '13px',
        fontWeight: '600',
    },
    autorLink: {
        color: '#ffffff',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    autorDato: {
        color: textoGris,
        fontSize: '10px',
        marginTop: '2px',
    },
    separador: {
        width: '1px',
        height: '30px',
        background: 'rgba(255, 255, 255, 0.15)',
        margin: '0 6px',
    },
    valoracionNota: {
        color: '#ffffff',
        fontSize: '22px',
        fontWeight: '700',
    },
    estrellas: {
        display: 'flex',
        gap: '2px',
    },
    botones: {
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
    },
    botonJugar: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: violeta,
        color: '#ffffff',
        border: 'none',
        borderRadius: '30px',
        height: '42px',
        padding: '0 28px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(111, 92, 240, 0.45)',
    },
    botonSecundario: {
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        background: 'rgba(255, 255, 255, 0.04)',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        borderRadius: '30px',
        height: '42px',
        padding: '0 20px',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    botonGuardado: {
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        background: 'rgba(143, 132, 255, 0.2)',
        color: '#ffffff',
        border: '1px solid #8f84ff',
        borderRadius: '30px',
        height: '42px',
        padding: '0 20px',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
    },

    // Portada con el boton de play en el medio
    portadaCaja: {
        flex: '1 1 440px',
        position: 'relative',
        borderRadius: '24px',
        border: '1px solid rgba(143, 132, 255, 0.25)',
        overflow: 'hidden',
        aspectRatio: '16 / 9',
        background: 'rgba(24, 21, 58, 0.45)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    },
    video: {
        width: '100%',
        height: '100%',
        border: 'none',
        display: 'block',
        background: '#000000',
    },
    portada: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    },

    // ---------- Contenido ----------
    contenido: {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '44px 32px 70px',
        display: 'flex',
        gap: '36px',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        boxSizing: 'border-box',
    },
    columnaPrincipal: {
        flex: '1 1 480px',
    },
    pestañas: {
        display: 'flex',
        gap: '26px',
        borderBottom: '1px solid rgba(143, 132, 255, 0.15)',
        marginBottom: '30px',
    },
    pestaña: {
        color: textoGris,
        fontSize: '12px',
        padding: '0 0 12px',
        cursor: 'pointer',
    },
    pestañaActiva: {
        color: '#ffffff',
        fontSize: '12px',
        fontWeight: '600',
        padding: '0 0 12px',
        cursor: 'pointer',
        borderBottom: '2px solid #8f84ff',
        marginBottom: '-1px',
    },
    subtitulo: {
        color: '#ffffff',
        fontSize: '21px',
        fontWeight: '600',
        margin: '0 0 14px',
    },
    parrafo: {
        color: '#b9b6d8',
        fontSize: '13px',
        lineHeight: 1.75,
        margin: '0 0 40px',
        whiteSpace: 'pre-line',
    },
    capturas: {
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '40px',
    },
    capturaLink: {
        flex: '1 1 150px',
    },
    capturaImagen: {
        width: '100%',
        aspectRatio: '16 / 10',
        objectFit: 'cover',
        borderRadius: '14px',
        border: bordeTarjeta,
        display: 'block',
    },
    textoVacio: {
        color: textoGris,
        fontSize: '13px',
        background: fondoTarjeta,
        border: '1px dashed rgba(143, 132, 255, 0.25)',
        borderRadius: '14px',
        padding: '26px',
        textAlign: 'center',
        margin: '0 0 40px',
    },

    // ---------- Barra lateral ----------
    barralateral: {
        flex: '0 0 270px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
    },
    tarjeta: {
        background: fondoTarjeta,
        border: bordeTarjeta,
        borderRadius: '18px',
        padding: '20px 18px',
    },
    tituloTarjeta: {
        color: '#ffffff',
        fontSize: '15px',
        fontWeight: '600',
        margin: '0 0 10px',
    },
    dato: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '11px 0',
        borderBottom: '1px solid rgba(143, 132, 255, 0.12)',
        fontSize: '11px',
    },
    datoUltimo: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '11px 0 0',
        fontSize: '11px',
    },
    datoNombre: {
        color: textoGris,
    },
    datoValor: {
        color: '#ffffff',
        fontWeight: '600',
        textAlign: 'right',
    },
    estadisticas: {
        display: 'flex',
        gap: '10px',
    },
    estadistica: {
        flex: 1,
        background: fondoTarjeta,
        border: bordeTarjeta,
        borderRadius: '16px',
        padding: '14px 0',
        textAlign: 'center',
    },
    estadisticaNumero: {
        color: '#ffffff',
        fontSize: '19px',
        fontWeight: '700',
    },
    estadisticaNombre: {
        color: textoGris,
        fontSize: '10px',
        marginTop: '3px',
    },
    autorTarjeta: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
    },
    avatarGrande: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: violeta,
        color: '#ffffff',
        fontSize: '13px',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    botonPerfil: {
        width: '100%',
        height: '38px',
        border: 'none',
        borderRadius: '30px',
        background: violeta,
        color: '#ffffff',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
    },
};

export default GameDetail;
