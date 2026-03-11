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
if (!isset($input['objeto_id']) || !is_numeric($input['objeto_id'])) {
    echo json_encode(['error' => 'ID de objeto inválido']);
    exit;
}
$objeto_id = intval($input['objeto_id']);
$jugador_id = intval($_SESSION['id']);

try {
    $db = (new Database())->connect();
    // Verifica si ya existe ese objeto para el usuario
    $stmt = $db->prepare('SELECT id FROM objetos_jugador WHERE jugadores_id = ? AND objetos_id = ?');
    $stmt->execute([$jugador_id, $objeto_id]);
    if ($stmt->fetch()) {
        echo json_encode(['ok' => true, 'mensaje' => 'Ya posees este objeto']);
        exit;
    }
    // Inserta el objeto para el usuario
    $stmt = $db->prepare('INSERT INTO objetos_jugador (jugadores_id, objetos_id, usos) VALUES (?, ?, 0)');
    $stmt->execute([$jugador_id, $objeto_id]);
    echo json_encode(['ok' => true, 'mensaje' => 'Objeto guardado']);
} catch (Exception $e) {
    echo json_encode(['error' => 'Error en la base de datos']);
}
