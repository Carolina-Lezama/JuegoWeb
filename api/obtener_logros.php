<?php
// 1. Cabecera JSON indispensable para la comunicación con Phaser
header('Content-Type: application/json');

// 2. Cargamos el ecosistema global de configuración y conexión
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/database.php';

try {
    // 3. Conexión gestionada a través de la clase segura
    $database = new Database();
    $pdo = $database->connect();
    
    // 4. Consulta del catálogo completo de logros
    // Recomendación: Si tu tabla tiene columnas sensibles o de uso puramente interno, 
    // reemplaza el '*' por los nombres exactos (ej: 'SELECT id, nombre, descripcion, imagen')
    $stmt = $pdo->prepare('SELECT * FROM logros');
    $stmt->execute();
    
    // El FETCH_ASSOC ya viene por defecto desde database.php
    $logrosCatalogo = $stmt->fetchAll();
    
    // 5. Devolvemos el array empaquetado en nuestra estructura estándar
    echo json_encode([
        'success' => true,
        'data' => $logrosCatalogo
    ]);
    
} catch (Exception $e) {
    // 6. Manejo de excepciones silencioso hacia el cliente
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => 'No se pudo recuperar el catálogo de logros del servidor.'
    ]);
}