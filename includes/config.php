<?php
// 1. Cargar el autoloader de Composer para habilitar phpdotenv
require_once __DIR__ . '/../vendor/autoload.php';

// 2. Inicializar y cargar las variables de entorno
$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__));
$dotenv->safeLoad(); // safeLoad no rompe el servidor si el archivo .env llega a faltar

// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Basic configuration
define('ROOT_PATH', dirname(__DIR__));
// Usamos coalescencia (??) para dar un valor por defecto seguro si la variable no existe
define('BASE_URL', $_ENV['BASE_URL'] ?? 'http://localhost/Juego/');
define('APP_NAME', $_ENV['APP_NAME'] ?? 'Como ser heroe');

// Other paths
define('ASSETS_PATH', BASE_URL . 'assets/');
define('INCLUDES_PATH', ROOT_PATH . '/includes/');

// Admin paths
define('ADMIN_PATH', ROOT_PATH . '/admin/');
define('ADMIN_URL', BASE_URL . 'admin/');
define('ADMIN_ASSETS', ADMIN_URL . 'src/assets/');
define('ADMIN_INCLUDES', ADMIN_PATH . 'src/includes/');

define('ADMIN_ROLE', 1);

// Manejador de errores
function handleError($errno, $errstr, $errfile, $errline) {
    $error = [
        'success' => false,
        'message' => 'Error en el servidor',
        'debug' => [
            'error' => $errstr,
            'file' => $errfile,
            'line' => $errline
        ]
    ];
    ob_clean(); 
    header('Content-Type: application/json');
    echo json_encode($error);
    exit;
}
set_error_handler('handleError');

function require_login() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    if (!isset($_SESSION['usuario'])) {
        // Si es una petición API, responde un JSON 401 en lugar de redireccionar
        if (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'No autorizado']);
            exit;
        }
        header('Location: inicio.php');
        exit;
    }
}

//  SMTP Configuration Protegida desde el archivo .env
define('SMTP_HOST', $_ENV['SMTP_HOST'] ?? 'smtp.gmail.com');
define('SMTP_PORT', (int)($_ENV['SMTP_PORT'] ?? 587));
define('SMTP_USER', $_ENV['SMTP_USER'] ?? '');
define('SMTP_PASSWORD', $_ENV['SMTP_PASSWORD'] ?? '');
define('SMTP_FROM_NAME', APP_NAME);

