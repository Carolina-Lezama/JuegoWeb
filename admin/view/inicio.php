<!doctype html>
<html lang="es">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Inicio de sesión</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="title" content="Inicio de sesión" />
    <link rel="stylesheet" href="css/inicio.css" />
    <link rel="stylesheet" href="css/fuentes.css" />
    <script src="js/funcion.js"></script>
  </head>
  <body>
    <div class="login-container">
      <form class="login-form" action="../index.php?action=buscar" method="POST">
        <h2 class="login-title">Iniciar sesión</h2>
        <div class="form-group">
          <label for="usuario">Usuario</label>
          <input id="usuario" name="usuario" type="text" class="form-control" placeholder="Ingresa tu usuario" required />
        </div>
        <div class="form-group">
          <label for="contrasena">Contraseña</label>
          <input id="contrasena" name="contrasena" type="password" class="form-control" placeholder="Ingresa tu contraseña" required />
        </div>
        <button type="submit" class="btn-login">Iniciar sesión</button>
        <p class="login-link"><a href="recuperacion.php">Olvidé mi contraseña</a></p>
      </form>
    </div>
  </body>
</html>
