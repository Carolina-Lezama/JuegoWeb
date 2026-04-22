# SerEstrella - Juego Web Interactivo

## Descripción del Proyecto

**SerEstrella** es un videojuego web interactivo desarrollado con Phaser 3, PHP y MySQL. Es un juego de aventura con sistema de progresión, logros, inventario de objetos y panel de administración para gestionar usuarios, estadísticas y contenido del juego.

El proyecto implementa una arquitectura MVC completa, permitiendo tanto a jugadores regulares disfrutar del juego como a administradores gestionar la plataforma.

---

##  Tecnologías y Herramientas

### Frontend

- **Phaser 3** - Framework de desarrollo de videojuegos en JavaScript
- **HTML5/CSS3** - Estructura y estilos
- **JavaScript (ES6+)** - Lógica del juego y interactividad

### Backend

- **PHP 7.x+** - Servidor web
- **MySQL** - Base de datos
- **PDO** - Abstracción de base de datos
- **PHPMailer ^7.0** - Sistema de envío de correos

### Otras Herramientas

- **Composer** - Gestor de dependencias de PHP
- **Tiled Map Editor** - Creación de mapas del juego (archivos `.tmx`, `.tmj`)
- **Libresprite** - Editor de sprites y animaciones (archivos `.ase`)

### Desarrollo Local

- **XAMPP** - Servidor Apache + MySQL + PHP
- **VS Code** - Editor recomendado

---

##  Arquitectura del Proyecto

El proyecto sigue el patrón **Modelo-Vista-Controlador (MVC)**:

```
Juego/
├── controller/          # Controladores (lógica de negocio)
├── model/              # Modelos (acceso a datos)
├── view/               # Vistas (presentación)
├── admin/              # Módulo de administración
│   ├── controller/
│   ├── model/
│   ├── view/
│   └── includes/
├── api/                # Endpoints de API REST
├── js/                 # Código JavaScript
│   ├── Scenes/         # Escenas del juego (Phaser)
│   ├── main.js         # Punto de entrada del juego
│   ├── juego.js        # Lógica general del juego
│   ├── phaser.min.js   # Framework Phaser 3
│   └── ...
├── assets/             # Recursos del juego
│   ├── Mapas/          # Mapas del juego (Tiled)
│   ├── sprites/        # Sprites y animaciones
│   └── static/         # Assets estáticos (enemigos, logros, etc.)
├── style/              # Hojas de estilo CSS
├── includes/           # Archivos de configuración compartida
└── vendor/             # Dependencias de Composer

```

---

##  Estructura de Carpetas

### Raíz

- `index.php` - Punto de entrada principal (autenticación y registro)
- `composer.json` - Dependencias del proyecto

### `/controller`

- `jugadoresC.php` - Controlador de jugadores (registro, login)

### `/model`

- `jugadoresM.php` - Modelo de datos de jugadores

### `/view`

- `catalogo.php` - Página de inicio/login
- `juego.php` - Interfaz principal del juego
- `registro.php` - Formulario de registro
- `proceso.php` - Página de procesamiento

### `/admin`

Panel de administración con acceso restringido:

