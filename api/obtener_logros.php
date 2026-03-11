<?php
ini_set('display_errors', 0);
error_reporting(0);
session_start();
header('Content-Type: application/json');
require_once __DIR__ . '/../includes/database.php';

try {
    $database = new Database();
    $db = $database->connect();
    
    // Obtener todos los logros disponibles en el juego
    $stmt = $db->prepare('SELECT * FROM logros');
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Debug: Mostrar resultados
    error_log("Logros encontrados: " . count($data));
    error_log("Datos: " . json_encode($data));
    
    // Devolver todos los logros
    echo json_encode($data);
    
} catch (Exception $e) {
    error_log("Error en obtener_logros.php: " . $e->getMessage());
    echo json_encode(['error' => 'Error en la consulta', 'detalle' => $e->getMessage()]);
}
?>