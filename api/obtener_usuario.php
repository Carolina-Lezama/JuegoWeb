<?php
// 1. Forzamos la respuesta JSON desde el inicio
header('Content-Type: application/json');

// 2. Cargamos la configuración global (que ya maneja el session_start de forma segura)
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/database.php';

// Aseguramos que la sesión esté abierta
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 3. 🔥 LÓGICA HÍBRIDA: ¿Es un usuario registrado o un Invitado (Guest)?
if (!isset($_SESSION['usuario']) || !isset($_SESSION['id'])) {
    
    // El usuario no tiene sesión activa en el servidor -> Le creamos una SESIÓN TEMPORAL GUEST
    echo json_encode([
        'success' => true,
        'guest' => true, // Flag para que Phaser sepa que es un invitado
        'id' => 0,
        'nombre_jugador' => 'Invitado',
        'email' => 'guest@local',
        'puntos' => 0,
        'nivel' => 1
    ]);
    exit;
}

// 4. Si el usuario SÍ está autenticado, buscamos sus datos reales en la BD
$id = (int)$_SESSION['id'];

try {
    $db = new Database();
    $pdo = $db->connect();
    
    // Traemos los datos excluyendo la contraseña por seguridad
    $stmt = $pdo->prepare('SELECT id, nombre_jugador, email, puntos, nivel FROM jugadores WHERE id = ?');
    $stmt->execute([$id]);
    $user = $stmt->fetch(); // Recuerda que ya configuramos PDO::FETCH_ASSOC globalmente en database.php
    
    if ($user) {
        $user['success'] = true;
        $user['guest'] = false; // Flag de usuario registrado
        echo json_encode($user);
    } else {
        // Fallback si la sesión tiene un ID viejo que ya no existe en las tablas de MySQL
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Usuario no encontrado en el sistema']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error interno en la consulta del servidor']);
}