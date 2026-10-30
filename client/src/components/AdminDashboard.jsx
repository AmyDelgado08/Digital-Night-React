import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:3000";

function AdminDashboard() {
  const navigate = useNavigate();

  // Pestañas del panel: 'usuarios', 'revision', 'juegos'
  const [activeTab, setActiveTab] = useState("usuarios");

  // Estado para gestión de usuarios
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    rol: "",
  });

  const emptyNewUser = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    rol: "user",
  };
  const [showCreate, setShowCreate] = useState(false);
  const [newUser, setNewUser] = useState(emptyNewUser);
  const [createError, setCreateError] = useState("");

  // Estado para juegos (Revisión y Todos los juegos)
  const [pendingGames, setPendingGames] = useState([]);
  const [allGames, setAllGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(false);
  const [gamesMessage, setGamesMessage] = useState("");

  // Cargar usuarios
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    axios
      .get(`${API}/users`, {
        headers: { authorization: token },
      })
      .then((res) => setUsers(res.data))
      .catch(() => {
        alert("No tienes permisos de administrador para ver esta sección.");
        navigate("/perfil-publico");
      });
  }, [navigate]);

  // Cargar juegos pendientes de revisión
  const fetchPendingGames = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoadingGames(true);
    setGamesMessage("");
    try {
      const res = await axios.get(`${API}/admin/games?status=pendiente`, {
        headers: { authorization: token },
      });
      setPendingGames(res.data);
    } catch (error) {
      console.error("Error al cargar juegos pendientes:", error);
      setGamesMessage("No se pudieron cargar los juegos pendientes.");
    } finally {
      setLoadingGames(false);
    }
  }, []);

  // Cargar todos los juegos
  const fetchAllGames = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoadingGames(true);
    setGamesMessage("");
    try {
      const res = await axios.get(`${API}/admin/games`, {
        headers: { authorization: token },
      });
      setAllGames(res.data);
    } catch (error) {
      console.error("Error al cargar todos los juegos:", error);
      setGamesMessage("No se pudieron cargar los juegos.");
    } finally {
      setLoadingGames(false);
    }
  }, []);

  // Carga reactiva según la pestaña activa
  useEffect(() => {
    if (activeTab === "revision") {
      fetchPendingGames();
    } else if (activeTab === "juegos") {
      fetchAllGames();
    }
  }, [activeTab, fetchPendingGames, fetchAllGames]);

  // --- Acciones de Usuarios ---
  const deleteUserByAdmin = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API}/users/${id}`, {
        headers: { authorization: token },
      });
      setUsers(users.filter((u) => u.id !== id));
    } catch (error) {
      alert("Error al eliminar el usuario.");
    }
  };

  const startEditing = (user) => {
    setEditingId(user.id);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      rol: user.rol,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ firstName: "", lastName: "", email: "", rol: "" });
  };

  const saveUserChanges = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(`${API}/users/${id}`, editForm, {
        headers: { authorization: token },
      });
      setUsers(users.map((u) => (u.id === id ? res.data.user : u)));
      alert("Usuario actualizado correctamente.");
      cancelEditing();
    } catch (error) {
      alert(error.response?.data?.message || "Error al actualizar el usuario.");
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    setCreateError("");
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(`${API}/admin/users`, newUser, {
        headers: { authorization: token },
      });
      setUsers([...users, res.data.user]);
      setNewUser(emptyNewUser);
      setShowCreate(false);
    } catch (error) {
      setCreateError(
        error.response?.data?.message || "Error al crear el usuario.",
      );
    }
  };

  // --- Acciones de Revisión de Juegos ---
  const handleApproveGame = async (gameId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${API}/admin/games/${gameId}/review`,
        { status: "publicado" },
        { headers: { authorization: token } },
      );
      alert("Juego aprobado y publicado con éxito.");
      setPendingGames((prev) => prev.filter((g) => g.id !== gameId));
    } catch (error) {
      alert(error.response?.data?.message || "Error al aprobar el juego.");
    }
  };

  const handleRejectGame = async (gameId) => {
    const reason = window.prompt(
      "Ingresá el motivo obligatorio de rechazo para el autor:",
    );
    if (reason === null) return; // Cancelado
    if (!reason.trim()) {
      alert("El motivo de rechazo es obligatorio.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${API}/admin/games/${gameId}/review`,
        { status: "rechazado", reason: reason.trim() },
        { headers: { authorization: token } },
      );
      alert("Juego rechazado con éxito.");
      setPendingGames((prev) => prev.filter((g) => g.id !== gameId));
    } catch (error) {
      alert(error.response?.data?.message || "Error al rechazar el juego.");
    }
  };

  // --- Eliminar juego (Pestaña "Todos los juegos") ---
  const handleDeleteGame = async (gameId, title) => {
    if (
      !window.confirm(
        `¿Seguro que deseas eliminar el juego "${title}"? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API}/games/${gameId}`, {
        headers: { authorization: token },
      });
      alert("Juego eliminado con éxito.");
      setAllGames((prev) => prev.filter((g) => g.id !== gameId));
      setPendingGames((prev) => prev.filter((g) => g.id !== gameId));
    } catch (error) {
      alert(error.response?.data?.message || "Error al eliminar el juego.");
    }
  };

  const inputStyle = {
    padding: "8px",
    background: "#1f2937",
    color: "white",
    border: "1px solid #4b5563",
    borderRadius: "4px",
  };

  const tabButtonStyle = (tabName) => ({
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s",
    backgroundColor: activeTab === tabName ? "#7c5cf0" : "#1f2937",
    color: activeTab === tabName ? "#ffffff" : "#9ca3af",
  });

  return (
    <div style={{ padding: "40px", color: "white", maxWidth: "1280px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", margin: 0, fontWeight: "700" }}>
          Panel de Administración
        </h1>

        <button
          onClick={() => navigate("/auditoria")}
          style={{
            color: "white",
            backgroundColor: "transparent",
            border: "1px solid #7c5cf0",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Ver auditoría
        </button>
      </div>

      {/* Selector de Pestañas */}
      <div style={{ display: "flex", gap: "10px", borderBottom: "1px solid #374151", paddingBottom: "16px", marginBottom: "28px" }}>
        <button
          style={tabButtonStyle("usuarios")}
          onClick={() => setActiveTab("usuarios")}
        >
          Gestión de usuarios
        </button>
        <button
          style={tabButtonStyle("revision")}
          onClick={() => setActiveTab("revision")}
        >
          Revisión de juegos
          {pendingGames.length > 0 && activeTab !== "revision" && (
            <span style={{ marginLeft: "8px", backgroundColor: "#fbbf24", color: "#000", padding: "2px 6px", borderRadius: "10px", fontSize: "11px" }}>
              {pendingGames.length}
            </span>
          )}
        </button>
        <button
          style={tabButtonStyle("juegos")}
          onClick={() => setActiveTab("juegos")}
        >
          Todos los juegos
        </button>
      </div>

      {/* CONTENIDO PESTAÑA 1: GESTIÓN DE USUARIOS */}
      {activeTab === "usuarios" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "20px", margin: 0 }}>Usuarios registrados ({users.length})</h2>
            <button
              onClick={() => {
                setShowCreate(!showCreate);
                setCreateError("");
              }}
              style={{
                color: "white",
                backgroundColor: "#7c5cf0",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              {showCreate ? "Cerrar formulario" : "+ Crear usuario"}
            </button>
          </div>

          {showCreate && (
            <form
              onSubmit={createUser}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "20px",
                padding: "16px",
                backgroundColor: "#111827",
                borderRadius: "8px",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="Nombre"
                required
                value={newUser.firstName}
                onChange={(e) =>
                  setNewUser({ ...newUser, firstName: e.target.value })
                }
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Apellido"
                value={newUser.lastName}
                onChange={(e) =>
                  setNewUser({ ...newUser, lastName: e.target.value })
                }
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="Contraseña"
                required
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                style={inputStyle}
              />
              <select
                value={newUser.rol}
                onChange={(e) => setNewUser({ ...newUser, rol: e.target.value })}
                style={inputStyle}
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
              <button
                type="submit"
                style={{
                  color: "#22c55e",
                  backgroundColor: "transparent",
                  border: "1px solid #22c55e",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Guardar
              </button>
              {createError && (
                <p style={{ color: "#ef4444", width: "100%", margin: "8px 0 0" }}>
                  {createError}
                </p>
              )}
            </form>
          )}

          <table
            style={{ width: "100%", marginTop: "12px", borderCollapse: "collapse" }}
          >
            <thead>
              <tr
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #4b5563",
                  padding: "10px",
                  color: "#9ca3af",
                }}
              >
                <th style={{ padding: "10px" }}>ID</th>
                <th>Nombre y Apellido</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isEditing = editingId === u.id;
                return (
                  <tr key={u.id} style={{ borderBottom: "1px solid #374151" }}>
                    <td style={{ padding: "12px 10px" }}>{u.id}</td>

                    <td>
                      {isEditing ? (
                        <div style={{ display: "flex", gap: "5px" }}>
                          <input
                            type="text"
                            value={editForm.firstName}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                firstName: e.target.value,
                              })
                            }
                            style={{
                              padding: "4px",
                              background: "#1f2937",
                              color: "white",
                              border: "1px solid #4b5563",
                              borderRadius: "4px",
                            }}
                          />
                          <input
                            type="text"
                            value={editForm.lastName}
                            onChange={(e) =>
                              setEditForm({ ...editForm, lastName: e.target.value })
                            }
                            style={{
                              padding: "4px",
                              background: "#1f2937",
                              color: "white",
                              border: "1px solid #4b5563",
                              borderRadius: "4px",
                            }}
                          />
                        </div>
                      ) : (
                        <span
                          onClick={() => navigate(`/perfil/${u.id}`)}
                          style={{
                            cursor: "pointer",
                            color: "#c4b5fd",
                            textDecoration: "underline",
                          }}
                        >
                          {u.firstName} {u.lastName}
                        </span>
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                          style={{
                            padding: "4px",
                            background: "#1f2937",
                            color: "white",
                            border: "1px solid #4b5563",
                            borderRadius: "4px",
                          }}
                        />
                      ) : (
                        u.email
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <select
                          value={editForm.rol}
                          onChange={(e) =>
                            setEditForm({ ...editForm, rol: e.target.value })
                          }
                          style={{
                            padding: "4px",
                            background: "#1f2937",
                            color: "white",
                            border: "1px solid #4b5563",
                            borderRadius: "4px",
                          }}
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      ) : (
                        u.rol
                      )}
                    </td>

                    <td>
                      {isEditing ? (
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            onClick={() => saveUserChanges(u.id)}
                            style={{
                              color: "#22c55e",
                              backgroundColor: "transparent",
                              border: "1px solid #22c55e",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            Guardar
                          </button>
                          <button
                            onClick={cancelEditing}
                            style={{
                              color: "#a1a1aa",
                              backgroundColor: "transparent",
                              border: "1px solid #a1a1aa",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            onClick={() => startEditing(u)}
                            style={{
                              color: "#3b82f6",
                              backgroundColor: "transparent",
                              border: "1px solid #3b82f6",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => deleteUserByAdmin(u.id)}
                            style={{
                              color: "#ef4444",
                              backgroundColor: "transparent",
                              border: "1px solid #ef4444",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* CONTENIDO PESTAÑA 2: REVISIÓN DE JUEGOS */}
      {activeTab === "revision" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h2 style={{ fontSize: "20px", margin: "0 0 6px" }}>
                Juegos pendientes de revisión ({pendingGames.length})
              </h2>
              <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>
                Aprobá los videojuegos para que aparezcan en el catálogo público o recházalos indicando el motivo.
              </p>
            </div>
          </div>

          {loadingGames ? (
            <p style={{ color: "#9ca3af", padding: "20px 0" }}>Cargando juegos pendientes...</p>
          ) : gamesMessage ? (
            <p style={{ color: "#f87171" }}>{gamesMessage}</p>
          ) : pendingGames.length === 0 ? (
            <div style={{ padding: "40px", backgroundColor: "#111827", borderRadius: "12px", textAlign: "center", color: "#9ca3af" }}>
              <p style={{ fontSize: "16px", margin: 0 }}>🎉 No hay videojuegos pendientes de revisión en este momento.</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "12px" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid #4b5563", color: "#9ca3af" }}>
                  <th style={{ padding: "10px" }}>Portada</th>
                  <th>Título</th>
                  <th>Autor</th>
                  <th>Materia / Curso</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pendingGames.map((game) => {
                  const autorNombre = game.author
                    ? `${game.author.firstName} ${game.author.lastName || ""}`.trim()
                    : `Usuario #${game.authorId}`;

                  return (
                    <tr key={game.id} style={{ borderBottom: "1px solid #374151" }}>
                      <td style={{ padding: "12px 10px", width: "80px" }}>
                        {game.coverImage ? (
                          <img
                            src={`${API}${game.coverImage}`}
                            alt={game.title}
                            style={{
                              width: "60px",
                              height: "45px",
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "60px",
                              height: "45px",
                              background: "#374151",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "6px",
                              fontSize: "12px",
                              color: "#9ca3af",
                            }}
                          >
                            Sin foto
                          </div>
                        )}
                      </td>

                      <td style={{ fontWeight: "600" }}>{game.title}</td>

                      <td style={{ color: "#d1d5db" }}>{autorNombre}</td>

                      <td style={{ color: "#9ca3af", fontSize: "13px" }}>
                        {game.subject || "-"} {game.grade ? `(${game.grade})` : ""}
                      </td>

                      <td>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <button
                            onClick={() => window.open(`/games/${game.id}`, "_blank")}
                            style={{
                              backgroundColor: "#374151",
                              color: "#e5e7eb",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "13px",
                            }}
                          >
                            Ver juego
                          </button>

                          <button
                            onClick={() => handleApproveGame(game.id)}
                            style={{
                              backgroundColor: "#16a34a",
                              color: "white",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "13px",
                              fontWeight: "600",
                            }}
                          >
                            Aprobar
                          </button>

                          <button
                            onClick={() => handleRejectGame(game.id)}
                            style={{
                              backgroundColor: "#dc2626",
                              color: "white",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "13px",
                              fontWeight: "600",
                            }}
                          >
                            Rechazar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* CONTENIDO PESTAÑA 3: TODOS LOS JUEGOS */}
      {activeTab === "juegos" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h2 style={{ fontSize: "20px", margin: "0 0 6px" }}>
                Todos los juegos del sistema ({allGames.length})
              </h2>
              <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>
                Catálogo global con opciones de supervisión y eliminación definitiva.
              </p>
            </div>
          </div>

          {loadingGames ? (
            <p style={{ color: "#9ca3af", padding: "20px 0" }}>Cargando catálogo completo...</p>
          ) : gamesMessage ? (
            <p style={{ color: "#f87171" }}>{gamesMessage}</p>
          ) : allGames.length === 0 ? (
            <div style={{ padding: "40px", backgroundColor: "#111827", borderRadius: "12px", textAlign: "center", color: "#9ca3af" }}>
              <p style={{ fontSize: "16px", margin: 0 }}>No se encontraron juegos en la base de datos.</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "12px" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid #4b5563", color: "#9ca3af" }}>
                  <th style={{ padding: "10px" }}>Portada</th>
                  <th>Título</th>
                  <th>Autor</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {allGames.map((game) => {
                  const autorNombre = game.author
                    ? `${game.author.firstName} ${game.author.lastName || ""}`.trim()
                    : `Usuario #${game.authorId}`;

                  const statusColor =
                    game.status === "publicado"
                      ? { bg: "#14532d", text: "#4ade80", label: "Publicado" }
                      : game.status === "rechazado"
                      ? { bg: "#450a0a", text: "#f87171", label: "Rechazado" }
                      : { bg: "#3a3020", text: "#fbbf24", label: "En revisión" };

                  return (
                    <tr key={game.id} style={{ borderBottom: "1px solid #374151" }}>
                      <td style={{ padding: "12px 10px", width: "80px" }}>
                        {game.coverImage ? (
                          <img
                            src={`${API}${game.coverImage}`}
                            alt={game.title}
                            style={{
                              width: "60px",
                              height: "45px",
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "60px",
                              height: "45px",
                              background: "#374151",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "6px",
                              fontSize: "12px",
                              color: "#9ca3af",
                            }}
                          >
                            Sin foto
                          </div>
                        )}
                      </td>

                      <td style={{ fontWeight: "600" }}>{game.title}</td>

                      <td style={{ color: "#d1d5db" }}>{autorNombre}</td>

                      <td>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "11px",
                            fontWeight: "600",
                            backgroundColor: statusColor.bg,
                            color: statusColor.text,
                          }}
                        >
                          ● {statusColor.label}
                        </span>
                        {game.status === "rechazado" && game.rejectionReason && (
                          <div style={{ color: "#fca5a5", fontSize: "11px", marginTop: "4px" }}>
                            Motivo: {game.rejectionReason}
                          </div>
                        )}
                      </td>

                      <td>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => window.open(`/games/${game.id}`, "_blank")}
                            style={{
                              backgroundColor: "#374151",
                              color: "#e5e7eb",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "13px",
                            }}
                          >
                            Ver juego
                          </button>

                          <button
                            onClick={() => handleDeleteGame(game.id, game.title)}
                            style={{
                              backgroundColor: "transparent",
                              color: "#ef4444",
                              border: "1px solid #ef4444",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "13px",
                            }}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
