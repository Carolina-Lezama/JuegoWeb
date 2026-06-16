<?php
// 1. Forzamos formato JSON
header('Content-Type: application/json');

// 2. Cargamos el núcleo
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/database.php';

// Aseguramos que la sesión esté iniciada
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 3. Bloqueo estricto de métodos HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método HTTP no permitido. Use POST.']);
    exit;
}

// 4. 🔥 MANEJO DE INVITADOS: Si no está logueado, le damos un "falso positivo" al frontend
if (!isset($_SESSION['usuario']) || !isset($_SESSION['id'])) {
    // Le decimos al juego "Todo bien", para que Phaser proceda a guardarlo en el localStorage
    echo json_encode([
        'success' => true, 
        'mensaje' => 'Logro procesado en modo local (Invitado)'
    ]);
    exit;
}

// 5. Validación del Payload de entrada
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['logro_id']) || !is_numeric($input['logro_id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'ID de logro inválido o faltante']);
    exit;
}

$logro_id = (int)$input['logro_id'];
$jugador_id = (int)$_SESSION['id'];

try {
    $db = new Database();
    $pdo = $db->connect();

    // 6. 🔥 INSERT IGNORE: La magia de delegar la validación a la base de datos.
    // Si la combinación (jugador_id, logro_id) ya existe gracias a la llave UNIQUE,
    // MySQL omite la inserción silenciosamente sin generar excepción.
    $stmt = $pdo->prepare('INSERT IGNORE INTO logros_jugador (jugador_id, logro_id) VALUES (?, ?)');
    $stmt->execute([$jugador_id, $logro_id]);

    // rowCount() será 1 si se insertó uno nuevo, o 0 si fue ignorado por duplicado
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'success' => true, 
            'mensaje' => '¡Nuevo logro desbloqueado y guardado!'
        ]);
    } else {
        echo json_encode([
            'success' => true, 
            'mensaje' => 'El jugador ya poseía este logro. No se realizaron cambios.'
        ]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => 'No se pudo registrar el logro debido a un error del servidor.'
    ]);
}