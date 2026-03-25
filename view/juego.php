<?php
session_start();
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/database.php';
?>

<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Juego</title>

<link rel="stylesheet" href="/Juego/style/style.css">

<script src="/Juego/js/phaser.min.js"></script>
<script src="../js/juego.js"></script>
<script type="module" src="/Juego/js/main.js"></script>

<!-- SCRIPT PARA OPCIONES DEL SIDEBAR -->
<script>
// Variables globales para el modal
let modalConfirmado = false;
let accionEnCurso = null;

function mostrarModal(titulo, mensaje, accion) {
  const modal = document.getElementById('modalConfirmacion');
  const modalTitulo = document.getElementById('modalTitulo');
  const modalMensaje = document.getElementById('modalMensaje');
  
  modalTitulo.textContent = titulo;
  modalMensaje.textContent = mensaje;
  accionEnCurso = accion;
  modalConfirmado = false;
  
  modal.classList.add('mostrar');
}

function cerrarModal() {
  const modal = document.getElementById('modalConfirmacion');
  modal.classList.remove('mostrar');
  accionEnCurso = null;
}

document.addEventListener('DOMContentLoaded', function() {
  const btnConfirmarSi = document.getElementById('btnConfirmarSi');
  const btnConfirmarNo = document.getElementById('btnConfirmarNo');
  
  // Botón SI del modal
  btnConfirmarSi.addEventListener('click', function() {
    if (accionEnCurso === 'reiniciar') {
      location.reload();
    } else if (accionEnCurso === 'salir') {
      window.location.href = 'cerrar.php';
    }
    cerrarModal();
  });
  
  // Botón NO del modal
  btnConfirmarNo.addEventListener('click', function() {
    cerrarModal();
  });

  // Botón Reiniciar - Muestra modal personalizado
  const btnReiniciar = document.getElementById('btnReiniciar');
  if (btnReiniciar) {
    btnReiniciar.addEventListener('click', function() {
      mostrarModal('Reiniciar Juego', '¿Estás seguro de que deseas reiniciar el juego?', 'reiniciar');
    });
  }

  // Botón Salir - Muestra modal personalizado
  const btnSalir = document.getElementById('btnSalir');
  if (btnSalir) {
    btnSalir.addEventListener('click', function() {
      mostrarModal('Salir del Juego', '¿Deseas salir del juego? Se cerrará tu sesión.', 'salir');
    });
  }
});
</script>

<body data-usuario="<?php echo isset($_SESSION['id']) ? '1' : '0'; ?>">

<!-- HEADER -->
<header class="main-header">
    <h1>PIXEL DCY STUDIO</h1>

    <!-- CONTENEDOR HORIZONTAL DE SECCIONES -->
    <div class="header-sections">
        
        <!-- INFORMACIÓN DEL JUEGO -->
        <div class="game-info">
            <!-- SISTEMA DE CALIFICACIÓN -->
            <div class="rating-section">
                <div class="rating-stars">
                    <span class="star filled">★</span>
                    <span class="star filled">★</span>
                    <span class="star filled">★</span>
                    <span class="star filled">★</span>
                    <span class="star half">★</span>
                    <span class="rating-text">(4.5)</span>
                </div>
            </div>

            <!-- ETIQUETAS DEL JUEGO -->
            <div class="game-tags">
                <span class="tag">Acción</span>
                <span class="tag">Aventura</span>
            </div>
        </div>

        <!-- ESTADÍSTICAS DEL JUGADOR -->
        <div class="player-stats">
            <div class="stat-item">
                <span class="stat-label">Nivel</span>
                <span class="stat-value"><?php echo $_SESSION['nivel'] ?? '1'; ?></span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Exp</span>
                <span class="stat-value" id="puntos-display"><?php echo $_SESSION['puntos'] ?? '0'; ?></span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Logros</span>
                <span class="stat-value" id="logros-count">0</span>
            </div>
        </div>

        <!-- PROGRESO DEL JUEGO -->
        <div class="game-progress">
            <div class="progress-item">
                <span class="progress-label">Progreso</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 5%"></div>
                </div>
                <span class="progress-percent">5%</span>
            </div>
        </div>

        <!-- INFORMACIÓN DEL USUARIO -->
        <div class="user-info">
            <?php if (isset($_SESSION['nombre_jugador'])): ?>
                <img class="icono-jugador"  src="../assets/style/registrado.png" alt="">
                <span><?php echo $_SESSION['nombre_jugador']; ?> (Activo)</span>
            <?php else: ?>
                <img class="icono-jugador" src="../assets/style/invitado.png" alt="">
                <span>Invitado</span>
            <?php endif; ?>
        </div>
    </div>
