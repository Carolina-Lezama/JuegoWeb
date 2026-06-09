<?php
session_start();
// Capturamos cualquier error que el controlador (jugadoresC.php) haya guardado en la sesión
$error = $_SESSION['error_login'] ?? null;
unset($_SESSION['error_login']); // Limpiamos el error para que no se muestre al recargar
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar Sesión - PIXEL DCY Studio</title>
    
    <link rel="stylesheet" href="../style/formulario.css">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">
</head>

<body>

<main class="login-screen">

    <a href="catalogo.php" class="btn-catalogo" aria-label="Regresar al catálogo">← Regresar a Catálogo</a>

    <section class="registro-container">
        <h2>Iniciar Sesión</h2>

        <?php if ($error): ?>
            <div class="error-message" role="alert" style="color: #ff4d4d; margin-bottom: 15px; text-align: center;">
                <?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="../index.php?action=login">
            
            <div class="form-group">
                <label for="correo">Correo electrónico</label>
                <input type="email" id="correo" name="correo" autocomplete="username" required autofocus>
            </div>

            <div class="form-group">
                <label for="contrasena">Contraseña</label>
                <input type="password" id="contrasena" name="contrasena" autocomplete="current-password" required>
            </div>

            <button type="submit" class="btn-submit">Iniciar sesión</button>

            <div class="form-footer" style="margin-top: 15px; text-align: center;">
                <a href="registro.php" class="registro-link">¿No tienes cuenta? Regístrate</a>
            </div>

        </form>
    </section>

</main>

</body>
</html>