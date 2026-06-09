<!-- Revisado -->
<?php
session_start();
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/database.php';

$id = $_SESSION['id'] ?? '';
$nombre_jugador = $_SESSION['nombre_jugador'] ?? null;

// Simulacro de datos traídos desde la BD (Esto facilita la escalabilidad)
$juegos = [
    [
        'url' => 'juego.php',
        'img' => '../assets/style/juego_4.png',
        'titulo' => 'Sueños atrapados',
        'genero' => 'Acción',
        'categorias' => 'accion aventura'
    ],
    [
        'url' => '#',
        'img' => '../assets/style/juego_1.png',
        'titulo' => 'Como ser heroes',
        'genero' => 'Aventura',
        'categorias' => 'retro accion'
    ],
    [
        'url' => '#',
        'img' => '../assets/style/juego_2.png',
        'titulo' => 'Guerras intergalacticas',
        'genero' => 'Shooter',
        'categorias' => 'retro accion aventura'
    ],
    [
        'url' => '#',
        'img' => '../assets/style/juego_3.png',
        'titulo' => 'Elimina la maldición',
        'genero' => 'Carreras',
        'categorias' => 'plataformas puzzle'
    ],
    [
        'url' => '#',
        'img' => '../assets/style/juego_5.png',
        'titulo' => 'Bajo ataque zombie',
        'genero' => 'Survival',
        'categorias' => 'accion aventura'
    ],
    [
        'url' => '#',
        'img' => '../assets/style/juego_6.png',
        'titulo' => 'Rapido y furioso',
        'genero' => 'RPG',
        'categorias' => 'plataformas retro'
    ]
];
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>PIXEL DCY Studio - Catálogo</title>
    <link rel="stylesheet" href="../style/catalogo.css">
    <script type="module" src="../js/catalogo.js"></script>
</head>

<body>

<header>
    <div class="header-left">
        <img src="../assets/style/logo.png" class="logo-img" alt="Logo PIXEL DCY">
        <div class="logo">PIXEL DCY STUDIO</div>
    </div>

    <input type="text" placeholder="Buscar juegos..." class="search">

    <nav>
        <a href="proceso.php">Nuevos</a>
        <a href="proceso.php">Populares</a>

        <?php if ($nombre_jugador): ?>
            <span class="user-active">
                <?php echo htmlspecialchars($nombre_jugador, ENT_QUOTES, 'UTF-8'); ?> (Activo)
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
    <?php foreach ($juegos as $juego): ?>
        <a href="<?php echo htmlspecialchars($juego['url']); ?>" class="game-link">
            <div class="game-card" data-category="<?php echo htmlspecialchars($juego['categorias']); ?>">
                <img src="<?php echo htmlspecialchars($juego['img']); ?>" alt="<?php echo htmlspecialchars($juego['titulo']); ?>">
                <h3><?php echo htmlspecialchars($juego['titulo']); ?></h3>
                <p><?php echo htmlspecialchars($juego['genero']); ?></p>
            </div>
        </a>
    <?php endforeach; ?>
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
        <p>&copy; <?php echo date('Y'); ?> PIXEL DCY STUDIO. Todos los derechos reservados.</p>
    </div>
</footer>

</body>
</html>