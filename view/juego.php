<?php
session_start();
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/database.php';

// Valores iniciales seguros
$nivel = $_SESSION['nivel'] ?? '1';
$puntos = $_SESSION['puntos'] ?? '0';
$nombre_jugador = $_SESSION['nombre_jugador'] ?? null;
$es_usuario = isset($_SESSION['id']) ? '1' : '0';
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PIXEL DCY Studio - Juego</title>

    <link rel="stylesheet" href="../style/style.css">

    <script src="../js/phaser.min.js"></script>
    <script src="../js/juego.js"></script> <script type="module" src="../js/main.js"></script> </head>

<body data-usuario="<?php echo $es_usuario; ?>">

<header class="main-header">
    <h1>PIXEL DCY STUDIO</h1>

    <div class="header-sections">
        
        <div class="game-info">
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
            <div class="game-tags">
                <span class="tag">Acción</span>
                <span class="tag">Aventura</span>
            </div>
        </div>

        <div class="player-stats">
            <div class="stat-item">
                <span class="stat-label">Nivel</span>
                <span class="stat-value" id="nivel-display"><?php echo htmlspecialchars($nivel); ?></span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Exp</span>
                <span class="stat-value" id="puntos-display"><?php echo htmlspecialchars($puntos); ?></span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Logros</span>
                <span class="stat-value" id="logros-count">0</span>
            </div>
        </div>

        <div class="user-info">
            <?php if ($nombre_jugador): ?>
                <img class="icono-jugador" src="../assets/style/registrado.png" alt="Usuario Activo">
                <span><?php echo htmlspecialchars($nombre_jugador); ?> (Activo)</span>
            <?php else: ?>
                <img class="icono-jugador" src="../assets/style/invitado.png" alt="Invitado">
                <span>Invitado</span>
            <?php endif; ?>
        </div>
    </div>
</header>

<main class="layout">

    <aside class="sidebar left">
        <h3>Jugador</h3>
        <p>Nombre: <?php echo htmlspecialchars($nombre_jugador ?? 'Invitado'); ?></p>
        <p>Nivel: <span id="sidebar-nivel"><?php echo htmlspecialchars($nivel); ?></span></p>
        <p>Puntos: <span id="sidebar-puntos"><?php echo htmlspecialchars($puntos); ?></span></p>
    </aside>

    <section class="game-container">
        <div id="game"></div>
    </section>

    <aside class="sidebar right">
        <h3>Opciones</h3>
        <button id="btnReiniciar" class="btn-opcion">Reiniciar</button>
        <button id="btnSalir" class="btn-opcion btn-salir">Salir</button>
    </aside>

</main>

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

<section class="logros-section">
    <h2>🏆 Logros</h2>
    <div id="logros-container" class="logros-grid">
        </div>
</section>

<footer class="game-footer">
    <div class="footer-bottom">
        <p>&copy; <?php echo date('Y'); ?> PIXEL DCY STUDIO. Todos los derechos reservados.</p>
    </div>
</footer>

</body>
</html>