<?php
ini_set('display_errors', 0);
error_reporting(0);
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../includes/database.php';

$id_usuario = isset($_SESSION['id']) ? $_SESSION['id'] : '';

if (!$id_usuario || !is_numeric($id_usuario)) {// Validar que el ID de usuario sea numérico
    echo json_encode(['error' => 'ID de usuario no válido']); 
    exit;
}

try {
    $database = new Database();
    $db = $database->connect();
    $stmt = $db->prepare('SELECT * FROM escenarios WHERE usuario_id = ?');
    $stmt->execute([$id_usuario]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($data);
} catch (Exception $e) {
    echo json_encode(['error' => 'Error en la consulta']);
}
?>