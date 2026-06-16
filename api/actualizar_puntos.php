<?php
// 1. Forzamos la respuesta en formato JSON para Phaser
header('Content-Type: application/json');

// 2. Cargamos la configuración global y el modelo del jugador
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../model/jugadoresM.php';

// 3. 🔥 CRÍTICO: Validamos la sesión de forma automatizada.
// Si el usuario no está logueado, esta función cortará la ejecución aquí mismo
// y le devolverá un error 401 en formato JSON limpio a Phaser.
require_login();

try {
    // 4. Leer datos del cuerpo de la petición (Body JSON)
    $input = json_decode(file_get_contents('php://input'), true);

    // Ya NO validamos el email aquí. Lo extraemos directamente de la sesión segura del servidor ($_SESSION)
    if (!isset($input['puntos'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Faltan parámetros indispensables (puntos)']);
        exit;
    }

    $emailActivo = $_SESSION['email']; // Email recuperado de forma blindada en el servidor
    $nuevosPuntos = (int)$input['puntos'];

    // 5. Instanciamos el modelo y ejecutamos la actualización validada
    $playerModel = new Jugador();
    $actualizacionExitosa = $playerModel->actualizarPuntos($emailActivo, $nuevosPuntos);

    if ($actualizacionExitosa) {
        // Sincronizamos también la variable de sesión para que refleje el cambio de inmediato
        $_SESSION['puntos'] = $nuevosPuntos;
        
        echo json_encode([
            'success' => true, 
            'puntos' => $nuevosPuntos,
            'message' => 'Puntaje sincronizado con éxito'
        ]);
    } else {
        // Nota: execute() o rowCount() pueden dar falso si mandas el mismo puntaje exacto que ya tenía
        echo json_encode([
            'success' => true, 
            'message' => 'Los puntos ya estaban actualizados o son idénticos'
        ]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => 'Error crítico en el servidor de base de datos'
    ]);
}