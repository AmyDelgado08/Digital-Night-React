import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function MyGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyGames = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/games/mine", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setGames(response.data);
      } catch (error) {
        console.error("Error al cargar mis juegos:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("rol");
          navigate("/login");
          return;
        }

        setError("No se pudieron cargar tus juegos.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyGames();
  }, [navigate]);

  const deleteGame = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que querés eliminar este juego? Esta acción no se puede deshacer.",
    );

    if (!confirmar) return;

    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:3000/games/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setGames((previousGames) =>
        previousGames.filter((game) => game.id !== id),
      );
    } catch (error) {
      console.error("Error al eliminar el juego:", error);
      alert("No se pudo eliminar el juego.");
    }
  };

  if (loading) {
    return (
      <div style={style.container}>
        <p>Cargando tus juegos...</p>
      </div>
    );
  }

  const getGameStatus = (game) => {
    const status = String(game.status || game.estado || "")
      .trim()
      .toLowerCase()
      .replaceAll("_", " ");

    if (["published", "publicado", "approved", "aprobado"].includes(status)) {
      return "Publicado";
    }
    if (["rejected", "rechazado"].includes(status)) {
      return "Rechazado";
    }
    return "En revisión";
  };

  const publishedGames = games.filter(
    (game) => getGameStatus(game) === "Publicado",
  );

  const reviewGames = games.filter(
    (game) => getGameStatus(game) === "En revisión",
  );

  const rejectedGames = games.filter(
    (game) => getGameStatus(game) === "Rechazado",
  );

  return (
    <div style={style.container}>
      <div style={style.content}>
        <div style={style.header}>
          <div>
            <h1 style={style.title}>Mis juegos</h1>
            <p style={style.subtitle}>
              Gestioná tus juegos y administrá tus creaciones.
            </p>
          </div>

          <button
            style={style.createButton}
            onClick={() => navigate("/crear-juego")}
          >
            + Crear videojuego
          </button>
        </div>

        {/* Cantidades de cada estado arriba */}
        <div style={style.stats}>
          <div style={style.statCard}>
            <div style={style.statIcon}>✦</div>
            <div>
              <h2 style={style.statNumber}>{publishedGames.length}</h2>
              <p style={style.statLabel}>Publicados</p>
            </div>
          </div>

          <div style={style.statCard}>
            <div style={style.draftIcon}>✎</div>
            <div>
              <h2 style={style.statNumber}>{reviewGames.length}</h2>
              <p style={style.statLabel}>En revisión</p>
            </div>
          </div>

          <div style={style.statCard}>
            <div style={style.rejectedIcon}>✕</div>
            <div>
              <h2 style={style.statNumber}>{rejectedGames.length}</h2>
              <p style={style.statLabel}>Rechazados</p>
            </div>
          </div>
        </div>

        {error ? (
          <p style={style.message}>{error}</p>
        ) : games.length === 0 ? (
          <div style={style.emptyCard}>
            <h2>Todavía no tenés juegos</h2>
            <button
              style={style.createButton}
              onClick={() => navigate("/crear-juego")}
            >
              Crear mi primer juego
            </button>
          </div>
        ) : (
          <div style={style.gamesCard}>
            <div style={style.tableHeader}>
              <span>JUEGO</span>
              <span>ESTADO</span>
              <span>ACTUALIZADO</span>
              <span>ACCIONES</span>
            </div>

            {games.map((game) => {
              const estado = getGameStatus(game);
              return (
                <div style={style.gameRow} key={game.id}>
                  <Link to={`/games/${game.id}`} style={style.gameInfo}>
                    <div style={style.gameThumbnail}>
                      {game.coverImage ? (
                        <img
                          src={`http://localhost:3000${game.coverImage}`}
                          alt={game.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "9px",
                          }}
                        />
                      ) : (
                        game.title?.charAt(0)?.toUpperCase()
                      )}
                    </div>

                    <div>
                      <h3 style={style.gameTitle}>{game.title}</h3>
                      <p style={style.description}>{game.description}</p>
                    </div>
                  </Link>

                  <div>
                    <span
                      style={{
                        ...style.publishedBadge,
                        ...(estado === "En revisión"
                          ? {
                              backgroundColor: "#3a3020",
                              color: "#fbbf24",
                            }
                          : {}),
                        ...(estado === "Rechazado"
                          ? {
                              backgroundColor: "#3d1a1f",
                              color: "#f87171",
                            }
                          : {}),
                      }}
                    >
                      ● {estado}
                    </span>

                    {/* Si está rechazado, mostrar el motivo */}
                    {estado === "Rechazado" && game.rejectionReason && (
                      <div
                        style={{
                          marginTop: "6px",
                          fontSize: "11px",
                          color: "#fca5a5",
                          maxWidth: "240px",
                          lineHeight: "1.4",
                        }}
                      >
                        <strong>Motivo:</strong> {game.rejectionReason}
                      </div>
                    )}
                  </div>

                  <span style={style.date}>
                    {game.updatedAt
                      ? new Date(game.updatedAt).toLocaleDateString()
                      : "Sin fecha"}
                  </span>

                  <div style={style.actions}>
                    {/* Botón ✎ que lleva a /editar-juego/:id */}
                    <button
                      style={style.actionButton}
                      title="Editar juego"
                      onClick={() => navigate(`/editar-juego/${game.id}`)}
                    >
                      ✎
                    </button>

                    <button
                      style={style.deleteButton}
                      title="Eliminar juego"
                      onClick={() => deleteGame(game.id)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const style = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#09090e",
    color: "#f1f5f9",
    padding: "48px 6%",
    boxSizing: "border-box",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "24px",
    marginBottom: "28px",
  },
  title: {
    fontSize: "36px",
    margin: "0 0 8px",
    color: "#f5f3ff",
  },
  subtitle: {
    color: "#a1a1aa",
    fontSize: "14px",
    margin: 0,
  },
  createButton: {
    background: "linear-gradient(135deg, #6366f1, #a855f7)",
    border: "none",
    color: "white",
    borderRadius: "24px",
    padding: "13px 22px",
    fontWeight: "600",
    cursor: "pointer",
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
    marginBottom: "28px",
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "20px",
    backgroundColor: "#171624",
    border: "1px solid #2b293d",
    borderRadius: "16px",
  },
  statIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    backgroundColor: "#12372f",
    color: "#4ade80",
    fontSize: "24px",
  },
  draftIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    backgroundColor: "#3a3020",
    color: "#fbbf24",
    fontSize: "24px",
  },
  rejectedIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    backgroundColor: "#3d1a1f",
    color: "#f87171",
    fontSize: "20px",
    fontWeight: "700",
  },
  statNumber: {
    fontSize: "24px",
    margin: 0,
    color: "#f5f3ff",
  },
  statLabel: {
    fontSize: "12px",
    color: "#a1a1aa",
    margin: "3px 0 0",
  },
  gamesCard: {
    backgroundColor: "#111027",
    border: "1px solid #25223f",
    borderRadius: "18px",
    overflow: "hidden",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns:
      "minmax(180px, 2fr) minmax(140px, 1fr) minmax(100px, 1fr) minmax(100px, 0.8fr)",
    gap: "16px",
    padding: "16px 20px",
    backgroundColor: "#191632",
    color: "#8583a5",
    fontSize: "10px",
    letterSpacing: "1px",
  },
  gameRow: {
    display: "grid",
    gridTemplateColumns:
      "minmax(180px, 2fr) minmax(140px, 1fr) minmax(100px, 1fr) minmax(100px, 0.8fr)",
    alignItems: "center",
    gap: "16px",
    padding: "16px 20px",
    borderTop: "1px solid #25223f",
  },
  gameInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: 0,
    color: "inherit",
    textDecoration: "none",
  },
  gameThumbnail: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: "64px",
    height: "48px",
    borderRadius: "9px",
    background: "linear-gradient(135deg, #312e81, #7e22ce)",
    color: "#fff",
    fontSize: "22px",
    fontWeight: "700",
    overflow: "hidden",
  },
  gameTitle: {
    margin: "0 0 5px",
    fontSize: "14px",
    color: "#f5f3ff",
  },
  description: {
    margin: 0,
    fontSize: "11px",
    color: "#9290b0",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "320px",
  },
  publishedBadge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "20px",
    backgroundColor: "#12372f",
    color: "#4ade80",
    fontSize: "10px",
    whiteSpace: "nowrap",
  },
  date: {
    color: "#c4c2d8",
    fontSize: "12px",
  },
  actions: {
    display: "flex",
    gap: "8px",
  },
  actionButton: {
    width: "34px",
    height: "34px",
    border: "none",
    borderRadius: "50%",
    backgroundColor: "#292640",
    color: "#ddd6fe",
    fontSize: "18px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    width: "34px",
    height: "34px",
    border: "none",
    borderRadius: "50%",
    backgroundColor: "#292640",
    color: "#fca5a5",
    fontSize: "20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCard: {
    textAlign: "center",
    padding: "48px 24px",
    backgroundColor: "#171624",
    border: "1px solid #2b293d",
    borderRadius: "16px",
    color: "#f5f3ff",
  },
  message: {
    textAlign: "center",
    color: "#fca5a5",
    padding: "20px",
  },
};

export default MyGames;