</header>

<!-- CONTENIDO PRINCIPAL -->
<div class="layout">

    <!-- SIDEBAR IZQUIERDO -->
    <aside class="sidebar left">
        <h3>Jugador</h3>
        <p>Nombre: <?php echo $_SESSION['nombre_jugador'] ?? 'Invitado'; ?></p>
        <p>Nivel: <?php echo $_SESSION['nivel'] ?? '1'; ?></p>
        <p>Puntos: <?php echo $_SESSION['puntos'] ?? '0'; ?></p>
    </aside>

    <!-- JUEGO -->
    <main class="game-container">
        <div id="game"></div>
    </main>

<!-- SIDEBAR DERECHO -->
    <aside class="sidebar right">
        <h3>Opciones</h3>
        <button id="btnReiniciar" class="btn-opcion">Reiniciar</button>
        <button id="btnSalir" class="btn-opcion btn-salir">Salir</button>
    </aside>

</div>

<!-- MODALES DE CONFIRMACIÓN -->
<div id="modalConfirmacion" class="modal-overlay">
    <div class="modal-contenido">
        <h2 id="modalTitulo">Confirmación</h2>
        <p id="modalMensaje">¿Estás seguro?</p>
        <div class="modal-botones">
            <button id="btnConfirmarSi" class="btn-confirmar btn-si">Sí</button>
            <button id="btnConfirmarNo" class="btn-confirmar btn-no">No</button>
        </div>
    </div>
</div>

<!-- LOGROS -->
<section class="logros-section">
    <h2>🏆 Logros</h2>

    <div id="logros-container" class="logros-grid">
        <!-- Se llenará con JS -->
    </div>
</section>

<!-- FOOTER -->
<footer class="game-footer">
    <div class="footer-content">
        <div class="footer-section">
            <h3>PIXEL DCY STUDIO</h3>
            <p>Sumérjete en aventuras épicas y desafíos emocionantes en nuestro mundo de juegos.</p>
        </div>

        <div class="footer-section">
            <h4>Enlaces</h4>
            <ul>
                <li><a href="proceso.php">Acerca de nosotros</a></li>
                <li><a href="proceso.php">Contacto</a></li>
                <li><a href="proceso.php">Términos de servicio</a></li>
                <li><a href="proceso.php">Política de privacidad</a></li>
            </ul>
        </div>

        <div class="footer-section">
            <h4>Comunidad</h4>
            <ul>
                <li><a href="proceso.php">Discord</a></li>
                <li><a href="proceso.php">Twitter</a></li>
                <li><a href="proceso.php">YouTube</a></li>
                <li><a href="proceso.php">Instagram</a></li>
            </ul>
        </div>

        <div class="footer-section">
            <h4>Soporte</h4>
            <ul>
                <li><a href="proceso.php">Centro de ayuda</a></li>
                <li><a href="proceso.php">Reportar problema</a></li>
                <li><a href="proceso.php">Sugerencias</a></li>
                <li><a href="proceso.php">FAQ</a></li>
            </ul>
        </div>
    </div>

    <div class="footer-bottom">
        <p>&copy; 2026 PIXEL DCY STUDIO. Todos los derechos reservados.</p>
    </div>
</footer>

</body>
</html>


