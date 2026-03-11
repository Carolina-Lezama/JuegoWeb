<?php
session_start();
require_once __DIR__ . '/../../includes/config.php';
require_once __DIR__ . '/../includes/database.php';

$mensaje = '';
$contrasena_actualizada = false;

// Verificar que el usuario haya validado el código
if (!isset($_SESSION['correo_recuperacion'])) {
    $mensaje = "<div class='mensaje-error'>Acceso no autorizado. Por favor, completa el proceso de recuperación.</div>";
} else {
    $correo_recuperacion = $_SESSION['correo_recuperacion'];

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $contrasena = isset($_POST['contrasena']) ? trim($_POST['contrasena']) : '';
        $confirmar_contrasena = isset($_POST['confirmar_contrasena']) ? trim($_POST['confirmar_contrasena']) : '';

        // Validaciones
        if (!$contrasena || !$confirmar_contrasena) {
            $mensaje = "<div class='mensaje-error'>Por favor, completa todos los campos.</div>";
        } elseif (strlen($contrasena) < 6) {
            $mensaje = "<div class='mensaje-error'>La contraseña debe tener al menos 6 caracteres.</div>";
        } elseif ($contrasena !== $confirmar_contrasena) {
            $mensaje = "<div class='mensaje-error'>Las contraseñas no coinciden.</div>";
        } else {
            try {
                $database = new Database();
                $db = $database->connect();

                // Hash de la contraseña
                $contrasena_hash = password_hash($contrasena, PASSWORD_BCRYPT);

                // Actualizar contraseña en la BD
                $stmt = $db->prepare("UPDATE usuarios SET contrasena = ? WHERE correo = ?");
                $resultado = $stmt->execute([$contrasena_hash, $correo_recuperacion]);

                if ($resultado) {
                    $mensaje = "<div class='mensaje-exito'>¡Contraseña actualizada exitosamente! Redirigiendo al inicio de sesión...</div>";
                    $contrasena_actualizada = true;
                    
                    // Limpiar variables de sesión
                    unset($_SESSION['codigo_recuperacion']);
                    unset($_SESSION['correo_recuperacion']);
                } else {
                    $mensaje = "<div class='mensaje-error'>Error al actualizar la contraseña. Intenta nuevamente.</div>";
                }
            } catch (Exception $e) {
                $mensaje = "<div class='mensaje-error'>Error de conexión: " . htmlspecialchars($e->getMessage()) . "</div>";
            }
        }
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cambiar Contraseña</title>
    <link rel="stylesheet" href="css/inicio.css">
    <link rel="stylesheet" href="css/fuentes.css">
    <style>
        .password-requirements {
            font-size: 12px;
            color: #666;
            margin-top: 8px;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="codigo-container">
            <?php if ($contrasena_actualizada): ?>
                <script>
                    setTimeout(function() {
                        window.location.href = 'inicio.php';
                    }, 3000);
                </script>
            <?php else: ?>
                <form class="login-form" action="" method="POST">
                    <h2 class="login-title">Cambiar Contraseña</h2>
                    
                    <div class="form-group">
                        <label for="contrasena">Nueva Contraseña</label>
                        <input 
                            id="contrasena" 
                            name="contrasena" 
                            type="password" 
                            class="form-control" 
                            placeholder="Ingresa tu nueva contraseña"
                            minlength="6"
                            required />
                        <div class="password-requirements">
                            Mínimo 6 caracteres
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="confirmar_contrasena">Confirmar Contraseña</label>
                        <input 
                            id="confirmar_contrasena" 
                            name="confirmar_contrasena" 
                            type="password" 
                            class="form-control" 
                            placeholder="Confirma tu nueva contraseña"
                            minlength="6"
                            required />
                    </div>

                    <button type="submit" class="btn-login">Cambiar Contraseña</button>
                    <p class="login-link"><a href="inicio.php">Volver al inicio de sesión</a></p>
                </form>
            <?php endif; ?>
            
            <?php if ($mensaje) { echo $mensaje; } ?>
        </div>
    </div>
</body>
</html>
