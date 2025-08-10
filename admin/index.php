<?php
require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/controller/usuariosC.php';
$action = $_GET['action'] ?? 'form';

if ($action === 'buscar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $controller = new BuscarController();
    $controller->buscar();
} else {
    require_once dirname(BASE_URL) . '/inicio.php';
}



