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

function GameDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);

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

    // Datos que calculamos para mostrar
    const capturas = leerCapturas(game.screenshots);
    const nombreAutor = game.author
        ? `${game.author.firstName} ${game.author.lastName || ''}`.trim()
        : `Usuario ${game.authorId}`;
    const inicialesAutor = game.author
        ? (game.author.firstName.charAt(0) + (game.author.lastName || '').charAt(0)).toUpperCase()
        : 'U';
    const tieneValoraciones = game.ratingsCount > 0;
    const verPerfilAutor = () => navigate(`/usuarios/${game.authorId}`);

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
                            Explorar / <span style={estilos.rutaLink} onClick={() => navigate('/games')}>Juegos</span> / <span style={estilos.rutaActual}>{game.title}</span>
                        </p>
                        <div style={estilos.etiquetas}>
                            {game.platforms && <span style={estilos.etiquetaClara}>{game.platforms}</span>}
                            {game.subject && <span style={estilos.etiquetaClara}>{game.subject}</span>}
                            {game.grade && <span style={estilos.etiquetaClara}>{game.grade}</span>}
                        </div>
                        <h1 style={estilos.titulo}>{game.title}</h1>
                        <p style={estilos.resumen}>{game.description}</p>

                        <div style={estilos.autor}>
                            <div style={estilos.avatar}>{inicialesAutor}</div>
                            <div>
                                <div style={estilos.autorLink} onClick={verPerfilAutor}>{nombreAutor}</div>
                                <div style={estilos.autorDato}>Publicado el {new Date(game.createdAt).toLocaleDateString('es-AR')}</div>
                            </div>

                            {/* Valoracion promedio real (si todavia no hay votos, lo decimos) */}
                            <div style={estilos.separador} />
                            {tieneValoraciones ? (
                                <>
                                    <div style={estilos.valoracionNota}>{game.avgRating}</div>
                                    <div>
                                        <div style={estilos.estrellas}>
                                            {[1, 2, 3, 4, 5].map((n) => (
                                                <svg key={n} width="12" height="12" viewBox="0 0 24 24" fill={n <= Math.round(game.avgRating) ? '#f5b301' : '#3a3a4d'}>
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
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                                    <path d="M7 4l13 8-13 8z" />
                                </svg>
                                Jugar ahora
                            </button>
                            <button
                                style={game.isFavorite ? estilos.botonGuardado : estilos.botonSecundario}
                                onClick={toggleFavorito}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill={game.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                                    <path d="M6 3h12v18l-6-4-6 4z" />
                                </svg>
                                {game.isFavorite ? 'Guardado' : 'Guardar'}
                            </button>
                            <button style={estilos.botonSecundario} onClick={compartir}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 15V3M7 8l5-5 5 5M4 14v6h16v-6" />
                                </svg>
                                Compartir
                            </button>
                        </div>
                    </div>

                    {/* Portada del juego (si no tiene, mostramos el degradado) */}
                    {game.coverImage ? (
                        <img src={API + game.coverImage} alt={`Portada de ${game.title}`} style={estilos.portada} />
                    ) : (
                        <div style={estilos.vistaPrevia} />
                    )}
                </div>
            </div>

            {/* Contenido: descripción + capturas + barra lateral */}
            <div style={estilos.contenido}>
                <div style={estilos.columnaPrincipal}>
                    <h2 style={estilos.subtitulo}>Sobre el juego</h2>
                    <p style={estilos.parrafo}>{game.description}</p>

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

                    {/* Acá van las valoraciones y los comentarios (parte de Luciano) */}
                </div>

                <div style={estilos.barralateral}>
                    <div style={estilos.tarjeta}>
                        <h3 style={estilos.tituloTarjeta}>Ficha del juego</h3>
                        <div style={estilos.dato}>
                            <span style={estilos.datoNombre}>Plataformas</span>
                            <span style={estilos.datoValor}>{game.platforms || '-'}</span>
                        </div>
                        <div style={estilos.dato}>
                            <span style={estilos.datoNombre}>Materia</span>
                            <span style={estilos.datoValor}>{game.subject || '-'}</span>
                        </div>
                        <div style={estilos.dato}>
                            <span style={estilos.datoNombre}>Curso</span>
                            <span style={estilos.datoValor}>{game.grade || '-'}</span>
                        </div>
                        <div style={estilos.dato}>
                            <span style={estilos.datoNombre}>Publicado</span>
                            <span style={estilos.datoValor}>{new Date(game.createdAt).toLocaleDateString('es-AR')}</span>
                        </div>
                        <div style={estilos.dato}>
                            <span style={estilos.datoNombre}>Actualizado</span>
                            <span style={estilos.datoValor}>{new Date(game.updatedAt).toLocaleDateString('es-AR')}</span>
                        </div>
                        <div style={estilos.datoUltimo}>
                            <span style={estilos.datoNombre}>Autor</span>
                            <span style={{ ...estilos.datoValor, ...estilos.autorLink }} onClick={verPerfilAutor}>{nombreAutor}</span>
                        </div>
                    </div>

                    <div style={estilos.estadisticas}>
                        <div style={estilos.estadistica}>
                            <div style={estilos.estadisticaNumero}>{game.plays || 0}</div>
                            <div style={estilos.estadisticaNombre}>Jugadas</div>
                        </div>
                        <div style={estilos.estadistica}>
                            <div style={estilos.estadisticaNumero}>{game.favoritesCount || 0}</div>
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

const estilos = {
    contenedor: {
        background: '#050509',
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
    cabecera: {
        padding: '80px 32px',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        background: 'radial-gradient(circle at 75% 40%, rgba(88, 60, 200, 0.45) 0%, transparent 55%), linear-gradient(135deg, #070720 0%, #0d0c33 60%, #14104a 100%)',
    },
    cabeceraInterior: {
        width: '100%',
        maxWidth: '960px',
        margin: '0 auto',
        display: 'flex',
        gap: '90px',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    cabeceraTexto: {
        flex: '0 1 350px',
    },
    ruta: {
        color: '#8b8fa8',
        fontSize: '11px',
        margin: '0 0 16px',
    },
    rutaLink: {
        cursor: 'pointer',
    },
    rutaActual: {
        color: '#ffffff',
    },
    etiquetas: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
    },
    etiquetaClara: {
        background: '#ffffff',
        color: '#07070f',
        fontSize: '11px',
        fontWeight: '600',
        padding: '5px 13px',
        borderRadius: '20px',
    },
    titulo: {
        color: '#ffffff',
        fontSize: '52px',
        fontWeight: '400',
        lineHeight: 1.1,
        margin: '14px 0 16px',
    },
    resumen: {
        color: '#d3d6e6',
        fontSize: '14px',
        lineHeight: 1.55,
        margin: '0 0 20px',
        maxWidth: '350px',
    },
    autor: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '24px',
    },
    avatar: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
        color: '#ffffff',
        fontSize: '12px',
        fontWeight: '600',
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
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'underline',
    },
    autorDato: {
        color: '#8b8fa8',
        fontSize: '11px',
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
        background: '#ffffff',
        color: '#07070f',
        border: 'none',
        borderRadius: '30px',
        height: '40px',
        padding: '0 24px',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    botonSecundario: {
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        background: 'rgba(255,255,255,0.1)',
        color: '#ffffff',
        border: 'none',
        borderRadius: '30px',
        height: '40px',
        padding: '0 18px',
        fontSize: '11px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    botonGuardado: {
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        background: '#7c3aed',
        color: '#ffffff',
        border: 'none',
        borderRadius: '30px',
        height: '40px',
        padding: '0 18px',
        fontSize: '11px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    separador: {
        width: '1px',
        height: '32px',
        background: 'rgba(255,255,255,0.15)',
        margin: '0 6px',
    },
    valoracionNota: {
        color: '#ffffff',
        fontSize: '22px',
    },
    estrellas: {
        display: 'flex',
        gap: '2px',
        marginBottom: '2px',
    },

    vistaPrevia: {
        flex: '1 1 460px',
        aspectRatio: '16 / 9',
        borderRadius: '28px',
        border: '1px solid rgba(255,255,255,0.15)',
        background: 'linear-gradient(135deg, #14123a 0%, #2b1a6b 50%, #12365e 100%)',
        boxSizing: 'border-box',
    },
    portada: {
        flex: '1 1 460px',
        width: '100%',
        maxWidth: '520px',
        aspectRatio: '16 / 9',
        objectFit: 'cover',
        borderRadius: '28px',
        border: '1px solid rgba(255,255,255,0.15)',
        boxSizing: 'border-box',
    },

    contenido: {
        maxWidth: '960px',
        margin: '0 auto',
        padding: '40px 32px 60px',
        display: 'flex',
        gap: '40px',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        boxSizing: 'border-box',
    },
    columnaPrincipal: {
        flex: '1 1 480px',
    },
    subtitulo: {
        color: '#ffffff',
        fontSize: '24px',
        fontWeight: '400',
        margin: '0 0 14px',
    },
    parrafo: {
        color: '#b4b8cc',
        fontSize: '13px',
        lineHeight: 1.7,
        margin: '0 0 40px',
        whiteSpace: 'pre-line',
    },
    capturas: {
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        marginBottom: '40px',
    },
    capturaLink: {
        flex: '1 1 140px',
    },
    capturaImagen: {
        width: '100%',
        aspectRatio: '12 / 7',
        objectFit: 'cover',
        borderRadius: '14px',
        border: '1px solid #26233d',
        display: 'block',
    },
    textoVacio: {
        color: '#8b8fa8',
        fontSize: '13px',
        margin: '0 0 40px',
    },

    barralateral: {
        flex: '0 0 262px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    tarjeta: {
        background: '#0d0d14',
        borderRadius: '22px',
        padding: '20px 18px',
        border: '1px solid #181826',
    },
    tituloTarjeta: {
        color: '#ffffff',
        fontSize: '15px',
        fontWeight: '500',
        margin: '0 0 12px',
    },
    dato: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '10px 0',
        borderBottom: '1px solid #1d1d2b',
        fontSize: '11px',
    },
    datoUltimo: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '10px 0 0',
        fontSize: '11px',
    },
    datoNombre: {
        color: '#8b8fa8',
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
        background: '#0d0d14',
        border: '1px solid #181826',
        borderRadius: '18px',
        padding: '14px 0',
        textAlign: 'center',
    },
    estadisticaNumero: {
        color: '#ffffff',
        fontSize: '18px',
    },
    estadisticaNombre: {
        color: '#8b8fa8',
        fontSize: '10px',
        marginTop: '4px',
    },

    autorTarjeta: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
    },
    avatarGrande: {
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
        color: '#ffffff',
        fontSize: '12px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    botonPerfil: {
        width: '100%',
        height: '38px',
        border: 'none',
        borderRadius: '30px',
        background: '#242433',
        color: '#ffffff',
        fontSize: '11px',
        fontWeight: '600',
        cursor: 'pointer',
    },
};

export default GameDetail;
