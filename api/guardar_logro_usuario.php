<?php
ini_set('display_errors', 0);
error_reporting(0);
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../includes/database.php';

if (!isset($_SESSION['id']) || !is_numeric($_SESSION['id'])) {
    echo json_encode(['error' => 'No autenticado']);
    exit;
}

// Solo acepta POST y JSON
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}
$input = json_decode(file_get_contents('php://input'), true);
if (!isset($input['logro_id']) || !is_numeric($input['logro_id'])) {
    echo json_encode(['error' => 'ID de objeto inválido']);
    exit;
}
$logro_id = intval($input['logro_id']);
$jugador_id = intval($_SESSION['id']);

try {
    $db = (new Database())->connect();
    // Verifica si ya existe ese objeto para el usuario
    $stmt = $db->prepare('SELECT id FROM logros_jugador WHERE id_jugadores = ? AND id_logro = ?');
    $stmt->execute([$jugador_id, $logro_id]);
    if ($stmt->fetch()) {
        echo json_encode(['ok' => true, 'mensaje' => 'Ya posees este logro']);
        exit;
    }
    // Inserta el objeto para el usuario
    $stmt = $db->prepare('INSERT INTO logros_jugador (jugadores_id, logro_id, usos) VALUES (?, ?, 0)');
    $stmt->execute([$jugador_id, $logro_id]);
    echo json_encode(['ok' => true, 'mensaje' => 'Logro guardado']);
} catch (Exception $e) {
    echo json_encode(['error' => 'Error en la base de datos']);
}
