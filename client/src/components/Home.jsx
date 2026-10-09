import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    return (
        <>
        <div style={style.cont}>
            <div style={style.seccionTexto}>
                <h1 style={style.title}>
                    Tu espacio para
                </h1>
                <h1 style={style.highlight}>
                    Crear y jugar
                </h1>
                <p style={style.subtitle}>
                    Una plataforma educativa pensada para estudiantes y la comunidad de la escuela.
                </p>
                <div style={style.grupoBtn}>
                    <button style={style.btnPrimary} onClick={() => navigate('/login')}>
                        Explorar juegos →
                    </button>
                    <button style={style.btnSecondary}>
                        Conocé más
                    </button>
                </div>
            </div>
        </div>
        </>
    )
}

const style = {
    cont: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start', // Alineado a la izquierda como en la imagen
        textAlign: 'left',
        padding: '64px 80px',
        minHeight: '70vh',
    },
    seccionTexto: {
        maxWidth: '650px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: '72px',
        fontWeight: '700',
        lineHeight: '1.1',
        margin: '0 0 8px 0',
        color: '#ffffff',
    },
    highlight: { 
        fontSize: '72px',
        fontWeight: '700',
        lineHeight: '1.1',
        margin: '0 0 24px 0',
        color: '#a78bfa', // Color violeta exacto del diseño
    },
    subtitle: {
        fontSize: '18px',
        color: '#9ca3af',
        marginBottom: '40px',
        lineHeight: '1.5',
        maxWidth: '480px',
    },
    grupoBtn: {
        display: 'flex',
        gap: '16px',
        justifyContent: 'flex-start',
    },
    btnPrimary: {
        backgroundColor: '#7c3aed', 
        color: 'white',
        border: 'none',
        padding: '13px 28px',
        borderRadius: '25px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    btnSecondary: {
        backgroundColor: 'transparent',
        color: 'white',
        border: '1px solid #4b5563',
        padding: '13px 28px',
        borderRadius: '25px',
        fontWeight: '600',
        cursor: 'pointer',
    },
};

export default Home;