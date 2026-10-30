# 🌙 DigitalNight — Plataforma Educativa de Videojuegos

Plataforma comunitaria escolar diseñada para que estudiantes y docentes puedan explorar, jugar, publicar, valorar y comentar videojuegos educativos creados en la comunidad escolar.

---

## 👥 Equipo de Desarrollo

* **Adrian Vega** — Base de datos, modelos relacionales y subida de archivos (Multer).
* **Jose Luis** — Moderación de juegos en panel admin, estados y datos demo.
* **Luciano Ferrari** — Manejo de errores global, validaciones de email, auditoría y 404.
* **Amy Delgado** — Detalle de juegos, biblioteca personal (favoritos e historial) y seguridad.
* **Tamara Britez** — Perfiles públicos, check de creador, gestión de creaciones y catálogo.
* **Diego Lima** — Autenticación, recuperación de contraseñas, navegación, footer, manual y puesta en marcha.

---

## 📋 Requisitos Previos

* **Node.js**: Versión 18 o superior.
* **MySQL**: Motor de base de datos relacional (vía XAMPP, WampServer o servicio MySQL local).
* **Git**: Control de versiones.
* Navegador web moderno (Google Chrome, Mozilla Firefox, Microsoft Edge).

---

## ⚙️ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/AmyDelgado08/Digital-Night-React.git
cd Digital-Night-React
```

### 2. Configurar la Base de Datos MySQL
Abrí tu gestor de base de datos preferido (phpMyAdmin en `http://localhost/phpmyadmin`, MySQL Workbench o la terminal de MySQL) y creá la base de datos:
```sql
CREATE DATABASE digitalnight;
```
*(Sequelize se encarga de crear automáticamente todas las tablas, relaciones y restricciones al iniciar el servidor).*

### 3. Configurar el Backend (`api/`)
```bash
cd api
npm install
```
Creá tu archivo de variables de entorno `.env` a partir del ejemplo:
```bash
cp .env.example .env
```
Verificá que los datos en `api/.env` coincidan con tu MySQL local:
```env
DB_NAME=digitalnight
DB_USER=root
DB_PASS=
DB_HOST=localhost
JWT_SECRET=misecreto
```
Iniciá el servidor backend:
```bash
npm start
```
El servidor quedará escuchando en `http://localhost:3000`.

### 4. Configurar el Frontend (`client/`)
Abrí una segunda terminal y posicionate en `client/`:
```bash
cd client
npm install
npm run dev
```
La aplicación web se abrirá en `http://localhost:5173`.

---

## 📡 Referencia de Endpoints de la API

Las imágenes y archivos multimedia subidos se sirven de forma estática en `http://localhost:3000/uploads/...`.

### 🔐 Autenticación y Recuperación
* `POST /register`: Registro de nuevos usuarios con validación de campos.
* `POST /login`: Inicio de sesión, retorna JWT y datos del usuario autenticado.
* `POST /auth/forgot-password`: Genera enlace temporal y envía token de restablecimiento.
* `POST /auth/reset-password`: Restablece la contraseña mediante verificación de token firmado.

### 👤 Usuarios y Perfiles
* `GET /me`: Obtiene los datos del usuario en sesión (`isAuth`).
* `PUT /users/me`: Actualiza nombre, bio, correo y visibilidad (`updateEmailRules`).
* `PUT /users/password`: Modifica la contraseña actual del usuario autenticado.
* `DELETE /users/me`: Elimina la cuenta del usuario autenticado.
* `GET /profiles/:id`: Retorna el perfil público, medalla ✓ de creador, estadísticas, favoritos y últimos jugados (`optionalAuth`).

### 🎮 Catálogo y Videojuegos
* `GET /games`: Lista los videojuegos publicados con información de autor y valoración.
* `GET /games/:id`: Detalle completo de un videojuego (`optionalAuth` para verificar si está guardado en favoritos).
* `POST /games`: Crea un nuevo videojuego con portada, capturas y archivo ejecutable (`multer`).
* `PUT /games/:id`: Actualiza datos y archivos de un juego existente.
* `DELETE /games/:id`: Elimina un juego y sus recursos asociados (eliminación en cascada).
* `GET /games/mine`: Lista los videojuegos creados por el usuario en sesión.

### 📚 Biblioteca Personal
* `GET /me/library`: Lista de juegos favoritos y jugados recientemente del usuario.
* `POST /games/:id/favorite`: Añade un juego a la lista de favoritos.
* `DELETE /games/:id/favorite`: Remueve un juego de favoritos.
* `POST /games/:id/play`: Registra una jugada en el historial de actividad y suma al contador.

### ⭐ Valoraciones y Comentarios
* `PUT /games/:id/rating`: Califica un videojuego de 1 a 5 estrellas (evita autovaloración).
* `GET /games/:id/comments`: Obtiene los comentarios de la comunidad sobre un videojuego.
* `POST /games/:id/comments`: Publica un nuevo comentario (límite 500 caracteres).
* `DELETE /comments/:id`: Elimina un comentario (solo el autor o administradores).

### 🛡️ Administración y Auditoría
* `GET /users`: Listado de todos los usuarios registrados (`requireRole('admin')`).
* `POST /users`: Creación directa de usuarios desde el panel de administración.
* `PUT /users/:id`: Edición de roles y datos de usuarios por un administrador.
* `DELETE /users/:id`: Baja de usuario por un administrador.
* `GET /admin/games`: Lista de juegos para moderación y filtrado por estado.
* `PUT /admin/games/:id/review`: Aprobación o rechazo con motivo obligatorio de moderación.
* `GET /audit`: Consulta de eventos, accesos y auditoría del sistema con limitador de peticiones.

---

## 📖 Manual de Usuario

El manual de usuario completo, con instrucciones detalladas paso a paso, capturas de pantalla y resolución de errores comunes, se encuentra disponible en:
👉 [docs/MANUAL.md](docs/MANUAL.md)