- **controller/usuariosC.php** - Gestión de usuarios
- **model/usuariosM.php** - Datos de usuarios
- **view/** - Vistas administrativas (dashboard, estadísticas, logros, etc.)

### `/api`

Endpoints de API REST para comunicación cliente-servidor:

- `obtener_usuario.php` - Datos del jugador actual
- `obtener_logros.php` - Logros desbloqueados
- `obtener_objetos.php` / `obtener_objetosJ.php` - Inventario
- `obtener_escenarios.php` - Mapas disponibles
- `guardar_logro_usuario.php` - Guardar logro desbloqueado
- `guardar_objeto_usuario.php` - Guardar objeto en inventario
- `actualizar_puntos.php` - Actualizar puntuación

### `/assets`

**Mapas** (Tiled):

- `bosque.json` / `BosqueFuente.tmx` - Escena del bosque
- `Nosale.tmx` - Otra escena
- `EscenaPeleaSlime.tmj` - Escena de combate

**Sprites y Animaciones** (Aseprite):

- `gato.ase` - Personaje gato
- `mago.ase` - Personaje mago
- `espada.ase` / `espejo.ase` - Objetos
- `SlimeFuego.ase` / `SlimeMorado.ase` - Enemigos
- Múltiples animaciones de movimiento y acciones

**Assets Estáticos**:

- `static/Animaciones/` - Animaciones del juego
- `static/Audios/` - Efectos de sonido y música
- `static/Botones/` - Elementos de UI
- `static/Enemigos/` - Sprites de enemigos
- `static/Logros/` - Imágenes de logros
- `static/Lugares/` - Fondos y escenarios
- `static/Sprites/` - Sprites de personajes

### `/js/Scenes`

Escenas del juego (Phaser Scenes):

- `EscenaBosque.js`, `EscenaBosque2.js` - Escenas del bosque
- `EscenaCabanaAdentro.js`, `EscenaCabanaAfuera.js` - Casa
- `EscenaCasaAbandonada.js`, `EscenaCastilloIfernal.js` - Mazmorras
- `EscenaCementerio.js` - Cementerio
- `EscenaFinal.js` - Escena final

### `/style`

Hojas de estilo CSS:

- `style.css` - Estilos principales
- `formulario.css` - Estilos de formularios
- `registro.css` - Estilos de registro
- `catalogo.css` - Estilos del catálogo
- Otros estilos temáticos

---

##  Configuración e Instalación

### Requisitos Previos

- **XAMPP** (o Apache + PHP 7.4+ + MySQL)
- **PHP >= 7.4** con extensiones:
  - `pdo_mysql`
  - `json`
  - `mbstring`
- **MySQL >= 5.7** o **MariaDB >= 10.2**
- **Composer** (para instalar PHPMailer)

### Pasos de Instalación

1. **Clonar o descargar el proyecto**

   ```bash
   # Si está en XAMPP
   cd c:\xampp\htdocs\Juego
   ```

2. **Instalar dependencias**

   ```bash
   composer install
   ```

3. **Crear la base de datos**

   ```sql
   CREATE DATABASE videojuego;
   ```

4. **Configurar conexión a base de datos**
   - Editar: `admin/includes/config.php` y `admin/includes/database.php`
   - Parámetros por defecto:
     ```php
     DB_HOST: localhost
     DB_USER: root
     DB_PASS: (vacío por defecto)
     DB_NAME: videojuego
     ```

5. **Crear estructura de base de datos**
   - Importar tablas (se necesitaría archivo SQL con el esquema)
   - Tablas necesarias: usuarios, logros, objetos_usuarios, puntos, etc.

6. **Acceder a la aplicación**
   ```
   http://localhost/Juego/
   ```

---

##  Características Principales

### Para Jugadores

-  **Sistema de Registro y Login** - Crear cuenta y autenticarse
-  **Juego Interactivo** - Aventura con múltiples escenas
-  **Sistema de Logros** - Desbloquear logros al completar objetivos
-  **Inventario** - Recolectar y guardar objetos
-  **Puntuación** - Sistema de puntos que se actualiza en tiempo real
-  **Múltiples Escenas** - Bosques, castillos, cementerios, etc.
-  **Combate** - Escenas de batalla contra enemigos
-  **Recuperación de Contraseña** - Sistema de reseteo vía email

### Para Administradores

-  **Gestión de Usuarios** - Ver, editar, eliminar jugadores
-  **Panel de Estadísticas** - Métricas del juego
-  **Gestión de Logros** - Crear y modificar logros
-  **Gestión de Escenarios** - Administrar mapas
-  **Dashboard** - Vista general del sistema
-  **Control de Acceso** - Sistema de roles (rol admin = 1)

---

##  API Endpoints

### Obtener Información

| Endpoint                      | Método | Descripción                      |
| ----------------------------- | ------ | -------------------------------- |
| `/api/obtener_usuario.php`    | GET    | Datos del usuario autenticado    |
| `/api/obtener_logros.php`     | GET    | Logros desbloqueados del usuario |
| `/api/obtener_objetos.php`    | GET    | Objetos disponibles en el juego  |
| `/api/obtener_objetosJ.php`   | GET    | Objetos del jugador (inventario) |
| `/api/obtener_escenarios.php` | GET    | Lista de escenarios/mapas        |
| `/api/obtener_dialogos.php`   | GET    | Diálogos de NPCs                 |

### Guardar/Actualizar

| Endpoint                          | Método | Descripción                       |
| --------------------------------- | ------ | --------------------------------- |
| `/api/guardar_logro_usuario.php`  | POST   | Registrar logro desbloqueado      |
| `/api/guardar_objeto_usuario.php` | POST   | Guardar objeto en inventario      |
| `/api/actualizar_puntos.php`      | POST   | Actualizar puntuación del jugador |

---

##  Estado del Proyecto

### En proceso


### Conocidos/Pendientes

- Falta documentar esquema completo de base de datos
- Falta agregar tests automatizados
- Mejorar validación de entrada (CSRF tokens, sanitización)
- Implementar HTTPS en producción
- Aumentar cobertura de error handling
- Falta terminar las animaciones de cada sprite

---

##  Seguridad

### Consideraciones Importantes

-  El proyecto actualmente está en desarrollo local
-  Las credenciales de BD están hardcodeadas (usar variables de entorno en producción)
-  Implementar validación CSRF en formularios
-  Usar sesiones seguras (httponly, secure flags)
-  Sanitizar todas las entradas de usuario
-  Implementar logs de auditoría para admin

---


##  Notas de Desarrollo

### Archivos Importantes

- `admin/includes/config.php` - Configuración centralizada de constantes
- `admin/includes/database.php` - Clase de conexión a BD
- `includes/config.php` - Configuración del juego
- `includes/database.php` - Clase Database principal

### Convenciones

- **Controladores**: Sufijo `C` (ej: `jugadoresC.php`)
- **Modelos**: Sufijo `M` (ej: `jugadoresM.php`)
- **Vistas**: Nombradas descriptivamente
- **Escenas Phaser**: Prefijo `Escena` (ej: `EscenaBosque.js`)

### Variables Globales de Configuración

```php
ROOT_PATH      // Ruta raíz del proyecto
BASE_URL       // URL base (http://localhost/Juego/)
APP_NAME       // Nombre de app: "SerEstrella"
ADMIN_ROLE     // ID de rol admin: 1
```

---

##  Recursos Útiles

- [Phaser 3 Documentation](https://photonstorm.github.io/phaser3-docs/)
- [Tiled Map Editor](https://www.mapeditor.org/)
- [PHP Documentation](https://www.php.net/docs.php)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [PHPMailer Documentation](https://github.com/PHPMailer/PHPMailer)

---

**Última actualización**: Abril 2026
**Versión del proyecto**: En desarrollo (v0.x)
