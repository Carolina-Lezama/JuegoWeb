<?php
ini_set('display_errors', 0);
error_reporting(0);
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../includes/database.php';

if (!isset($_SESSION['id']) || !is_numeric($_SESSION['id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'No autenticado']);
    exit;
}
$id = $_SESSION['id'];

try {
    $db = (new Database())->connect();
    $stmt = $db->prepare('SELECT * FROM objetos_jugador WHERE jugadores_id = ?');
    $stmt->execute([$id]);
    $objetos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($objetos);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en la consulta']);
}
