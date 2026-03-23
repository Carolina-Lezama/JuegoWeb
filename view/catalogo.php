<?php
session_start();
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/database.php';

$id = isset($_SESSION['id']) ? $_SESSION['id'] : '';
?>

<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>PIXEL DCY Studio - Catálogo</title>
<link rel="stylesheet" href="../style/catalogo.css">
<script type="module" src="/Juego/js/catalogo.js"></script>
</head>

<body>

<header>
<div class="header-left">
    <img src="../assets/style/logo.png" class="logo-img">
    <div class="logo">PIXEL DCY STUDIO</div>
</div>

<input type="text" placeholder="Buscar juegos..." class="search">

<nav>
<a href="catalogo.php">Inicio</a>
<a href="proceso.php">Nuevos</a>
<a href="proceso.php">Populares</a>

<?php if (isset($_SESSION['nombre_jugador'])): ?>
    
    <span class="user-active">
        <?php echo $_SESSION['nombre_jugador']; ?> (Activo)
    </span>

    <a href="cerrar.php" class="logout-link">Cerrar sesión</a>

<?php else: ?>

    <a href="inicio.php" class="login-link">Iniciar sesión</a>

<?php endif; ?>

</nav>

</header>


<section class="categories">
<button data-filter="all">Todos</button>
<button data-filter="accion">Acción</button>
<button data-filter="aventura">Aventura</button>
<button data-filter="plataformas">Plataformas</button>
<button data-filter="puzzle">Puzzle</button>
<button data-filter="retro">Retro</button>


</section>


<section class="games">

<a href="juego.php" style="text-decoration: none; color: inherit;">
<div class="game-card" data-category="accion aventura">

<img src="../assets/style/juego_4.png">
<h3>Sueños atrapados</h3>
<p>Acción</p>

</div>
</a>


<div class="game-card" data-category="retro accion">

<img src="../assets/style/juego_1.png">
<h3>Como ser heroes</h3>
<p>Aventura</p>

</div>


<div class="game-card" data-category="retro accion aventura">

<img src="../assets/style/juego_2.png">
<h3>Guerras intergalacticas</h3>
<p>Shooter</p>

</div>


<div class="game-card" data-category="plataformas puzzle">

<img src="../assets/style/juego_3.png">
<h3>Elimina la maldición</h3>
<p>Carreras</p>

</div>


<div class="game-card" data-category="accion aventura">

<img src="../assets/style/juego_5.png">
<h3>Bajo ataque zombie</h3>
<p>Survival</p>

</div>


<div class="game-card" data-category="plataformas retro">

<img src="../assets/style/juego_6.png">
<h3>Rapido y furioso</h3>
<p>RPG</p>

</div>

</section>

<footer class="footer">
    <div class="footer-content">
        <div class="footer-section">
            <h3>PIXEL DCY STUDIO</h3>
            <p>Tu destino para los mejores juegos indie y experiencias de juego únicas.</p>
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
        <p>&copy; 2024 PIXEL DCY STUDIO. Todos los derechos reservados.</p>
    </div>
</footer>

</body>
</html>
