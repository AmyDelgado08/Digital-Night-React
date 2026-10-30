import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function MyGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedGame, setSelectedGame] = useState(null);

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
    return "En revisión";
  };

  const publishedGames = games.filter(
    (game) => getGameStatus(game) === "Publicado",
  );

  const reviewGames = games.filter(
    (game) => getGameStatus(game) === "En revisión",
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

        <div style={style.stats}>
          <div style={style.statCard}>
            <div style={style.statIcon}>✦</div>
            <div>
              <h2 style={style.statNumber}>{publishedGames.length}</h2>
              <p style={style.statLabel}>Juegos publicados</p>
            </div>
          </div>

          <div style={style.statCard}>
            <div style={style.draftIcon}>✎</div>
            <div>
              <h2 style={style.statNumber}>{reviewGames.length}</h2>
              <p style={style.statLabel}>En revisión</p>
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

            {games.map((game) => (
              <div style={style.gameRow} key={game.id}>
                <Link to={`/games/${game.id}`} style={style.gameInfo}>
                  <div style={style.gameThumbnail}>
                    {game.title?.charAt(0)?.toUpperCase()}
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
                      ...(getGameStatus(game) === "En revisión"
                        ? {
                            backgroundColor: "#3a3020",
                            color: "#fbbf24",
                          }
                        : {}),
                    }}
                  >
                    ● {getGameStatus(game)}
                  </span>
                </div>

                <span style={style.date}>
                  {game.updatedAt
                    ? new Date(game.updatedAt).toLocaleDateString()
                    : "Sin fecha"}
                </span>

                <div style={style.actions}>
                  <button
                    style={style.actionButton}
                    title="Editar juego"
                    onClick={() => setSelectedGame(game)}
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
            ))}
          </div>
        )}
      </div>

      {selectedGame && (
        <div style={style.modalOverlay}>
          <div
            style={style.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <button
              type="button"
              style={style.modalClose}
              onClick={() => setSelectedGame(null)}
              aria-label="Cerrar"
            >
              ×
            </button>

            <div style={style.modalIcon}>✎</div>

            <h2 id="modal-title" style={style.modalTitle}>
              Administrar videojuego
            </h2>

            <p style={style.modalText}>
              ¿Qué querés hacer con <strong>{selectedGame.title}</strong>?
            </p>

            <div style={style.modalActions}>
              <button
                type="button"
                style={style.modalSecondary}
                onClick={() => setSelectedGame(null)}
              >
                Cancelar
              </button>

              <button
                type="button"
                style={style.modalPrimary}
                onClick={() => navigate(`/editar-juego/${selectedGame.id}`)}
              >
                ✎ Editar juego
              </button>
            </div>
          </div>
        </div>
      )}
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
    backgroundColor: "#302751",
    color: "#a78bfa",
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
      "minmax(180px, 2fr) minmax(100px, 0.8fr) minmax(100px, 1fr) minmax(100px, 0.8fr)",
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
      "minmax(180px, 2fr) minmax(100px, 0.8fr) minmax(100px, 1fr) minmax(100px, 0.8fr)",
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
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(5, 4, 18, 0.78)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    zIndex: 1000,
  },
  modal: {
    position: "relative",
    width: "100%",
    maxWidth: "420px",
    boxSizing: "border-box",
    padding: "32px 24px",
    borderRadius: "20px",
    border: "1px solid #514b70",
    backgroundColor: "#17142e",
    color: "#f5f3ff",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
  },
  modalClose: {
    position: "absolute",
    top: "10px",
    right: "14px",
    border: "none",
    background: "transparent",
    color: "#c4c0db",
    fontSize: "28px",
    cursor: "pointer",
  },
  modalIcon: {
    width: "54px",
    height: "54px",
    margin: "0 auto 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "15px",
    backgroundColor: "#302751",
    color: "#c4b5fd",
    fontSize: "28px",
  },
  modalTitle: {
    fontSize: "22px",
    margin: "0 0 12px",
  },
  modalText: {
    color: "#b7b3ce",
    fontSize: "14px",
    lineHeight: 1.6,
    marginBottom: "26px",
  },
  modalActions: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "12px",
  },
  modalSecondary: {
    padding: "11px 20px",
    border: "1px solid #77708f",
    borderRadius: "24px",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
  },
  modalPrimary: {
    padding: "11px 20px",
    border: "none",
    borderRadius: "24px",
    background: "linear-gradient(90deg, #6366f1, #a855f7)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default MyGames;
