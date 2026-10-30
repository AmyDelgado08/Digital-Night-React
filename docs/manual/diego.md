# Manual de usuario: secciones de Diego

## Introducción e Instalación

DigitalNight es una plataforma comunitaria escolar diseñada para explorar, jugar, publicar y valorar videojuegos educativos creados por estudiantes y docentes.

**Requisitos previos**
* Node.js v18 o superior.
* MySQL en ejecución local (puerto 3306).
* Navegador web moderno (Chrome, Edge, Firefox).

**Pasos**
1. Cloná el repositorio: `git clone https://github.com/AmyDelgado08/Digital-Night-React.git` y entrá a la carpeta con `cd Digital-Night-React`.
2. Instalá las dependencias del backend: entrá a `api/` con `cd api` y ejecutá `npm install`.
3. Creá tu archivo `.env` copiando el de ejemplo con `cp .env.example .env` (o crealo a mano) y configurá tus credenciales locales de MySQL.
4. Creá la base de datos vacía en MySQL: abrí phpMyAdmin o tu consola de MySQL y ejecutá `CREATE DATABASE digitalnight;`.
5. Iniciá el backend con `npm start`. Vas a ver el mensaje: *El server esta corriendo en el puerto 3000*.
6. En otra terminal, entrá a la carpeta del frontend con `cd client`, instalá dependencias con `npm install` y levantá el cliente con `npm run dev`.
7. Abrí en tu navegador: `http://localhost:5173`.

**Posibles errores**
* **"ER_BAD_DB_ERROR: Unknown database 'digitalnight'"**: te olvidaste de crear la base de datos en MySQL. Creala con `CREATE DATABASE digitalnight;`.
* **"AccessDeniedError [SequelizeAccessDeniedError]"**: MySQL no está iniciado o el usuario/contraseña configurado en `api/.env` es incorrecto.
* **"MODULE_NOT_FOUND"**: te faltó ejecutar `npm install` en la carpeta `api/` o `client/`.

---

## Registrarse

Permite crear una nueva cuenta personal en la plataforma para poder subir videojuegos, valorar con estrellas, comentar y guardar favoritos.

**Pasos**
1. En el menú de arriba, hacé clic en el botón violeta **Registrarse** (o entrá directo a `/register`).
2. Completá tus datos: **Nombre**, **Apellido** y un **Correo electrónico** válido.
3. Escribí una **Contraseña** (mínimo 8 caracteres) y repetila en **Confirmar contraseña**.
4. Hacé clic en el botón **Registrarse**.
5. Vas a ver el mensaje de confirmación y el sistema te manda automáticamente a la pantalla de inicio de sesión.

![Pantalla de Registro](../img/diego-registro.jpg)

**Posibles errores**
* **"El email ya está registrado"**: ya existe un usuario con ese correo. Usá otro email o iniciá sesión.
* **"La contraseña debe tener al menos 8 caracteres"**: la clave ingresada es muy corta.
* **"Las contraseñas no coinciden"**: los dos campos de contraseña tienen que ser exactamente iguales.
* **"El email no es válido"**: revisá que el correo tenga formato correcto (ejemplo: `usuario@email.com`).

---

## Iniciar y cerrar sesión

Te permite ingresar a tu cuenta para ver tu biblioteca, crear juegos y editar tu perfil, o salir de forma segura cuando termines.

**Pasos para Iniciar sesión**
1. Hacé clic en **Iniciar sesión** en el menú de arriba (o entrá a `/login`).
2. Escribí tu **Correo electrónico** y tu **Contraseña**.
3. Opcional: marcá la casilla **Recordarme** si estás usando tu propia computadora.
4. Hacé clic en el botón **Iniciar sesión**.
5. Al entrar, el menú superior se actualiza automáticamente mostrando: *Mis juegos*, *Biblioteca*, *Editar perfil* (y *Panel de administración* si sos admin).

**Pasos para Cerrar sesión**
1. Desde cualquier página, hacé clic en el botón **Cerrar sesión** ubicado a la derecha del menú superior.
2. Se limpian tus datos y el token del navegador, y volvés a la pantalla de login.

![Pantalla de Inicio de Sesión](../img/diego-login.jpg)

**Posibles errores**
* **"Usuario o contraseña incorrecta"**: el email o la contraseña están mal escritos.
* **"La contraseña es obligatoria"**: no dejes campos vacíos al enviar el formulario.

---

## Recuperar la contraseña

Te permite generar una nueva contraseña si te olvidaste la actual, mediante un enlace seguro temporal de 15 minutos.

**Pasos**
1. En la pantalla de login, hacé clic en **¿Olvidaste tu contraseña?** (o entrá a `/olvide-password`).
2. Escribí tu correo electrónico y tocá el botón **Enviar enlace de recuperación**.
3. Vas a ver el mensaje: *"Si el email existe, te enviamos un enlace para restablecer tu contraseña"*.
4. En la terminal donde corre el backend (`api`), mirá el enlace que se generó por consola (ejemplo: `http://localhost:5173/restablecer/eyJhbGciOi...`).
5. Copiá ese enlace y abrilo en tu navegador.
6. Escribí tu **Nueva contraseña** (mínimo 8 caracteres) y confirmala en el segundo campo.
7. Hacé clic en **Restablecer contraseña**. Vas a ver el aviso de confirmación y el sistema te manda al login para que entres con tu nueva clave.

![Solicitar recuperación de contraseña](../img/diego-recuperar-password.jpg)

![Restablecer contraseña](../img/diego-restablecer-password.jpg)

**Posibles errores**
* **"El enlace no es válido o venció"**: pasaron más de 15 minutos desde que lo pediste o el enlace está incompleto. Tenés que pedir un enlace nuevo desde `/olvide-password`.
* **"Las contraseñas no coinciden"**: los dos campos de nueva contraseña deben ser idénticos.
* **"La nueva contraseña debe tener al menos 8 caracteres"**: la contraseña nueva debe cumplir con el mínimo de seguridad.
