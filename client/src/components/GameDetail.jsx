import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function GameDetail() {
    const { id } = useParams();
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
            <div style={estilos.cabecera}>
                <div style={estilos.cabeceraInterior}>
                    <div style={estilos.cabeceraTexto}>
                        <p style={estilos.ruta}>
                            Explorar / <span style={estilos.rutaLink} onClick={() => navigate('/games')}>Juegos</span> / <span style={estilos.rutaActual}>{game.title}</span>
                        </p>
                        <div style={estilos.etiquetas}>
                            {game.platforms && <span style={estilos.etiquetaClara}>{game.platforms}</span>}
                        </div>
                        <h1 style={estilos.titulo}>{game.title}</h1>
                        <p style={estilos.resumen}>{game.description}</p>

                        <div style={estilos.autor}>
                            <div style={estilos.avatar}>U{game.authorId}</div>
                            <div>
                                <div style={estilos.autorNombre}>Usuario {game.authorId}</div>
                                <div style={estilos.autorDato}>Publicado el {new Date(game.createdAt).toLocaleDateString('es-AR')}</div>
                            </div>

                            {/* Valoración de ejemplo (aún no existe en la base de datos) */}
                            <div style={estilos.separador} />
                            <div style={estilos.valoracionNota}>4,8</div>
                            <div>
                                <div style={estilos.estrellas}>
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <svg key={n} width="12" height="12" viewBox="0 0 24 24" fill="#f5b301">
                                            <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
                                        </svg>
                                    ))}
                                </div>
                                <div style={estilos.autorDato}>312 valoraciones</div>
                            </div>
                        </div>

                        <div style={estilos.botones}>
                            <button style={estilos.botonJugar}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                                    <path d="M7 4l13 8-13 8z" />
                                </svg>
                                Jugar ahora
                            </button>
                            <button style={estilos.botonSecundario}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                                    <path d="M6 3h12v18l-6-4-6 4z" />
                                </svg>
                                Guardar
                            </button>
                            <button style={estilos.botonSecundario}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 15V3M7 8l5-5 5 5M4 14v6h16v-6" />
                                </svg>
                                Compartir
                            </button>
                        </div>
                    </div>

                    {/* Recuadro del video (vacío) */}
                    <div style={estilos.vistaPrevia} />
                </div>
            </div>

            {/* Contenido: pestañas + descripción + barra lateral */}
            <div style={estilos.contenido}>
                <div style={estilos.columnaPrincipal}>
                    <div style={estilos.pestanas}>
                        <span style={estilos.pestanaActiva}>Descripción</span>
                        <span style={estilos.pestana}>Capturas</span>
                        <span style={estilos.pestana}>Valoraciones</span>
                        <span style={estilos.pestana}>Novedades</span>
                    </div>

                    <h2 style={estilos.subtitulo}>Sobre el juego</h2>
                    <p style={estilos.parrafo}>{game.description}</p>

                    <h2 style={estilos.subtitulo}>Capturas</h2>
                    <div style={estilos.capturas}>
                        <div style={estilos.captura} />
                        <div style={estilos.captura} />
                        <div style={estilos.captura} />
                    </div>
                </div>

                <div style={estilos.barralateral}>
                    <div style={estilos.tarjeta}>
                        <h3 style={estilos.tituloTarjeta}>Ficha del juego</h3>
                        <div style={estilos.dato}>
                            <span style={estilos.datoNombre}>Plataformas</span>
                            <span style={estilos.datoValor}>{game.platforms}</span>
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
                            <span style={estilos.datoValor}>Usuario {game.authorId}</span>
                        </div>
                    </div>

                    <div style={estilos.estadisticas}>
                        <div style={estilos.estadistica}>
                            <div style={estilos.estadisticaNumero}>-</div>
                            <div style={estilos.estadisticaNombre}>Jugadas</div>
                        </div>
                        <div style={estilos.estadistica}>
                            <div style={estilos.estadisticaNumero}>-</div>
                            <div style={estilos.estadisticaNombre}>Favoritos</div>
                        </div>
                        <div style={estilos.estadistica}>
                            <div style={estilos.estadisticaNumero}>-</div>
                            <div style={estilos.estadisticaNombre}>Nota</div>
                        </div>
                    </div>

                    <div style={estilos.tarjeta}>
                        <div style={estilos.autorTarjeta}>
                            <div style={estilos.avatarGrande}>U{game.authorId}</div>
                            <div>
                                <div style={estilos.autorNombre}>Usuario {game.authorId}</div>
                                <div style={estilos.autorDato}>Autor del juego</div>
                            </div>
                        </div>
                        <div style={estilos.botones}>
                            <button style={estilos.botonSeguir}>Seguir</button>
                            <button style={estilos.botonPerfil}>Ver perfil</button>
                        </div>
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
    autorDato: {
        color: '#8b8fa8',
        fontSize: '11px',
    },
    botones: {
        display: 'flex',
        gap: '10px',
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
    pestanas: {
        display: 'flex',
        gap: '28px',
        borderBottom: '1px solid #1d1d2b',
        marginBottom: '36px',
        fontSize: '12px',
    },
    pestana: {
        color: '#8b8fa8',
        paddingBottom: '12px',
        cursor: 'pointer',
    },
    pestanaActiva: {
        color: '#ffffff',
        paddingBottom: '12px',
        borderBottom: '2px solid #4f6bed',
        cursor: 'pointer',
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
    },
    capturas: {
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
    },
    captura: {
        flex: '1 1 140px',
        aspectRatio: '12 / 7',
        borderRadius: '14px',
        border: '1px solid #26233d',
        background: 'linear-gradient(135deg, #14123a 0%, #2b1a6b 55%, #12365e 100%)',
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
    botonSeguir: {
        flex: 1,
        height: '38px',
        border: 'none',
        borderRadius: '30px',
        background: '#ffffff',
        color: '#07070f',
        fontSize: '11px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    botonPerfil: {
        flex: 1,
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
