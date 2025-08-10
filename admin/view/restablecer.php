<?php
session_start();
$mensaje = '';
if (isset($_SESSION['mensaje_exito'])) {
    $mensaje = $_SESSION['mensaje_exito'];
    unset($_SESSION['mensaje_exito']);//eliminar el mensaje de éxito de la sesión
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $codigo = isset($_POST['codigo']) ? trim($_POST['codigo']) : '';//el ingresado del formulario
    if ($codigo && isset($_SESSION['codigo_recuperacion'])) {
        if ($codigo == $_SESSION['codigo_recuperacion']) {//comparacion
            header('Location: cambiarContraseña.php');//redirigir 
            exit();
        } else {
            $mensaje = "<div class='mensaje-error'>El código ingresado no es correcto.</div>";
        }
    } else {
        $mensaje = "<div class='mensaje-error'>Por favor, ingresa el código recibido.</div>";
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Validar código</title>
    <link rel="stylesheet" href="css/inicio.css">
    <link rel="stylesheet" href="css/fuentes.css">
</head>
<body>
    <div class="login-container">
      <div class="codigo-container">
        <form class="login-form" action="" method="POST">
          <h3 class="login-title">Ingresa el código recibido</h3>
          <div class="form-group">
            <label for="codigo">Código de recuperación</label>
            <input id="codigo" name="codigo" type="text" class="form-control" maxlength="6" required />
          </div>
          <button type="submit" class="btn-login">Validar código</button>
          <p class="login-link"><a href="inicio.php">Volver al inicio de sesión</a></p>
        </form>
        <?php if ($mensaje) { echo $mensaje; } ?>
      </div>
    </div>
</body>
</html>
