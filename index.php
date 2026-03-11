<?php
require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/controller/jugadoresC.php';

$action = $_GET['action'] ?? '';
$controller = new RegisterController();

if ($action === 'submit' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($controller->submitForm()) {
        header('Location: view/juego.php');
        exit;
    }
} elseif ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($controller->login()) {
        header('Location: view/juego.php');
        exit;
    }
} else {
    // Si no hay acción válida, redirigir a la página de inicio de sesión/registro
    header('Location: view/inicio.php');
    exit;
}
?>



