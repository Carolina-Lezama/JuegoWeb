<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar Sesión</title>
    <link rel="stylesheet" href="../style/formulario.css">
</head>
<body>
<div class="registro-container">
    <h2>Iniciar Sesión</h2>
    <form method="POST" action="../index.php?action=login">
        <label for="correo">Correo electrónico</label>
        <input type="email" id="correo" name="correo" autocomplete="username" required>

        <label for="contrasena">Contraseña</label>
        <input type="password" id="contrasena" name="contrasena" autocomplete="current-password" required>

        <button type="submit">Iniciar sesión</button>
        <a href="registro.php" style="display:block;text-align:center;margin-top:10px;">¿No tienes cuenta? Regístrate</a>
    </form>
</div>
</body>
</html>