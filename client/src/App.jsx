import { Link, Route, Routes, useNavigate } from 'react-router-dom';

//importamos las paginas
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';

function App() {
  const navigate = useNavigate();

  //Funcion para cerrar sesion
  const logout = () => {
    localStorage.removeItem('token');
    alert('Has cerrado sesión correctamente.');
    navigate('/login');
  };

  return (
    <>
      <div style={style.contprincipal}>
        {/* Barra de nav */}
        <header style={style.BaseNav}>
          <div style={style.Logo}>
            <span style={{ color: '#c084fc', marginRight: '8px' }}>✦</span>
            DIGITALNIGHT
          </div>

          <nav style={style.Nav}>
            <Link to="/" style={style.navLink}>Inicio</Link>
            <Link to="/login" style={style.navLink}>Iniciar Sesión</Link>
            <Link to="/register" style={{ ...style.navLink, ...style.navLinkPrimary }}>Registrarse</Link>

            <button style={style.logoutBtn} onClick={logout}>
              Cerrar Sesión
            </button>
          </nav>
        </header>

        {/*rutas */}
        <main style={style.rutas}>
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<Login />} path="/login" />
            <Route element={<Register />} path="/register" />
            <Route element={<Profile />} path="/profile" />
          </Routes>
        </main>
      </div>
    </>
  );
}

const style = {
  contprincipal: {
    minHeight: '100vh',
    backgroundColor: '#09090e',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    color: '#f1f5f9',
    display: 'flex',
    flexDirection: 'column',
  },
  BaseNav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 3rem',
    backgroundColor: '#13111c',
    borderBottom: '1px solid #2d2640',
  },
  Logo: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: '0.1em',
    display: 'flex',
    alignItems: 'center',
  },
  Nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  navLink: {
    textDecoration: 'none',
    color: '#a1a1aa',
    fontWeight: '500',
    fontSize: '0.9rem',
    transition: 'color 0.2s',
  },
  navLinkPrimary: {
    backgroundColor: '#7c3aed',
    color: '#ffffff',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    color: '#ef4444',
    border: '1px solid #ef4444',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontWeight: '500',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  rutas: {
    flex: 1,
    width: '100%',
    boxSizing: 'border-box',
  },
};

export default App;