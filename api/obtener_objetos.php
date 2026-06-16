<?php
// 1. Forzamos la respuesta en formato JSON para el juego
header('Content-Type: application/json');

// 2. Cargamos la infraestructura global de configuración y conexión
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/database.php';

try {
    // 3. Conexión limpia mediante nuestra clase Database
    $database = new Database();
    $pdo = $database->connect();

    // 4. Consulta optimizada para traer las estadísticas y metadata de los objetos
    // Seleccionamos campos específicos en lugar de un SELECT * por buena práctica
    $stmt = $pdo->prepare('SELECT id, nombre, descripcion, cantidad, rareza, sprite, tipo FROM objetos');
    $stmt->execute();
    
    // fetchAll() ya sabe de forma automática que debe devolver un array asociativo
    $objetosCatalogo = $stmt->fetchAll();

    // 5. Respondemos el éxito de la consulta estructurado
    echo json_encode([
        'success' => true,
        'data' => $objetosCatalogo
    ]);

} catch (Exception $e) {
    // Si la base de datos se cae o la tabla no existe, enviamos un código 500 controlado
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'No se pudo recuperar el catálogo de objetos del servidor'
    ]);
}