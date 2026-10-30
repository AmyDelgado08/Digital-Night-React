# Manual de usuario: secciones de JoseLuis

## 1. Estados del videojuego y flujo de moderación

Para mantener la calidad y seguridad de los contenidos en la comunidad escolar, los videojuegos atraviesan un ciclo de vida con estados definidos:

* **En revisión (`pendiente`):** Estado inicial cuando un usuario regular crea o edita un juego. El juego solo es visible para el autor y los administradores. No figura en el catálogo público (`GET /games`).
* **Publicado (`publicado`):** Aprobado por un administrador (o creado directamente por un administrador). Es visible públicamente en el catálogo, en búsquedas y en perfiles.
* **Rechazado (`rechazado`):** Si un administrador considera que el juego incumple las pautas de convivencia o requiere correcciones, lo rechaza ingresando un **motivo obligatorio**. El autor puede ver el motivo en su panel de "Mis juegos" y en la ficha de detalle, corregirlo y enviarlo nuevamente a revisión al guardarlo.

> **Regla de re-moderación:** Si el autor edita cualquier dato o archivo de un juego que ya estaba publicado o rechazado, vuelve automáticamente al estado **En revisión** para una nueva verificación por parte del equipo administrativo.

---

## 2. Gestión de "Mis juegos" (Mis creaciones)

Permite a los creadores supervisar el estado de todos sus videojuegos, conocer las razones de rechazo si existieran y acceder a la edición.

**Pasos para gestionar tus creaciones:**
1. Iniciá sesión con tu cuenta y hacé clic en **Mis juegos** en la barra superior de navegación (o ingresá a `/mis-juegos`).
2. En la parte superior vas a ver las métricas de tus publicaciones:
   * **Publicados:** Cantidad de juegos visibles para toda la comunidad.
   * **En revisión:** Cantidad de títulos a la espera de aprobación.
   * **Rechazados:** Cantidad de títulos devueltos con observaciones.
3. En la tabla inferior verás la lista completa con portada, título, descripción, fecha de actualización y la etiqueta de estado con sus colores característicos:
   * Verde para **Publicado**.
   * Amarillo para **En revisión**.
   * Rojo para **Rechazado** (con el texto explicativo del motivo debajo).
4. **Editar un juego:** Hacé clic en el botón circular **✎** en la columna de acciones. Serás redirigido a `/editar-juego/:id`, donde podrás modificar el título, plataforma, materia, curso, enlaces o reemplazar portada y archivos.
5. **Eliminar un juego:** Hacé clic en el botón **×** y confirmá la alerta del navegador. El juego se eliminará de forma definitiva.

**Posibles errores:**
* **"No se pudieron cargar tus juegos"**: Verificá que el servidor backend esté corriendo y que tu sesión no haya caducado.
* **"No tienes permiso para ver este juego"**: Si intentás abrir un juego ajeno que aún no ha sido publicado.

---

## 3. Panel de Administración: Revisión de juegos y Supervisión

Los usuarios con rol `admin` cuentan con acceso a la ruta `/admin` para gestionar usuarios y moderar el catálogo.

### 3.1 Pestaña "Revisión de juegos"
Centraliza las solicitudes de publicación pendientes de aprobación.

**Pasos para revisar y moderar un juego:**
1. Iniciá sesión con una cuenta de administrador y hacé clic en **Panel admin** en la barra superior.
2. Seleccioná la pestaña **Revisión de juegos**.
3. Se mostrará la lista de títulos con su portada, título, autor y datos escolares.
4. Hacé clic en **Ver juego** para inspeccionar la ficha completa, sus capturas y enlace en una pestaña nueva.
5. **Para aprobar:** Hacé clic en el botón verde **Aprobar**. El juego pasará a estado `publicado` y estará disponible en el catálogo de inmediato.
6. **Para rechazar:** Hacé clic en el botón rojo **Rechazar**. Se abrirá un cuadro emergente solicitando el motivo. Escribí la observación (por ejemplo: *"Falta adjuntar el enlace funcional"* o *"El contenido no se adapta al curso indicado"*) y aceptá. El motivo quedará registrado para que el autor pueda corregirlo.

### 3.2 Pestaña "Todos los juegos"
Permite auditar el inventario global de títulos registrados en la plataforma.

**Pasos para supervisar o eliminar:**
1. En el **Panel admin**, hacé clic en la pestaña **Todos los juegos**.
2. Podrás visualizar el catálogo global junto con el autor y el estado actual de cada título.
3. Podrás acceder a su detalle con **Ver juego** o eliminarlo definitivamente con el botón **Eliminar** en caso de infracciones graves.

---

## 4. Script de inicialización (Seed)

Para facilitar pruebas y presentaciones, se incluye el script de inicialización de datos:

**Ejecución:**
1. Abrí una terminal en la carpeta `api/`.
2. Ejecutá:
   ```bash
   npm run seed
   ```
3. El comando creará automáticamente:
   * Un usuario administrador con credenciales:
     * **Email:** `admin@digitalnight.com`
     * **Contraseña:** `Admin1234!`
     * **Rol:** `admin`
   * 3 videojuegos educativos de ejemplo con estado `publicado`:
     1. *Math Quest: El Reino de los Números* (Matemática).
     2. *EcoPlaneta: Misión Verde* (Ciencias Naturales).
     3. *Cronos: Viajeros del Tiempo* (Ciencias Sociales e Historia).
