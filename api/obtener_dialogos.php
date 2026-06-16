<?php
// 1. Forzamos la respuesta JSON
header('Content-Type: application/json');

// 2. Cargamos el núcleo de seguridad y configuración
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/database.php';

// Aseguramos que la sesión esté iniciada
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 3. 🔥 SOPORTE INVITADO (GUEST)
if (!isset($_SESSION['usuario']) || !isset($_SESSION['id'])) {
    // Retornamos un 'data' vacío para que el frontend no falle y use los diálogos locales
    echo json_encode([
        'success' => true,
        'data' => null,
        'mensaje' => 'Modo invitado activo'
    ]);
    exit;
}

$id_usuario = (int)$_SESSION['id'];

try {
    $database = new Database();
    $pdo = $database->connect();
    
    // 4. Extracción de diálogos personalizados o guardados
    $stmt = $pdo->prepare('SELECT * FROM dialogos');
    $stmt->execute([$id_usuario]);
    
    // fetch() devuelve un solo registro (array asociativo). Si no hay, devuelve false.
    $data = $stmt->fetch();
    
    // 5. Respuesta estandarizada
    echo json_encode([
        'success' => true,
        // Si $data es false (no hay diálogos guardados), enviamos un array vacío o null
        'data' => $data ?: null 
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => 'Error al intentar recuperar los diálogos desde la base de datos.'
    ]);
}