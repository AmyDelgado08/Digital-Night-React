import { Link, Route, Routes, useNavigate } from 'react-router-dom';

import logo from './img/logo.png';

// Importamos las páginas
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import EditProfile from './components/EditProfile';
import PublicProfile from './components/PublicProfile';
import Games from './components/Games';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const navigate = useNavigate();

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    alert('Has cerrado sesión correctamente.');
    navigate('/login');
  };

  return (
    <>
      <div style={style.contprincipal}>
        {/* Barra de navegación */}
        <header style={style.BaseNav}>
          <div style={style.Logo}>
            <img src={logo} alt="" style={{ height: '36px', marginRight: '10px' }} />
            DIGITALNIGHT
          </div>

          <nav style={style.Nav}>
            <Link to="/" style={style.navLink}>Inicio</Link>
            <Link to="/editar-perfil" style={style.navLink}>Editar Perfil</Link>
            <Link to="/login" style={style.navLink}>Iniciar Sesión</Link>
            <Link to="/register" style={{ ...style.navLink, ...style.navLinkPrimary }}>Registrarse</Link>

            <button style={style.logoutBtn} onClick={logout}>
              Cerrar Sesión
            </button>
          </nav>
        </header>

        {/* Rutas */}
        <main style={style.rutas}>
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<Login />} path="/login" />
            <Route element={<Register />} path="/register" />
            <Route element={<EditProfile />} path="/editar-perfil" />
            <Route element={<PublicProfile />} path="/perfil-publico" />
            <Route element={<Games />} path="/games" />
            <Route element={<AdminDashboard />} path="/admin" />
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
    padding: '16px 48px',
    backgroundColor: '#13111c',
    borderBottom: '1px solid #2d2640',
  },
  Logo: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: '1.5px',
    display: 'flex',
    alignItems: 'center',
  },
  Nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  navLink: {
    textDecoration: 'none',
    color: '#a1a1aa',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'color 0.2s',
  },
  navLinkPrimary: {
    backgroundColor: '#7c3aed',
    color: '#ffffff',
    padding: '8px 16px',
    borderRadius: '20px',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    color: '#ef4444',
    border: '1px solid #ef4444',
    padding: '8px 16px',
    borderRadius: '20px',
    fontWeight: '500',
    fontSize: '14px',
    cursor: 'pointer',
  },
  rutas: {
    flex: 1,
    width: '100%',
    boxSizing: 'border-box',
  },
};

export default App;