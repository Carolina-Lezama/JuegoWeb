<?php
session_start();
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/database.php';
$mensaje = '';
if (!isset($_SESSION['correo_recuperacion'])) {
    header('Location: recuperacion.php');//generar el codigo
    exit();
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nueva = isset($_POST['nueva']) ? trim($_POST['nueva']) : '';// del formulario
    $confirmar = isset($_POST['confirmar']) ? trim($_POST['confirmar']) : '';
    if ($nueva && $confirmar) {
        if ($nueva === $confirmar) {//comparacion
            try {
                $database = new Database();
                $db = $database->connect();
                $hash = password_hash($nueva, PASSWORD_DEFAULT);//encriptar
                $stmt = $db->prepare("UPDATE usuarios SET contrasena = ? WHERE correo = ?");
                $stmt->execute([$hash, $_SESSION['correo_recuperacion']]);
                unset($_SESSION['codigo_recuperacion']);//quitarlas de la sesion
                unset($_SESSION['correo_recuperacion']);
                $mensaje = "<div class='mensaje-exito'>¡Contraseña actualizada correctamente! <a href='inicio.php'>Iniciar sesión</a></div>";
            } catch (Exception $e) {
                $mensaje = "<div class='mensaje-error'>Error al actualizar: " . htmlspecialchars($e->getMessage()) . "</div>";
            }
        } else {
            $mensaje = "<div class='mensaje-error'>Las contraseñas no coinciden.</div>";
        }
    } else {
        $mensaje = "<div class='mensaje-error'>Completa ambos campos.</div>";
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cambiar contraseña</title>
    <link rel="stylesheet" href="css/inicio.css">
    <link rel="stylesheet" href="css/fuentes.css">
</head>
<body>
    <div class="login-container">
      <form class="login-form" action="" method="POST">
        <h3 class="login-title">Cambia tu contraseña</h3>
        <div class="form-group">
          <label for="nueva">Nueva contraseña</label>
          <input id="nueva" name="nueva" type="password" class="form-control" required />
        </div>
        <div class="form-group">
          <label for="confirmar">Confirmar contraseña</label>
          <input id="confirmar" name="confirmar" type="password" class="form-control" required />
        </div>
        <button type="submit" class="btn-login">Guardar contraseña</button>
      </form>
      <?php if ($mensaje) { echo $mensaje; } ?>
    </div>
</body>
</html>
