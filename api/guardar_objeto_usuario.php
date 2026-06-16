<?php
// 1. Forzamos formato JSON para la comunicación con Phaser
header('Content-Type: application/json');

// 2. Cargamos la infraestructura global de configuración y conexión
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/database.php';

// Aseguramos que la sesión esté iniciada de forma limpia
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 3. Control estricto del método HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método HTTP no permitido. Use POST.']);
    exit;
}

// 4. 🔥 SOPORTE INVITADO (GUEST): Si no hay sesión, simulamos éxito inmediato.
// Esto le da luz verde a Phaser para que proceda a persistir el ítem en el localStorage.
if (!isset($_SESSION['usuario']) || !isset($_SESSION['id'])) {
    echo json_encode([
        'success' => true,
        'mensaje' => 'Objeto procesado en modo local (Invitado)'
    ]);
    exit;
}

// 5. Procesamiento seguro del Payload recibido desde el juego
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['objeto_id']) || !is_numeric($input['objeto_id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'ID de objeto inválido o faltante']);
    exit;
}

$objeto_id = (int)$input['objeto_id'];
$jugador_id = (int)$_SESSION['id'];

try {
    $db = new Database();
    $pdo = $db->connect();

    // 6. Si ejecutaste el ALTER TABLE con la llave UNIQUE, puedes cambiar este bloque
    // por un 'INSERT IGNORE INTO objetos_jugador...' como hicimos con los logros.
    // De lo contrario, este flujo estándar integrado es 100% seguro:
    
    $stmt = $pdo->prepare('SELECT id FROM objetos_jugador WHERE jugadores_id = ? AND objetos_id = ?');
    $stmt->execute([$jugador_id, $objeto_id]);

    if ($stmt->fetch()) {
        echo json_encode([
            'success' => true,
            'mensaje' => 'El jugador ya posee este objeto'
        ]);
        exit;
    }

    // Inserción limpia utilizando los campos base
    $stmt = $pdo->prepare('INSERT INTO objetos_jugador (jugadores_id, objetos_id, usos) VALUES (?, ?, 0)');
    $stmt->execute([$jugador_id, $objeto_id]);

    echo json_encode([
        'success' => true,
        'mensaje' => 'Objeto guardado con éxito en el servidor'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'No se pudo guardar el objeto debido a un error en el servidor.'
    ]);
}