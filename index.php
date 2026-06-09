<!-- Revisado -->
<?php
require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/controller/jugadoresC.php';

$action = $_GET['action'] ?? '';
$controller = new RegisterController();
$isPost = $_SERVER['REQUEST_METHOD'] === 'POST';

// Sistema de enrutamiento escalable
switch ($action) {
    case 'submit':
        if ($isPost && $controller->submitForm()) {
            redirect('view/catalogo.php');
        }
        break;

    case 'login':
        if ($isPost && $controller->login()) {
            redirect('view/catalogo.php');
        }
        break;

    default:
        // Fallback: Si no hay acción o falla la validación, redirige al inicio/catálogo
        redirect('view/catalogo.php');
        break;
}

/**
 * Función auxiliar para centralizar y estandarizar las redirecciones.
 */
function redirect(string $url): void {
    header("Location: $url");
    exit;
}
?>