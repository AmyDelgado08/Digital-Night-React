import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:3000";

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pestana, setPestana] = useState("juegos");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const cargarPerfil = async () => {
      setLoading(true);
      setError("");
      setProfile(null);

      try {
        let userId = id;

        if (!userId) {
          if (!token) {
            navigate("/login");
            return;
          }

          const me = await axios.get(`${API}/me`, {
            headers: { Authorization: token },
          });

          userId = me.data.id;
        }

        const response = await axios.get(`${API}/profiles/${userId}`, {
          headers: token ? { Authorization: token } : {},
        });

        setProfile(response.data);
      } catch (error) {
        console.error("Error al cargar perfil:", error);
        setError("No se pudo cargar el perfil.");
      } finally {
        setLoading(false);
      }
    };

    cargarPerfil();
  }, [id, token, navigate]);

  const portada = (game) => {
    if (!game.coverImage) return null;

    if (game.coverImage.startsWith("http")) {
      return game.coverImage;
    }

    return `${API}/${game.coverImage.replace(/^\/+/, "")}`;
  };

  if (loading) {
    return (
      <div style={style.pagina}>
        <p style={style.mensaje}>Cargando perfil...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div style={style.pagina}>
        <p style={style.mensaje}>{error || "Perfil no encontrado"}</p>
      </div>
    );
  }

  const user = profile.user || profile;

  const nombre = `${user.firstName || ""} ${user.lastName || ""}`.trim();

  const iniciales =
    (
      (user.firstName || "").charAt(0) + (user.lastName || "").charAt(0)
    ).toUpperCase() || "?";

  const esMiPerfil =
    !id ||
    (token && String(user.id) === String(localStorage.getItem("userId")));

  const privado =
    profile.isPrivate === true || (user.isPublic === false && !esMiPerfil);

  if (privado) {
    return (
      <div style={style.pagina}>
        <div style={style.contenedor}>
          <div style={style.cabecera}>
            <div style={style.avatar}>{iniciales}</div>

            <div>
              <h1 style={style.nombre}>{nombre}</h1>
              <p style={style.bio}>Este perfil es privado.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const juegos = profile.games || [];
  const favoritos = profile.favorites || [];
  const recientes = profile.recentlyPlayed || [];

  const juegosPublicados =
    profile.publishedGamesCount ?? profile.gamesCount ?? juegos.length;

  const esCreador = profile.isCreator ?? juegosPublicados > 0;

  const juegosMostrar =
    pestana === "juegos"
      ? juegos
      : pestana === "favoritos"
        ? favoritos
        : recientes;

  const valoraciones = juegos
    .map((game) => Number(game.averageRating ?? game.rating))
    .filter((value) => Number.isFinite(value) && value > 0);

  const promedio = valoraciones.length
    ? (valoraciones.reduce((a, b) => a + b, 0) / valoraciones.length)
        .toFixed(1)
        .replace(".", ",")
    : "—";

  return (
    <div style={style.pagina}>
      <div style={style.contenedor}>
        {/* CABECERA DEL PERFIL */}
        <div style={style.cabecera}>
          <div style={style.avatar}>{iniciales}</div>

          <div style={style.infoUsuario}>
            <div style={style.filaNombre}>
              <h1 style={style.nombre}>{nombre}</h1>

              {esCreador && (
                <span style={style.creador} title="Creador de juegos">
                  ✓ Creador
                </span>
              )}
            </div>

            <p style={style.bio}>
              {user.bio || "Este usuario todavía no agregó una biografía."}
            </p>

            {user.email && <p style={style.dato}>✉ {user.email}</p>}

            {user.birthdate && (
              <p style={style.dato}>Fecha de nacimiento: {user.birthdate}</p>
            )}

            {esMiPerfil && (
              <button
                style={style.botonEditar}
                onClick={() => navigate("/perfil-publico")}
              >
                Editar perfil
              </button>
            )}
          </div>
        </div>

        {/* ESTADÍSTICAS */}
        <div style={style.estadisticas}>
          <div style={style.estadistica}>
            <div style={style.iconoEstadistica}>▦</div>

            <div>
              <strong style={style.numero}>{juegosPublicados}</strong>
              <p style={style.descripcionEstadistica}>Juegos publicados</p>
            </div>
          </div>

          <div style={style.estadistica}>
            <div
              style={{
                ...style.iconoEstadistica,
                backgroundColor: "#3b2d1c",
                color: "#facc15",
              }}
            >
              ★
            </div>

            <div>
              <strong style={style.numero}>{promedio}</strong>
              <p style={style.descripcionEstadistica}>Valoración media</p>
            </div>
          </div>
        </div>

        {/* PESTAÑAS */}
        <div style={style.pestanas}>
          <button
            onClick={() => setPestana("juegos")}
            style={{
              ...style.pestana,
              ...(pestana === "juegos" ? style.pestanaActiva : {}),
            }}
          >
            Juegos ({juegos.length})
          </button>

          <button
            onClick={() => setPestana("favoritos")}
            style={{
              ...style.pestana,
              ...(pestana === "favoritos" ? style.pestanaActiva : {}),
            }}
          >
            Favoritos
          </button>

          <button
            onClick={() => setPestana("recientes")}
            style={{
              ...style.pestana,
              ...(pestana === "recientes" ? style.pestanaActiva : {}),
            }}
          >
            Últimos jugados
          </button>
        </div>

        {/* TARJETAS DE JUEGOS */}
        {juegosMostrar.length === 0 ? (
          <p style={style.mensajeVacio}>No hay juegos para mostrar todavía.</p>
        ) : (
          <div style={style.grilla}>
            {juegosMostrar.map((game) => {
              const imagen = portada(game);

              const autor = game.author
                ? `${game.author.firstName || ""} ${game.author.lastName || ""}`.trim()
                : nombre;

              const rating = game.averageRating ?? game.rating;

              return (
                <Link
                  key={game.id}
                  to={`/games/${game.id}`}
                  style={style.tarjeta}
                >
                  {/* PORTADA */}
                  <div
                    style={{
                      ...style.portada,
                      backgroundImage: imagen
                        ? `url("${imagen}")`
                        : "linear-gradient(135deg, #312e81, #7c3aed, #11112b)",
                    }}
                  >
                    {game.subject && (
                      <span style={style.categoria}>{game.subject}</span>
                    )}

                    {!imagen && (
                      <span style={style.tituloSinPortada}>{game.title}</span>
                    )}

                    <span style={style.rating}>
                      <span style={{ color: "#facc15" }}>★</span>{" "}
                      {rating != null ? Number(rating).toFixed(1) : "—"}
                    </span>
                  </div>

                  {/* INFORMACIÓN DEL JUEGO */}
                  <div style={style.infoJuego}>
                    <h3 style={style.tituloJuego}>{game.title}</h3>

                    <p style={style.autor}>
                      <span style={style.avatarMini}>
                        {autor.charAt(0).toUpperCase()}
                      </span>

                      {autor}
                    </p>

                    <div style={style.detallesJuego}>
                      <span>♧ {game.plays || 0} jugadas</span>

                      <span>{game.grade || "Todos"}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const style = {
  pagina: {
    minHeight: "100vh",
    background: `radial-gradient(ellipse at 50% 0%, rgba(91, 47, 170, 0.23), transparent 45%),#0b091b`,
    color: "#ffffff",
    padding: "45px 32px 80px",
    boxSizing: "border-box",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  contenedor: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  cabecera: {
    display: "flex",
    alignItems: "center",
    gap: "28px",
    flexWrap: "wrap",
    marginBottom: "38px",
  },
  avatar: {
    width: "125px",
    height: "125px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #7664df, #a78bfa)",
    border: "5px solid #0b091b",
    boxShadow: "0 0 28px rgba(139, 92, 246, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "42px",
    fontWeight: "700",
    flexShrink: 0,
  },
  infoUsuario: {
    flex: 1,
    minWidth: "250px",
  },
  filaNombre: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
  },
  nombre: {
    fontSize: "32px",
    fontWeight: "750",
    margin: "0 0 8px",
  },
  creador: {
    backgroundColor: "rgba(139, 92, 246, 0.18)",
    color: "#c4b5fd",
    border: "1px solid #8b5cf6",
    borderRadius: "20px",
    padding: "6px 12px",
    fontSize: "12px",
    fontWeight: "700",
  },
  bio: {
    color: "#b7b2d0",
    fontSize: "14px",
    lineHeight: "1.7",
    maxWidth: "620px",
    margin: "4px 0 10px",
  },
  dato: {
    color: "#9b95ba",
    fontSize: "12px",
    margin: "5px 0",
  },
  botonEditar: {
    marginTop: "12px",
    backgroundColor: "#7c3aed",
    color: "#ffffff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  estadisticas: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
    marginBottom: "42px",
  },
  estadistica: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    borderRadius: "16px",
    backgroundColor: "rgba(255, 255, 255, 0.045)",
    border: "1px solid #514b68",
  },
  iconoEstadistica: {
    width: "44px",
    height: "44px",
    backgroundColor: "#292448",
    color: "#a78bfa",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
  },
  numero: {
    fontSize: "24px",
    color: "#ffffff",
  },
  descripcionEstadistica: {
    color: "#a5a0bd",
    fontSize: "12px",
    margin: "3px 0 0",
  },
  pestanas: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
    borderBottom: "1px solid #242039",
    marginBottom: "28px",
    flexWrap: "wrap",
  },
  pestana: {
    background: "transparent",
    border: "none",
    color: "#9690b3",
    fontSize: "13px",
    fontWeight: "500",
    padding: "12px 0",
    cursor: "pointer",
  },
  pestanaActiva: {
    color: "#ffffff",
    borderBottom: "2px solid #a78bfa",
    fontWeight: "700",
  },
  grilla: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "18px",
  },
  tarjeta: {
    backgroundColor: "#14112c",
    border: "1px solid #4b4566",
    borderRadius: "16px",
    overflow: "hidden",
    textDecoration: "none",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s",
  },
  portada: {
    height: "170px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  categoria: {
    position: "absolute",
    top: "12px",
    left: "12px",
    backgroundColor: "rgba(8, 7, 20, 0.75)",
    border: "1px solid rgba(255,255,255,0.5)",
    color: "#ffffff",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "10px",
  },
  tituloSinPortada: {
    fontSize: "22px",
    fontWeight: "800",
    textAlign: "center",
    padding: "15px",
  },
  rating: {
    position: "absolute",
    bottom: "10px",
    left: "10px",
    backgroundColor: "rgba(8, 7, 20, 0.8)",
    borderRadius: "12px",
    padding: "5px 9px",
    fontSize: "11px",
  },
  infoJuego: {
    padding: "15px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  tituloJuego: {
    fontSize: "16px",
    fontWeight: "700",
    margin: "0 0 12px",
  },
  autor: {
    color: "#a6a0c0",
    fontSize: "11px",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    margin: "0 0 15px",
  },
  avatarMini: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    backgroundColor: "#7c5cf0",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    fontWeight: "700",
  },
  detallesJuego: {
    display: "flex",
    justifyContent: "space-between",
    color: "#9892b8",
    fontSize: "11px",
    marginTop: "auto",
  },
  mensaje: {
    color: "#ffffff",
    textAlign: "center",
    padding: "80px 0",
  },
  mensajeVacio: {
    color: "#aaa4c4",
    textAlign: "center",
    padding: "50px 0",
  },
};

export default Profile;
