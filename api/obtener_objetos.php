<?php
ini_set('display_errors', 0);
error_reporting(0);
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../includes/database.php';
try {
    $database = new Database();
    $db = $database->connect();
    $stmt = $db->prepare('SELECT * FROM objetos');
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC); // Trae todas las filas
    echo json_encode($data);
} catch (Exception $e) {
    echo json_encode(['error' => 'Error en la consulta']);
}