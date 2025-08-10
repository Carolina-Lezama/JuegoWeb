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

$id = $_SESSION['id'];

try {
    $db = (new Database())->connect();
    $stmt = $db->prepare('SELECT * FROM jugadores WHERE id = ?');
    $stmt->execute([$id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($user) {
        echo json_encode($user);
    } else {
        echo json_encode(['error' => 'Usuario no encontrado']);
    }
} catch (Exception $e) {
    echo json_encode(['error' => 'Error en la consulta']);
}
