<?php
require_once __DIR__ . '/../includes/config.php';
session_start();
require_login(); //reficfica que el usuario ha iniciado sesión
$user = htmlspecialchars($_SESSION['usuario']);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Panel de Administración</title>
    <link href="css/home.css" rel="stylesheet">
    <link rel="stylesheet" href="css/fuentes.css">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <script src="js/funcion.js"></script>
</head>
<body>
  <button class="menu-toggle" onclick="document.querySelector('.panel-sidebar').classList.toggle('open')">☰</button>
  <nav class="panel-sidebar">
    <ul class="main_nav_list sidebar-list">
      <li class="main_nav_item"><a href="home.php"><span class="menu-icon"><i class="bi bi-house-door"></i></span><span class="menu-text">Menu principal</span></a></li>
      <li class="main_nav_item"><a href="imagenes.php"><span class="menu-icon"><i class="bi bi-image"></i></span><span class="menu-text">Cambiar escenarios</span></a></li>
      <li class="main_nav_item"><a href="dialogos.php"><span class="menu-icon"><i class="bi bi-chat-dots"></i></span><span class="menu-text">Cambiar dialogos</span></a></li>
      <li class="main_nav_item"><a href="jugadores.php"><span class="menu-icon"><i class="bi bi-people"></i></span><span class="menu-text">Jugadores</span></a></li>
      <li class="main_nav_item"><a href="logros.php"><span class="menu-icon"><i class="bi bi-trophy"></i></span><span class="menu-text">Crear logros</span></a></li>
      <li class="main_nav_item"><a href="perfil.php"><span class="menu-icon"><i class="bi bi-person"></i></span><span class="menu-text">Perfil</span></a></li>
      <li class="main_nav_item logout-nav-item">
        <form action="cerrarS.php" method="post" style="display:inline;">
          <button type="submit" class="btn-cerrar" style="width:100%;text-align:left;background:none;border:none;padding:0;font:inherit;color:inherit;cursor:pointer;">
            <span class="menu-icon"><i class="bi bi-box-arrow-right"></i></span><span class="menu-text">Cerrar Sesión</span>
          </button>
        </form>
      </li>
    </ul>
  </nav>
  <main class="main-content" id="mainContent">
    <h2>Bienvenido, <?php echo $user; ?>!</h2>
    <p>¿Que deseas hacer hoy?</p>
  </main>

  <script>
    if (typeof initSidebarAutoClose === 'function') {
      initSidebarAutoClose();
    }
  </script>
</body>
</html>