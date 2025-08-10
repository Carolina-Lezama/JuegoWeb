<?php
session_start();
require_once __DIR__ . '/../includes/config.php';
require_login();
$user = htmlspecialchars($_SESSION['usuario']);

// Obtener los diálogos actuales del usuario antes de mostrar el formulario
$id_usuario = isset($_SESSION['id']) ? $_SESSION['id'] : '0';
$dialogo1 = ''; 
$dialogo2 = '';
$dialogo3 = '';

try {
    require_once __DIR__ . '/../includes/database.php';
    $database = new Database();
    $db = $database->connect();
    $stmt = $db->prepare("SELECT introduccion_uno, introduccion_dos, introduccion_tres FROM dialogos WHERE id_usuarios = ?");
    $stmt->execute([$id_usuario]);// Ejecuta la consulta para obtener los diálogos del usuario
    if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {//guardo el resultado en $row
        $dialogo1 = $row['introduccion_uno'];//busco el campo en row y luego lo asigno a mis dialogos vacios
        $dialogo2 = $row['introduccion_dos'];
        $dialogo3 = $row['introduccion_tres'];
    }
} catch (Exception $e) {}// Si hay error los campos quedan vacíos
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subir diálogos del juego</title>
    <link rel="stylesheet" href="css/home.css">
    <link rel="stylesheet" href="css/dialogos.css">
    <link rel="stylesheet" href="css/fuentes.css">
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
  <main class="main-content">
    <h2 class="centrar">Diálogos cambiables en el juego</h2>
    <form class="formulario" action="dialogos.php" method="post">
        <label>Diálogo para primer escena de la Historia:
            <textarea name="dialogo_escena1" maxlength="160" rows="3"><?php echo htmlspecialchars($dialogo1); ?></textarea>
        </label><br><br>
        <label>Diálogo para segunda escena de la Historia:
            <textarea name="dialogo_escena2" maxlength="160" rows="3"><?php echo htmlspecialchars($dialogo2); ?></textarea>
        </label><br><br>
        <label>Diálogo para tercera escena de la Historia:
            <textarea name="dialogo_escena3" maxlength="160" rows="3"><?php echo htmlspecialchars($dialogo3); ?></textarea>
        </label><br><br>
        <button type="submit" class="guardar" name="submit">Guardar diálogos</button>
    </form>
  </main>
</body>
</html>

<?php
if (isset($_POST["submit"])) {
    $usuario = isset($_SESSION['usuario']) ? $_SESSION['usuario'] : 'user';
    $id_usuario = isset($_SESSION['id']) ? $_SESSION['id'] : '0'; 
    $dialogo1 = isset($_POST['dialogo_escena1']) ? trim($_POST['dialogo_escena1']) : '';
    $dialogo2 = isset($_POST['dialogo_escena2']) ? trim($_POST['dialogo_escena2']) : '';
    $dialogo3 = isset($_POST['dialogo_escena3']) ? trim($_POST['dialogo_escena3']) : '';
    $exito = false;
    try {
        require_once __DIR__ . '/../includes/database.php';
        $database = new Database();
        $db = $database->connect();
        $stmt = $db->prepare("UPDATE dialogos SET introduccion_uno = ?, introduccion_dos = ?, introduccion_tres = ? WHERE id_usuarios = ?");
        $stmt->execute([$dialogo1, $dialogo2, $dialogo3, $id_usuario]);
        $exito = true;//para que solo recargue una vez y se muestern los resultados
    } catch (Exception $e) {
        echo "<div class='mensaje-error'>Error al guardar: " . htmlspecialchars($e->getMessage()) . "</div>";
    }
    if ($exito) {
        echo "<script>setTimeout(function(){ window.location.href = window.location.pathname; } , 500);</script>";
        //evita que caiga en bucle recarga, cada .5s, recarga la misma pagina sin parametros en la url
        exit;
    }
}
?>

