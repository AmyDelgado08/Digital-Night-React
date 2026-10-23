import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateGame() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [materia, setMateria] = useState("");
  const [curso, setCurso] = useState("");

  const [portada, setPortada] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [capturas, setCapturas] = useState([null, null, null]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Crear videojuego
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!title.trim() || !description.trim()) {
      setError("Completá el título y la descripción.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:3000/games",
        {
          title: title.trim(),
          description: description.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("¡Juego creado correctamente!");
      navigate("/mis-juegos");
    } catch (err) {
      console.error("Error al crear el juego:", err);

      setError(err.response?.data?.message || "No se pudo crear el juego.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.contenedor}>
      <div style={styles.contenido}>
        <div style={styles.encabezado}>
          <h1 style={styles.titulo}>Crear videojuego</h1>
          <p style={styles.subtitulo}>
            Completá la información de tu juego.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Archivos del juego */}
          <section style={styles.tarjeta}>
            <h2 style={styles.seccionTitulo}>Archivos del juego</h2>

            <p style={styles.seccionSubtitulo}>
              Subí la portada, las capturas y el archivo ejecutable.
            </p>

            <div style={styles.archivosPrincipales}>
              {/* Portada */}
              <label style={styles.archivoBox}>
                {portada ? (
                  <>
                    <div style={styles.icono}>✓</div>
                    <strong>{portada.name}</strong>
                    <small style={styles.textoAyuda}>
                      Cambiar portada
                    </small>
                  </>
                ) : (
                  <>
                    <div style={styles.icono}>+</div>
                    <strong>Portada del juego</strong>
                    <small style={styles.textoAyuda}>
                      PNG o JPG · 1280×720 recomendado
                    </small>
                  </>
                )}

                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  hidden
                  onChange={(e) =>
                    setPortada(e.target.files[0] || null)
                  }
                />
              </label>

              {/* Archivo del videojuego */}
              <label style={styles.archivoBox}>
                {archivo ? (
                  <>
                    <div style={styles.icono}>✓</div>
                    <strong>{archivo.name}</strong>
                    <small style={styles.textoAyuda}>
                      Cambiar archivo
                    </small>
                  </>
                ) : (
                  <>
                    <div style={styles.icono}>+</div>
                    <strong>Archivo del videojuego</strong>
                    <small style={styles.textoAyuda}>
                      Seleccionar archivo
                    </small>
                  </>
                )}

                <input
                  type="file"
                  hidden
                  onChange={(e) =>
                    setArchivo(e.target.files[0] || null)
                  }
                />
              </label>
            </div>

            {/* Capturas */}
            <div style={styles.capturas}>
              {capturas.map((captura, index) => (
                <label
                  key={index}
                  style={{
                    ...styles.archivoBox,
                    ...styles.capturaBox,
                  }}
                >
                  {captura ? (
                    <>
                      <div style={styles.icono}>✓</div>
                      <strong>Captura {index + 1}</strong>
                      <small style={styles.textoAyuda}>
                        Cambiar imagen
                      </small>
                    </>
                  ) : (
                    <>
                      <div style={styles.icono}>+</div>
                      <strong>Captura {index + 1}</strong>
                      <small style={styles.textoAyuda}>
                        Opcional
                      </small>
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const nuevas = [...capturas];

                      nuevas[index] = e.target.files[0] || null;

                      setCapturas(nuevas);
                    }}
                  />
                </label>
              ))}
            </div>
          </section>

          {/* Información */}
          <section style={styles.tarjeta}>
            <h2 style={styles.seccionTitulo}>Información</h2>

            <p style={styles.seccionSubtitulo}>
              Contale a la comunidad de qué trata tu juego.
            </p>

            {/* Título */}
            <div style={styles.campo}>
              <label style={styles.label}>Título del juego</label>

              <input
                style={styles.input}
                placeholder="¡Agregale un título a tu juego!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Descripción */}
            <div style={styles.campo}>
              <label style={styles.label}>Descripción</label>

              <textarea
                style={styles.textarea}
                placeholder="Contanos de qué trata tu videojuego..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Materia y curso */}
            <div style={styles.dosColumnas}>
              <div style={styles.campo}>
                <label style={styles.label}>Materia</label>

                <select
                  style={styles.input}
                  value={materia}
                  onChange={(e) => setMateria(e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  <option>Matemática</option>
                  <option>Lengua</option>
                  <option>Ciencias naturales</option>
                  <option>Historia</option>
                  <option>Programación</option>
                  <option>Otra</option>
                </select>
              </div>

              <div style={styles.campo}>
                <label style={styles.label}>Curso</label>

                <select
                  style={styles.input}
                  value={curso}
                  onChange={(e) => setCurso(e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  <option>1°</option>
                  <option>2°</option>
                  <option>3°</option>
                  <option>4°</option>
                  <option>5°</option>
                  <option>6°</option>
                </select>
              </div>
            </div>
          </section>

          {error && (
            <p style={styles.error} role="alert">
              {error}
            </p>
          )}

          {/* Botones */}
          <div style={styles.botones}>
            <button
              type="button"
              style={styles.botonSecundario}
              onClick={() => navigate("/mis-juegos")}
            >
              Cancelar
            </button>

            <button
              type="submit"
              style={styles.botonPrincipal}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Crear videojuego →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  contenedor: {
    minHeight: "100vh",
    backgroundColor: "#0c0b1d",
    color: "#f1f5f9",
    padding: "48px 24px",
    fontFamily: "Inter, system-ui, sans-serif",
    boxSizing: "border-box",
  },
  contenido: {
    maxWidth: "1050px",
    margin: "0 auto",
  },
  encabezado: {
    marginBottom: "30px",
  },
  titulo: {
    fontSize: "36px",
    fontWeight: "700",
    margin: "0 0 8px",
  },
  subtitulo: {
    fontSize: "13px",
    color: "#a1a1c5",
  },
  tarjeta: {
    backgroundColor: "#13112b",
    border: "1px solid #514b70",
    borderRadius: "18px",
    padding: "28px",
    marginBottom: "24px",
  },
  seccionTitulo: {
    fontSize: "17px",
    margin: "0 0 4px",
  },
  seccionSubtitulo: {
    color: "#85819f",
    fontSize: "12px",
    margin: "0 0 22px",
  },
  archivosPrincipales: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
    marginBottom: "16px",
  },
  archivoBox: {
    minHeight: "170px",
    border: "1px dashed #7770d7",
    borderRadius: "12px",
    backgroundColor: "#1b1939",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: "pointer",
    padding: "16px",
    boxSizing: "border-box",
    textAlign: "center",
    fontSize: "13px",
    overflowWrap: "anywhere",
  },
  icono: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    backgroundColor: "#302b59",
    color: "#a78bfa",
    fontSize: "24px",
  },
  textoAyuda: {
    color: "#85819f",
    fontSize: "11px",
  },
  capturas: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "12px",
  },
  capturaBox: {
    minHeight: "110px",
  },
  campo: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    marginBottom: "18px",
    minWidth: 0,
  },
  label: {
    fontSize: "12px",
    color: "#c4c0db",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    backgroundColor: "#17152f",
    border: "1px solid #605b80",
    borderRadius: "9px",
    color: "#ffffff",
    fontSize: "13px",
    outline: "none",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    minHeight: "120px",
    resize: "vertical",
    padding: "12px",
    backgroundColor: "#17152f",
    border: "1px solid #605b80",
    borderRadius: "9px",
    color: "#ffffff",
    fontSize: "13px",
    fontFamily: "inherit",
    outline: "none",
  },
  dosColumnas: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
  },
  botones: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "32px",
  },
  botonSecundario: {
    backgroundColor: "transparent",
    border: "1px solid #77708f",
    borderRadius: "25px",
    padding: "12px 24px",
    color: "#ffffff",
    cursor: "pointer",
  },
  botonPrincipal: {
    background: "linear-gradient(90deg, #6366f1, #a855f7)",
    border: "none",
    borderRadius: "25px",
    padding: "12px 26px",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
  },
  error: {
    color: "#fca5a5",
    fontSize: "13px",
    marginTop: "16px",
    textAlign: "right",
  },
};

export default CreateGame;