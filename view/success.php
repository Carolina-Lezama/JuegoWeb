<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro exitoso</title>
    <meta http-equiv="refresh" content="2;url=inicio.php">
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; display: flex; align-items: center; justify-content: center; height: 100vh; }
        .msg { background: #fff; padding: 32px 24px; border-radius: 8px; box-shadow: 0 2px 8px #0002; text-align: center; }
    </style>
</head>
<body>
    <div class="msg">
        <h2>¡Registro exitoso!</h2>
        <p>Redirigiendo a la página de inicio de sesión...</p>
    </div>
    <script>
        setTimeout(function() {
            window.location.href = 'view/inicio.php';
        }, 2000);
    </script>
</body>
</html>