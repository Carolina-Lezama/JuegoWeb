<?php
// 1. Forzamos la respuesta en formato JSON
header('Content-Type: application/json');

// 2. Cargamos la configuración global y la base de datos
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/database.php';

// Aseguramos que la sesión esté abierta
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 3. 🔥 LÓGICA HÍBRIDA: Protección sin errores violentos
if (!isset($_SESSION['usuario']) || !isset($_SESSION['id'])) {
    // Es un invitado. En lugar de un 401, devolvemos un inventario vacío con éxito.
    // Esto permite que el frontend de Phaser continúe su ejecución y lea el localStorage.
    echo json_encode([
        'success' => true,
        'data' => [],
        'mensaje' => 'Modo invitado activo'
    ]);
    exit;
}

$jugadorId = (int)$_SESSION['id'];

try {
    // 4. Conexión limpia mediante la clase segura
    $db = new Database();
    $pdo = $db->connect();

    // 5. Extraemos el inventario personal del jugador
    $stmt = $pdo->prepare('SELECT * FROM objetos_jugador WHERE jugadores_id = ?');
    $stmt->execute([$jugadorId]);
    
    // fetchAll() ya devuelve un array asociativo gracias a la configuración global de database.php
    $objetosJugador = $stmt->fetchAll();

    // 6. Respondemos con la misma estructura (success + data) para mantener la consistencia
    echo json_encode([
        'success' => true,
        'data' => $objetosJugador
    ]);

} catch (Exception $e) {
    // Solo devolvemos error 500 si la base de datos realmente falla
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'No se pudo recuperar el inventario del jugador'
    ]);
}