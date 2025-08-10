<?php
session_start();
require_once __DIR__ . '/../includes/config.php';
require_login();//requerir estar logueado
$user = htmlspecialchars($_SESSION['usuario']);//convertir a caracteres html


$jugadores = [];
try {
    require_once __DIR__ . '/../includes/database.php';
    $database = new Database();
    $db = $database->connect();
    $stmt = $db->query("SELECT id, nombre_usuario, email, fecha_registro, fecha_nacimiento, genero, nivel, puntos FROM jugadores");
    $jugadores = $stmt->fetchAll(PDO::FETCH_ASSOC);//guardo mis jugadores en un array
} catch (Exception $e) {
    $error = 'Error al consultar la base de datos: ' . $e->getMessage();
}
$columnas = [//db y tabla
    'id' => 'ID',
    'nombre_usuario' => 'Usuario',
    'email' => 'Correo electrónico',
    'fecha_registro' => 'Fecha de registro',
    'fecha_nacimiento' => 'Fecha de nacimiento',
    'genero' => 'Género',
    'nivel' => 'Nivel',
    'puntos' => 'Puntos'
];
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de jugadores registrados</title>
    <link rel="stylesheet" href="css/home.css">
    <link rel="stylesheet" href="css/jugadores.css">
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
  <main class="main-content-jugadores">
    <h2>Lista de jugadores registrados</h2>
    <?php if (!empty($error)) { echo '<div class="mensaje-error">' . $error . '</div>'; } //si hay error?>
    <div class="tabla-jugadores-container">
      <table class="tabla-jugadores">
        <thead>
          <tr>
            <?php foreach($columnas as $col => $nombre) { echo '<th>' . htmlspecialchars($nombre) . '</th>'; }//campos ?>
          </tr>
        </thead>
        <tbody>
          <?php if (count($jugadores) > 0) {//el array si tiene algo
            foreach($jugadores as $jugador) { echo '<tr>';//crear fila para cada jugador
              foreach($columnas as $col => $nombre) {// en cada iteracion: col=llave, nombre=valor
                echo '<td>' . htmlspecialchars($jugador[$col]) . '</td>';//colocar en orden de obtención
              }
              echo '</tr>'; }
          } else {
            echo '<tr>';
            foreach($columnas as $col => $nombre) { echo '<td></td>'; }//mostrar la tabla pero vacia
            echo '</tr>';
          } ?>
        </tbody>
      </table>
    </div>
  </main>
</body>
</html>
