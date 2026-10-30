# 📖 Manual de Usuario — DigitalNight

Bienvenido al manual oficial de usuario de **DigitalNight**, la plataforma comunitaria escolar diseñada para explorar, jugar, publicar y valorar videojuegos educativos creados por estudiantes y docentes.

---

## 📑 Índice General

1. [Introducción e Instalación](#1-introducción-e-instalación) *(Diego)*
2. [Gestión de Cuentas y Accesos](#2-gestión-de-cuentas-y-accesos) *(Diego y Amy)*
   * [2.1 Registrarse](#21-registrarse) *(Diego)*
   * [2.2 Iniciar y cerrar sesión](#22-iniciar-y-cerrar-sesión) *(Diego)*
   * [2.3 Recuperar la contraseña](#23-recuperar-la-contraseña) *(Diego)*
   * [2.4 Cambiar la contraseña desde tu perfil](#24-cambiar-la-contraseña-desde-tu-perfil) *(Amy)*
3. [Catálogo, Búsqueda y Detalle de Juegos](#3-catálogo-búsqueda-y-detalle-de-juegos) *(Amy y Tamara)*
   * [3.1 Catálogo y búsqueda](#31-catálogo-y-búsqueda) *(Tamara)*
   * [3.2 Ver el detalle de un juego](#32-ver-el-detalle-de-un-juego) *(Amy)*
   * [3.3 Jugar, guardar en favoritos y compartir](#33-jugar-guardar-en-favoritos-y-compartir) *(Amy)*
4. [Interacción: Valoraciones y Comentarios](#4-interacción-valoraciones-y-comentarios) *(Luciano)*
   * [4.1 Valorar un juego](#41-valorar-un-juego) *(Luciano)*
   * [4.2 Comentar en un juego](#42-comentar-en-un-juego) *(Luciano)*
   * [4.3 Borrar un comentario](#43-borrar-un-comentario) *(Luciano)*
5. [Biblioteca Personal](#5-biblioteca-personal) *(Amy)*
   * [5.1 Uso de la Biblioteca: Favoritos e Historial](#51-uso-de-la-biblioteca) *(Amy)*
6. [Creación y Gestión de Videojuegos](#6-creación-y-gestión-de-videojuegos) *(Adrian y JoseLuis)*
   * [6.1 Crear y publicar un juego](#61-crear-y-publicar-un-juego) *(Adrian)*
   * [6.2 Subida de portada, capturas y archivos](#62-subida-de-portada-capturas-y-archivos) *(Adrian)*
   * [6.3 Estados del juego: En revisión, Publicado y Rechazado](#63-estados-del-juego) *(JoseLuis)*
   * [6.4 Mis creaciones y edición](#64-mis-creaciones-y-edición) *(Adrian y JoseLuis)*
   * [6.5 Eliminar un juego](#65-eliminar-un-juego) *(Adrian)*
7. [Perfiles y Privacidad](#7-perfiles-y-privacidad) *(Tamara)*
   * [7.1 Mi perfil y perfiles públicos (check de creador)](#71-mi-perfil-y-perfiles-públicos) *(Tamara)*
   * [7.2 Editar datos y biografía](#72-editar-datos-y-biografía) *(Tamara)*
   * [7.3 Ajustes de privacidad y eliminar la cuenta](#73-ajustes-de-privacidad-y-eliminar-la-cuenta) *(Tamara)*
8. [Panel de Administración](#8-panel-de-administración) *(JoseLuis)*
   * [8.1 Gestión y moderación de usuarios](#81-gestión-y-moderación-de-usuarios) *(JoseLuis)*
   * [8.2 Revisión y aprobación de juegos](#82-revisión-y-aprobación-de-juegos) *(JoseLuis)*
9. [Guía de Errores Comunes y Soluciones](#9-guía-de-errores-comunes-y-soluciones) *(Luciano)*

---

## 1. Introducción e Instalación

DigitalNight es una aplicación web full-stack compuesta por un cliente interactivo en **React (Vite)** y una API backend en **Node.js (Express y Sequelize)** conectada a **MySQL**.

### Requisitos previos
* **Node.js**: Versión 18 o superior.
* **MySQL**: Motor de base de datos en ejecución (mediante XAMPP, WampServer o servicio local).
* Navegador web moderno (Chrome, Edge, Firefox).

### Pasos de instalación y puesta en marcha
1. **Clonar el proyecto:**
   ```bash
   git clone https://github.com/AmyDelgado08/Digital-Night-React.git
   cd Digital-Night-React
   ```
2. **Configurar el Backend:**
   * Entrá en la carpeta `api/`:
     ```bash
     cd api
     npm install
     ```
   * Creá tu archivo `.env` a partir del ejemplo:
     ```bash
     cp .env.example .env
     ```
   * Abrí `.env` y confirmá tus credenciales de MySQL:
     ```env
     DB_NAME=DigitalNight
     DB_USER=root
     DB_PASS=
     DB_HOST=localhost
     JWT_SECRET=misecreto
     ```
   * **Crear la base de datos en MySQL:**
     Abrí tu gestor de bases de datos preferido (phpMyAdmin en `http://localhost/phpmyadmin`, MySQL Workbench o terminal de MySQL) y ejecutá:
     ```sql
     CREATE DATABASE digitalnight;
     ```
     *(Nota: Solo necesitás crear la base vacía; todas las tablas, columnas y relaciones las crea automáticamente Sequelize al iniciar el servidor).*
   * **Cargar datos iniciales (Seed):**
     Para contar inmediatamente con un usuario administrador (`admin@digitalnight.com` / `Admin1234!`) y 3 videojuegos publicados de prueba:
     ```bash
     npm run seed
     ```
   * Iniciá el servidor:
     ```bash
     npm start
     ```
     Verás el mensaje: `El server esta corriendo en el puerto 3000`.

3. **Configurar el Frontend:**
   * Abrí otra terminal y entrá en `client/`:
     ```bash
     cd client
     npm install
     npm run dev
     ```
   * Abrí en tu navegador: `http://localhost:5173`.

### Posibles errores de instalación
* **`ER_BAD_DB_ERROR: Unknown database 'digitalnight'`**: Falta crear la base de datos en MySQL. Ejecutá `CREATE DATABASE digitalnight;` en phpMyAdmin o tu consola de MySQL.
* **`AccessDeniedError [SequelizeAccessDeniedError]`**: MySQL no está corriendo o la contraseña/usuario de tu archivo `api/.env` no coincide con tu MySQL local.
* **`MODULE_NOT_FOUND`**: Te faltó ejecutar `npm install` en la carpeta `api/` o `client/`.

---

## 2. Gestión de Cuentas y Accesos

### 2.1 Registrarse

Permite crear una nueva cuenta en la plataforma para desbloquear la posibilidad de subir videojuegos, dejar calificaciones, comentar y armar tu biblioteca personal.

**Pasos:**
1. En la barra superior, hacé clic en **Registrarse** (o ingresá a `/register`).
2. Completá los campos:
   * **Nombre** y **Apellido**.
   * **Correo electrónico** válido.
   * **Contraseña** (mínimo 8 caracteres) y su **Confirmación**.
3. Hacé clic en el botón violeta **Registrarse**.
4. El sistema te mostrará una alerta indicando que la cuenta fue creada y te redirigirá a la pantalla de inicio de sesión.

![Pantalla de Registro](img/diego-registro.jpg)

**Posibles errores:**
* **"El email ya está registrado"**: Ya existe una cuenta con esa dirección. Iniciá sesión o solicitá recuperar tu clave.
* **"La contraseña debe tener al menos 8 caracteres"**: Ingresá una clave que cumpla con el largo mínimo exigido por seguridad.
* **"Las contraseñas no coinciden"**: Verificá que ambos campos de contraseña sean idénticos.
* **"El email no es válido"**: Escribí una dirección con formato de correo real (ejemplo: `nombre@correo.com`).

---

### 2.2 Iniciar y cerrar sesión

Te permite autenticarte en la plataforma para acceder a tus contenidos personales y cerrar tu sesión al terminar.

**Pasos para Iniciar Sesión:**
1. Hacé clic en **Iniciar sesión** en la barra superior (o entrá a `/login`).
2. Escribí tu **Correo electrónico** y tu **Contraseña**.
3. Opcional: marcá la casilla **Recordarme** si estás en un equipo propio.
4. Hacé clic en **Iniciar sesión**.
5. Al ingresar, la barra de navegación se actualizará mostrando tus accesos a *Mis juegos*, *Biblioteca*, *Editar perfil* (y *Panel de administración* si tu rol es administrador).

**Pasos para Cerrar Sesión:**
1. En cualquier pantalla donde estés navegando, hacé clic en el botón **Cerrar sesión** ubicado a la derecha del menú superior.
2. El sistema limpiará tus credenciales del navegador y te redirigirá a la pantalla de login.

![Pantalla de Login](img/diego-login.jpg)

**Posibles errores:**
* **"Usuario o contraseña incorrecta"**: El correo o la clave no coinciden con los registros.
* **"La contraseña es obligatoria"**: Debes completar ambos campos antes de enviar.

---

### 2.3 Recuperar la contraseña

Permite restablecer tu clave de acceso en caso de olvido mediante un enlace seguro con límite de tiempo.

**Pasos:**
1. En la pantalla de login, hacé clic en el enlace **¿Olvidaste tu contraseña?** (o visitá `/olvide-password`).
2. Ingresá el correo electrónico asociado a tu cuenta y presioná **Enviar enlace de recuperación**.
3. El sistema responderá: *"Si el email existe, te enviamos un enlace para restablecer tu contraseña"*.
4. **En entorno de desarrollo:** Abrí la terminal donde corre el backend (`api`); allí verás impreso el enlace generado:
   ```text
   Enlace de restablecimiento para usuario@ejemplo.com:
   http://localhost:5173/restablecer/eyJhbGciOi...
   ```
5. Copiá y abrí esa URL en tu navegador para ingresar a la pantalla de restablecimiento.
6. Escribí tu **Nueva contraseña** y confirmala.
7. Hacé clic en **Restablecer contraseña**. Se actualizará en la base de datos y serás redirigido al login para ingresar con tu nueva clave.

![Recuperar contraseña](img/diego-recuperar-password.jpg)

![Restablecer contraseña](img/diego-restablecer-password.jpg)

**Posibles errores:**
* **"El enlace no es válido o venció"**: El enlace tiene una vigencia estricta de 15 minutos. Si pasó más tiempo o el token fue alterado, deberás solicitar uno nuevo.
* **"Las contraseñas no coinciden"**: Las dos contraseñas escritas deben ser idénticas.

---

### 2.4 Cambiar la contraseña desde tu perfil *(Amy)*

Te permite poner una contraseña nueva desde tu panel de configuración cuando recordás la actual.

**Pasos:**
1. Iniciá sesión y entrá a **Editar perfil** en el menú de arriba.
2. En el menú lateral de la izquierda, hacé clic en **Seguridad** (o visitá `/seguridad`).
3. Escribí tu **contraseña actual**.
4. Escribí la **nueva contraseña** (mínimo 8 caracteres) y repetila en **Confirmar nueva contraseña**.
5. Hacé clic en **Guardar cambios**. Verás el mensaje verde *"Contraseña actualizada con éxito"*.
6. La próxima vez que inicies sesión, usá la nueva clave.

![Cambiar contraseña](img/amy-seguridad.jpg)

**Posibles errores:**
* **"La nueva contraseña y la confirmación no coinciden"**: Los dos últimos campos deben ser iguales.
* **"La contraseña actual es incorrecta"**: Revisá tu clave actual. Si la olvidaste, cerrá sesión y utilizá el flujo de recuperación.

---

## 3. Catálogo, Búsqueda y Detalle de Juegos

### 3.1 Catálogo y búsqueda *(Tamara)*
*(Sección a cargo de Tamara: filtros por título con `?q=`, portada real, valoración promedio y autor).*

---

### 3.2 Ver el detalle de un juego *(Amy)*

Muestra toda la información de un juego: de qué se trata, quién lo hizo, sus capturas y sus estadísticas. No hace falta iniciar sesión para verlo.

**Pasos:**
1. Entrá a **Juegos** desde el botón *"Explorar juegos"* del inicio.
2. Hacé clic en cualquier juego del catálogo.
3. Arriba vas a ver el título, etiquetas (plataforma, materia y curso), descripción, autor y valoración promedio.
4. Más abajo verás "Sobre el juego", las **capturas** (al hacer clic en una se amplía) y la **Ficha del juego**.
5. En la columna derecha figuran las estadísticas: **Jugadas**, **Favoritos** y **Nota**.
6. Para ver el perfil del autor, hacé clic en su nombre o en el botón **Ver perfil**.

![Detalle de un juego](img/amy-detalle-juego.jpg)
![Ficha y estadísticas del juego](img/amy-detalle-ficha.jpg)

**Avisos informativos:**
* **"Este juego está en revisión"** (amarillo): Solo visible para el autor o administradores mientras espera moderación.
* **"Este juego fue rechazado"** (rojo): Muestra el motivo redactado por el administrador.

**Posibles errores:**
* **"Juego no encontrado"**: El juego fue eliminado o el enlace es incorrecto.
* **"Sin valoraciones todavía"**: Indica que aún ningún usuario ha calificado el juego.

---

### 3.3 Jugar, guardar en favoritos y compartir *(Amy)*

Son los tres botones de interacción principal debajo de la descripción del juego.

**Pasos:**
1. **Jugar ahora**: Abre el juego en una pestaña nueva y suma una jugada al contador. Si tenés la sesión iniciada, se registrará en tu Biblioteca en "Jugados recientemente".
2. **Guardar**: Agrega el juego a tus favoritos. El botón cambia a color violeta y dice **Guardado**. Al tocarlo nuevamente, se remueve.
3. **Compartir**: Copia el enlace directo al portapapeles para enviarlo por mensajería o correo.

**Posibles errores:**
* **"Tenés que iniciar sesión para guardar juegos en favoritos"**: Se requiere cuenta activa para almacenar favoritos.
* **"Este juego todavía no tiene un link ni un archivo para jugar"**: El autor no adjuntó un ejecutable o enlace web.

---

## 4. Interacción: Valoraciones y Comentarios *(Luciano)*

### 4.1 Valorar un juego *(Luciano)*
*(Sección a cargo de Luciano: escala de 1 a 5 estrellas, promedio dinámico y restricción para evitar autovaloración).*

### 4.2 Comentar en un juego *(Luciano)*
*(Sección a cargo de Luciano: formulario de comentarios, límite de 500 caracteres y enlace al perfil del autor).*

### 4.3 Borrar un comentario *(Luciano)*
*(Sección a cargo de Luciano: eliminación por parte del autor del comentario o de un moderador/admin).*

---

## 5. Biblioteca Personal *(Amy)*

### 5.1 Uso de la Biblioteca *(Amy)*

Espacio personal donde se almacenan tus juegos guardados y tu historial de actividad reciente. Requiere inicio de sesión.

**Pasos:**
1. Iniciá sesión y hacé clic en **Biblioteca** en el menú superior (o visitá `/biblioteca`).
2. En la pestaña **Favoritos** verás todos los títulos guardados.
3. En **Jugados recientemente** se listan los últimos 12 juegos abiertos mediante "Jugar ahora".
4. Hacé clic en cualquier tarjeta para abrir su ficha de detalle.

![Biblioteca](img/amy-biblioteca.jpg)

**Posibles errores:**
* **"Primero debes iniciar sesión"**: Serás redirigido al login si intentás entrar de forma anónima.
* **"Todavía no guardaste ningún juego"**: Mensaje informativo indicando que la lista se encuentra vacía.

---

## 6. Creación y Gestión de Videojuegos *(Adrian y JoseLuis)*

### 6.1 Crear y publicar un juego *(Adrian)*
*(Sección a cargo de Adrian: formulario en `/crear-juego` con título, descripción, materia y curso).*

### 6.2 Subida de portada, capturas y archivos *(Adrian)*
*(Sección a cargo de Adrian: especificaciones de Multer, formatos PNG/JPG, archivos comprimidos .zip/.rar y límite de 50 MB).*

### 6.3 Estados del juego: En revisión, Publicado y Rechazado *(JoseLuis)*

Para garantizar la calidad de los contenidos escolares y la seguridad de la comunidad, los juegos transitan por tres estados:
* **En revisión (`pendiente`):** Estado asignado automáticamente al crear o editar un juego (a excepción de los creados por un administrador). Es visible únicamente para su autor y para los administradores.
* **Publicado (`publicado`):** Aprobado por el equipo de moderación. Aparece en el catálogo general (`/games`), en búsquedas y en perfiles.
* **Rechazado (`rechazado`):** Denegado por un administrador por motivos pedagógicos o técnicos, adjuntando obligatoriamente una justificación para su corrección.

> **Regla de integridad:** Cuando el autor edita un juego existente, este vuelve automáticamente al estado **En revisión** para una nueva verificación.

### 6.4 Mis creaciones y edición *(Adrian y JoseLuis)*

Vista accesible desde `/mis-juegos` para los creadores de contenido.

**Características:**
* **Métricas superiores:** Contadores en tiempo real de títulos **Publicados**, **En revisión** y **Rechazados**.
* **Listado de creaciones:** Muestra la portada, título, descripción, fecha de actualización y etiqueta de estado de cada título propio. En caso de juegos rechazados, se muestra en rojo el motivo de rechazo.
* **Edición (botón ✎):** Redirige directamente a `/editar-juego/:id` para actualizar datos, portadas o enlaces del videojuego.

### 6.5 Eliminar un juego *(Adrian)*
*(Sección a cargo de Adrian: confirmación y borrado en cascada con `DELETE /games/:id`).*

---

## 7. Perfiles y Privacidad *(Tamara)*

### 7.1 Mi perfil y perfiles públicos *(Tamara)*
*(Sección a cargo de Tamara: vistas `/perfil` y `/usuarios/:id`, distintivo ✓ de creador y conteo de publicaciones).*

### 7.2 Editar datos y biografía *(Tamara)*
*(Sección a cargo de Tamara: actualización de nombre, apellido, fecha de nacimiento y biografía).*

### 7.3 Ajustes de privacidad y eliminar la cuenta *(Tamara)*
*(Sección a cargo de Tamara: visibilidad de perfil, email y fecha de nacimiento en `/privacidad`, y borrado de cuenta en `DELETE /users/me`).*

---

## 8. Panel de Administración *(JoseLuis)*

Módulo exclusivo para usuarios con rol `admin` disponible en `/admin`.

### 8.1 Gestión y moderación de usuarios *(JoseLuis)*

Permite auditar el padrón de usuarios registrados en la plataforma:
* Listado general con identificación, nombre, email y rol (`user` o `admin`).
* Formulario interactivo para dar de alta nuevos usuarios con roles predefinidos (`POST /admin/users`).
* Edición en línea para actualizar datos o promover a nuevos administradores (`PUT /users/:id`).
* Eliminación de cuentas problemáticas (`DELETE /users/:id`).

### 8.2 Revisión y aprobación de juegos *(JoseLuis)*

Submódulo de moderación en dos pestañas clave:
1. **Pestaña "Revisión de juegos":** Muestra todas las solicitudes pendientes (`GET /admin/games?status=pendiente`) con su portada, título y autor.
   * **Aprobar:** Cambia el estado a `publicado` y lo hace visible en el catálogo de inmediato (`PUT /admin/games/:id/review` con `{ status: 'publicado' }`).
   * **Rechazar:** Solicita el motivo de rechazo obligatorio antes de actualizar el estado a `rechazado` (`PUT /admin/games/:id/review` con `{ status: 'rechazado', reason }`).
2. **Pestaña "Todos los juegos":** Permite al administrador consultar todo el catálogo (`GET /admin/games`) y borrar de forma permanente cualquier publicación inapropiada (`DELETE /games/:id`).

---

## 9. Guía de Errores Comunes y Soluciones *(Luciano)*
*(Sección a cargo de Luciano: compilación de códigos de estado HTTP 400, 401, 403, 404, 409 y cómo resolverlos).*
