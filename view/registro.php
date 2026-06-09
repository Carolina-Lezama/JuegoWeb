<?php
session_start();
// Capturamos posibles errores enviados por el controlador al intentar registrar
$error = $_SESSION['error_registro'] ?? null;
unset($_SESSION['error_registro']);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro de usuario - PIXEL DCY Studio</title>
    <link rel="stylesheet" href="../style/registro.css">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body>

<main class="registro-container">
    <a href="catalogo.php" class="btn-catalogo" aria-label="Regresar al catálogo">← Regresar a Catálogo</a>

    <section class="form-wrapper">
        <h2 id="form-title">Registro de Jugador</h2>
        
        <?php if ($error): ?>
            <div class="error-message" role="alert" style="color: #ff4d4d; margin-bottom: 15px; text-align: center;">
                <?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?>
            </div>
        <?php endif; ?>

        <form id="form-registro" method="POST" action="../index.php?action=submit">
            <div id="registro-fields">
                
                <div class="form-group">
                    <label for="jugador">Nombre de usuario</label>
                    <input type="text" id="jugador" name="jugador" autocomplete="username" required autofocus>
                </div>

                <div class="form-group">
                    <label for="correo">Correo electrónico</label>
                    <input type="email" id="correo" name="correo" autocomplete="email" required>
                </div>

                <div class="form-group">
                    <label for="contrasena">Contraseña</label>
                    <input type="password" id="contrasena" name="contrasena" autocomplete="new-password" minlength="6" required>
                </div>

                <div class="form-group">
                    <label for="contrasenaconfirmacion">Confirmar contraseña</label>
                    <input type="password" id="contrasenaconfirmacion" name="contrasenaconfirmacion" autocomplete="new-password" minlength="6" required>
                </div>
                
            </div>
            <button type="submit" id="main-submit" class="btn-submit">Registrarse</button>
        </form>
    </section>
</main>

</body>
</html>