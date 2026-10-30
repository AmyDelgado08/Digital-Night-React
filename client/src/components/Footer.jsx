import { Link } from 'react-router-dom';
import logo from '../img/logo.png';

function Footer() {
    return (
        <footer id="footer" style={styles.footer}>
            <div style={styles.container}>
                {/* Columna 1: Logo y Acerca de */}
                <div style={styles.columnaAcerca}>
                    <div style={styles.logoContenedor}>
                        <img src={logo} alt="DigitalNight Logo" style={styles.logoImg} />
                        <span style={styles.logoTexto}>
                            DIGITAL<span style={styles.logoHighlight}>NIGHT</span>
                        </span>
                    </div>
                    <p style={styles.acercaTexto}>
                        Plataforma educativa comunitaria diseñada para explorar, jugar, 
                        publicar y valorar videojuegos creados por estudiantes y docentes 
                        de la comunidad escolar.
                    </p>
                </div>

                {/* Columna 2: Enlaces rápidos */}
                <div style={styles.columna}>
                    <h4 style={styles.tituloColumna}>Navegación</h4>
                    <ul style={styles.listaLinks}>
                        <li><Link to="/" style={styles.link}>Inicio</Link></li>
                        <li><Link to="/games" style={styles.link}>Catálogo de Juegos</Link></li>
                        <li><Link to="/biblioteca" style={styles.link}>Biblioteca</Link></li>
                        <li><Link to="/perfil" style={styles.link}>Mi Perfil</Link></li>
                    </ul>
                </div>

                {/* Columna 3: Información y Equipo */}
                <div style={styles.columna}>
                    <h4 style={styles.tituloColumna}>Equipo de Desarrollo</h4>
                    <ul style={styles.listaEquipo}>
                        <li style={styles.miembro}>Adrian Vega</li>
                        <li style={styles.miembro}>Jose Luis</li>
                        <li style={styles.miembro}>Luciano Ferrari</li>
                        <li style={styles.miembro}>Amy Delgado</li>
                        <li style={styles.miembro}>Tamara Britez</li>
                        <li style={styles.miembro}>Diego Lima</li>
                    </ul>
                </div>
            </div>

            {/* Barra inferior de Copyright */}
            <div style={styles.inferior}>
                <p style={styles.copyright}>
                    © {new Date().getFullYear()} DigitalNight — Proyecto Educativo Escolar. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
}

const styles = {
    footer: {
        backgroundColor: '#0a0914',
        borderTop: '1px solid #1e1b33',
        color: '#94a3b8',
        padding: '48px 32px 24px',
        marginTop: 'auto',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '40px',
        paddingBottom: '36px',
    },
    columnaAcerca: {
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
    },
    logoContenedor: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    logoImg: {
        height: '34px',
        width: 'auto',
    },
    logoTexto: {
        fontSize: '18px',
        fontWeight: '700',
        letterSpacing: '2px',
        color: '#ffffff',
    },
    logoHighlight: {
        color: '#8b5cf6',
    },
    acercaTexto: {
        fontSize: '14px',
        lineHeight: '1.6',
        color: '#94a3b8',
        margin: 0,
    },
    columna: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    tituloColumna: {
        fontSize: '15px',
        fontWeight: '600',
        color: '#ffffff',
        margin: '0 0 4px',
        paddingTop: '7px',
        letterSpacing: '0.5px',
    },
    listaLinks: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    link: {
        color: '#94a3b8',
        textDecoration: 'none',
        fontSize: '14px',
        transition: 'color 0.2s ease',
    },
    listaEquipo: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px 16px',
    },
    miembro: {
        fontSize: '13px',
        color: '#cbd5e1',
    },
    inferior: {
        maxWidth: '1200px',
        margin: '0 auto',
        paddingTop: '20px',
        borderTop: '1px solid #19162c',
        textAlign: 'center',
    },
    copyright: {
        margin: 0,
        fontSize: '13px',
        color: '#64748b',
    },
};

export default Footer;
