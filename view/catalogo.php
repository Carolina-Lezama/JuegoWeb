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

// ==============================================================
// 2. CONSUMO DE API EXTERNA (FreeToGame)
// ==============================================================
$juegos_externos = [];
$api_url = "https://www.freetogame.com/api/games?sort-by=popularity";

// Usamos cURL que es más seguro y profesional en PHP para consumir APIs
if (function_exists('curl_init')) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $api_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Evita problemas de certificados en localhost
    $respuesta_api = curl_exec($ch);
    curl_close($ch);
} else {
    // Respaldo por si cURL no está activo en tu servidor
    $respuesta_api = @file_get_contents($api_url);
}

// Si la API respondió correctamente, procesamos los datos
if ($respuesta_api) {
    $datos_api = json_decode($respuesta_api, true);
    
    // Validamos que sea un arreglo válido
    if (is_array($datos_api)) {
        // Tomamos solo los primeros 6 juegos para no saturar tu página
        $top_juegos_api = array_slice($datos_api, 0, 6);
        
        foreach ($top_juegos_api as $juego_api) {
            // Transformamos los datos de la API para que encajen con tu formato
            $juegos_externos[] = [
                'url' => $juego_api['game_url'], // URL oficial del juego
                'img' => $juego_api['thumbnail'], // Imagen de portada
                'titulo' => $juego_api['title'],
                'genero' => $juego_api['genre'],
                // Convertimos el género a minúsculas y agregamos 'externo' para tus filtros JS
                'categorias' => strtolower($juego_api['genre']) . ' externo'
            ];
        }
    }
}

// 3. Unimos los juegos de tu BD con los juegos traídos de la API
$catalogo_completo = array_merge($juegos, $juegos_externos);

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
    <?php foreach ($catalogo_completo as $juego): ?>
        <a href="<?php echo htmlspecialchars($juego['url']); ?>" class="game-link" <?php echo (strpos($juego['url'], 'http') === 0) ? 'target="_blank"' : ''; ?>>
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