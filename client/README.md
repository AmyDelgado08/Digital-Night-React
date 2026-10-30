# 🎮 DigitalNight — Cliente Web (Frontend)

Interfaz de usuario para la plataforma educativa **DigitalNight**, desarrollada con **React 19** y **Vite**.

---

## 🚀 Requisitos y Puesta en Marcha

1. **Instalar dependencias:**
   ```bash
   cd client
   npm install
   ```

2. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación se abrirá en `http://localhost:5173`.

3. **Compilar para producción:**
   ```bash
   npm run build
   ```

---

## 📁 Estructura del Proyecto

* **`src/`**
  * **`components/`**: Componentes y vistas principales de la aplicación:
    * `Home.jsx`: Portada interactiva de bienvenida con accesos destacados.
    * `Games.jsx`: Catálogo público con buscador y filtros.
    * `GameDetail.jsx`: Ficha completa del juego, capturas, ficha técnica y botones de acción.
    * `Library.jsx`: Biblioteca personal (Favoritos y Jugados recientemente).
    * `MyGames.jsx`: Panel de autor con métricas, estados y enlaces de edición.
    * `CreateGame.jsx`: Formulario para publicar y editar videojuegos con carga de archivos y capturas.
    * `Profile.jsx`: Vista de perfil del usuario con medalla ✓ de creador.
    * `EditProfile.jsx`, `Security.jsx`, `Privacy.jsx`: Configuración personal, cambio de contraseña y ajustes de privacidad.
    * `AdminDashboard.jsx`, `Audit.jsx`: Panel de moderación y auditoría para administradores.
    * `Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx`: Módulos de autenticación y recuperación de clave.
    * `NotFound.jsx`: Página de error 404 personalizada para rutas inexistentes.
    * `Footer.jsx`: Pie de página institucional con navegación y créditos del equipo.
  * **`img/`**: Recursos gráficos, isotipos y capturas.
  * **`App.jsx`**: Enrutador central (`react-router-dom`) y barra de navegación superior.
  * **`main.jsx`**: Punto de entrada de la aplicación.
* **`public/`**: Favicon e íconos estáticos.

---

## 🛠️ Tecnologías Empleadas

* **React 19** & **Vite 7**
* **React Router DOM 7**
* **Axios** (cliente HTTP)
* **CSS-in-JS / Estilos modulares**
