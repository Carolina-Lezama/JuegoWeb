<?php
session_start();
// Destruir todas las variables de sesión
$_SESSION = array();
// Si se desea destruir la sesión completamente, también se debe borrar la cookie de sesión.
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}
// Finalmente, destruir la sesión.
session_destroy();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="2;url=inicio.php">
    <title>Sesión cerrada</title>
    <link href="css/cerrarC.css" rel="stylesheet">
</head>
<body>
    <div class="mensaje">
        <h2>¡Sesión cerrada correctamente!</h2>
        <p>Serás redirigido al inicio en unos segundos...</p>
        <p><a href="inicio.php">Ir al inicio ahora</a></p>
    </div>
</body>
</html>