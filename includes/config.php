<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Basic configuration
define('ROOT_PATH', dirname(__DIR__));
define('BASE_URL', 'http://localhost/Juego/');
define('APP_NAME', 'Como ser heroe');

// Other paths
define('ASSETS_PATH', BASE_URL . 'assets/');
define('INCLUDES_PATH', ROOT_PATH . '/includes/');

// Admin paths
define('ADMIN_PATH', ROOT_PATH . '/admin/');
define('ADMIN_URL', BASE_URL . 'admin/');
define('ADMIN_ASSETS', ADMIN_URL . 'src/assets/');
define('ADMIN_INCLUDES', ADMIN_PATH . 'src/includes/');

define('ADMIN_ROLE', 1);

// menajador de errores
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
    if (!isset($_SESSION['usuario'])) {
        header('Location: inicio.php');
        exit;
    }
}

