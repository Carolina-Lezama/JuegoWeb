<?php
session_start();
require_once __DIR__ . '/../../includes/config.php';
require_once __DIR__ . '/../includes/database.php';

use PHPMailer\PHPMailer\PHPMailer;//crear correo
use PHPMailer\PHPMailer\Exception;//para manejar errores
require_once __DIR__ . '/../../vendor/autoload.php';

$mensaje = '';
$codigo_enviado = false;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $correo = isset($_POST['correo']) ? trim($_POST['correo']) : '';
    if ($correo) {
        try {
            $database = new Database();
            $db = $database->connect();
            $stmt = $db->prepare("SELECT correo FROM usuarios WHERE correo = ? LIMIT 1");
            $stmt->execute([$correo]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($row) {
                $correo_bd = $row['correo'];
                $codigo = rand(100000, 999999);//generacion aleatoria
                $_SESSION['codigo_recuperacion'] = $codigo;//hacer variables de sesion
                $_SESSION['correo_recuperacion'] = $correo_bd;
                $mail = new PHPMailer(true);//hacemos el correo
                try {
                    $mail->isSMTP();
                    $mail->Host = SMTP_HOST;
                    $mail->SMTPAuth = true;

                    $mail->Username = SMTP_USER;
                    $mail->Password = SMTP_PASSWORD;

                    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                    $mail->Port = SMTP_PORT;
                    $mail->CharSet = 'UTF-8';
                    $mail->setFrom(SMTP_USER, SMTP_FROM_NAME);
                    $mail->addAddress($correo_bd);//destinatario
                    $mail->isHTML(true);
                    $mail->Subject = 'Hola usuario!, este es tu código de recuperación de contraseña';
                    $mail->Body = 'Tu código de recuperación es: <b>' . $codigo . '</b>';
                    $mail->send();//mandarlo
                    $_SESSION['mensaje_exito'] = "<div class='mensaje-exito'>Se ha enviado con exito un código de recuperación a tu correo electrónico.</div>";
                    header('Location: restablecer.php');
                    exit();
                } catch (Exception $e) {
                    $mensaje = "<div class='mensaje-error'>No se pudo enviar el correo: " . htmlspecialchars($mail->ErrorInfo) . "</div>";
                }
            } else {
                $mensaje = "<div class='mensaje-error'>Correo no encontrado.</div>";
            }
        } catch (Exception $e) {
            $mensaje = "<div class='mensaje-error'>Error de conexión: " . htmlspecialchars($e->getMessage()) . "</div>";
        }
    } else {
        $mensaje = "<div class='mensaje-error'>Por favor, ingresa tu correo electrónico.</div>";
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verificación de código</title>
    <link rel="stylesheet" href="css/inicio.css">
    <link rel="stylesheet" href="css/fuentes.css">
</head>
<body>
    <div class="login-container">
      <form class="login-form" id="recuperar-form" action="" method="POST">
        <h2 class="login-title">Recuperar contraseña</h2>
        <div class="form-group">
          <label for="correo">Correo electrónico</label>
          <input id="correo" name="correo" type="email" class="form-control" placeholder="Ingresa tu correo" required />
        </div>
        <button type="submit" class="btn-login">Solicitar recuperación</button>
        <p class="login-link"><a href="inicio.php">Volver al inicio de sesión</a></p>
      </form>
      <?php if ($mensaje) { echo $mensaje; } ?>
    </div>
</body>
</html>