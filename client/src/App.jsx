import {
  Link,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";

import logo from "./img/logo.png";

// Importamos las páginas
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import EditProfile from "./components/EditProfile";
import PublicProfile from "./components/PublicProfile";
import Games from "./components/Games";
import AdminDashboard from "./components/AdminDashboard";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import GameDetail from "./components/GameDetail";
import Seguridad from "./components/Security";
import Privacidad from "./components/Privacy";
import MyGames from "./components/MyGames";
import CreateGame from "./components/CreateGame";
import Library from "./components/Library";
import Audit from "./components/Audit";
import Profile from "./components/Profile";
import NotFound from "./components/NotFound";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Leemos los datos guardados en el navegador.
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");

    alert("Has cerrado sesión correctamente.");

    navigate("/login");
  };

  return (
    <>
      <div style={style.contprincipal}>
        {/* Barra de navegación */}
        <header style={style.BaseNav}>
          <div style={style.Logo}>
            <img
              src={logo}
              alt=""
              style={{ height: "36px", marginRight: "10px" }}
            />
            DIGITALNIGHT
          </div>

          <nav style={style.Nav}>
            <Link
              to="/"
              style={{
                ...style.navLink,
                ...(location.pathname === "/" ? style.navLinkActivo : {}),
              }}
            >
              Inicio
            </Link>

            {/* Si hay token mostramos este menu */}
            {token ? (
              <>
                <Link
                  to="/biblioteca"
                  style={{
                    ...style.navLink,
                    ...(location.pathname === "/biblioteca"
                      ? style.navLinkActivo
                      : {}),
                  }}
                >
                  Biblioteca
                </Link>

                <Link
                  to="/mis-juegos"
                  style={{
                    ...style.navLink,
                    ...(location.pathname === "/mis-juegos"
                      ? style.navLinkActivo
                      : {}),
                  }}
                >
                  Mis juegos
                </Link>

                <Link
                  to="/perfil"
                  style={{
                    ...style.navLink,
                    ...(location.pathname === "/perfil"
                      ? style.navLinkActivo
                      : {}),
                  }}
                >
                  Perfil
                </Link>

                {/* El panel solo aparece para administradores */}
                {rol === "admin" && (
                  <Link
                    to="/admin"
                    style={{
                      ...style.navLink,
                      ...(location.pathname === "/admin"
                        ? style.navLinkActivo
                        : {}),
                    }}
                  >
                    Panel de administración
                  </Link>
                )}

                <button style={style.logoutBtn} onClick={logout}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    ...style.navLink,
                    ...(location.pathname === "/login"
                      ? style.navLinkActivo
                      : {}),
                  }}
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  style={{ ...style.navLink, ...style.navLinkPrimary }}
                >
                  Registrarse
                </Link>
              </>
            )}
          </nav>
        </header>

        {/* Rutas */}
        <main style={style.rutas}>
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<Login />} path="/login" />
            <Route element={<Register />} path="/register" />
            <Route element={<EditProfile />} path="/editar-perfil" />
            <Route element={<Profile />} path="/perfil" />
            <Route element={<Profile />} path="/perfil/:id"  />
            <Route element={<PublicProfile />} path="/perfil-publico" />
            <Route element={<Games />} path="/games" />
            <Route element={<MyGames />} path="/mis-juegos" />
            <Route element={<Library />} path="/biblioteca" />
            <Route element={<CreateGame />} path="/crear-juego" />
            <Route element={<CreateGame />} path="/editar-juego/:id" />
            <Route element={<AdminDashboard />} path="/admin" />
            <Route element={<Audit />} path="/auditoria" />
            <Route element={<ForgotPassword />} path="/olvide-password" />
            <Route element={<ResetPassword />} path="/restablecer/:token" />
            <Route element={<Seguridad />} path="/seguridad" />
            <Route element={<Privacidad />} path="/privacidad" />
            <Route element={<GameDetail />} path="/games/:id" />
            <Route element={<NotFound />} path="*" />
          </Routes>
        </main>
      </div>
    </>
  );
}

const style = {
  contprincipal: {
    minHeight: "100vh",
    backgroundColor: "#09090e",
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    color: "#f1f5f9",
    display: "flex",
    flexDirection: "column",
  },
  BaseNav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 48px",
    backgroundColor: "#13111c",
    borderBottom: "1px solid #2d2640",
  },
  Logo: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: "1.5px",
    display: "flex",
    alignItems: "center",
  },
  Nav: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },
  navLink: {
    textDecoration: "none",
    color: "#a1a1aa",
    fontWeight: "500",
    fontSize: "14px",
    transition: "color 0.2s",
  },
  navLinkPrimary: {
    backgroundColor: "#7c3aed",
    color: "#ffffff",
    padding: "8px 16px",
    borderRadius: "20px",
  },
  logoutBtn: {
    backgroundColor: "transparent",
    color: "#ef4444",
    border: "1px solid #ef4444",
    padding: "8px 16px",
    borderRadius: "20px",
    fontWeight: "500",
    fontSize: "14px",
    cursor: "pointer",
  },
  rutas: {
    flex: 1,
    width: "100%",
    boxSizing: "border-box",
  },
  navLinkActivo: {
    color: "#ffffff",
    fontWeight: "700",
  },
};

export default App;
