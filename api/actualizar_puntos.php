<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../includes/database.php'; // Tu clase Database

try {
    // Conectar usando tu clase Database
    $db = new Database();
    $pdo = $db->connect();

    // Leer datos del body
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['email']) || !isset($input['puntos'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Faltan parámetros']);
        exit;
    }

    $email = trim($input['email']);
    $puntos = (int)$input['puntos'];

    // Ejecutar el UPDATE
    $stmt = $pdo->prepare("UPDATE jugadores SET puntos = :puntos WHERE email = :email");
    $stmt->bindValue(':puntos', $puntos, PDO::PARAM_INT);
    $stmt->bindValue(':email', $email, PDO::PARAM_STR);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'puntos' => $puntos]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'No se encontró el jugador o los puntos ya son iguales',
            'debug_email' => $email
        ]);
    }

    $db->disconnect();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
