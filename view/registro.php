<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro de usuario</title>
    <link rel="stylesheet" href="../style/formulario.css">
</head>
<body>
<div class="registro-container">
    <h2 id="form-title">Registro de Jugador</h2>
    <form id="form-registro" method="POST" action="../index.php?action=submit">
        <div id="registro-fields">
            <label for="jugador">Nombre de usuario</label>
            <input type="text" id="jugador" name="jugador" required>

            <label for="correo">Correo electrónico</label>
            <input type="email" id="correo" name="correo" required>

            <label for="contrasena">Contraseña</label>
            <input type="password" id="contrasena" name="contrasena" required>

            <label for="contrasenaconfirmacion">Confirmar contraseña</label>
            <input type="password" id="contrasenaconfirmacion" name="contrasenaconfirmacion" required>
        </div>
        <button type="submit" id="main-submit">Registrarse</button>
    </form>
</div>

</body>
</html>