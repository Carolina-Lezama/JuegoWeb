<?php
session_start(); //reanuda la sesión para acceder a las variables de sesión
//Hace que la variable global $_SESSION esté disponible, usada para guardar y recuperar datos entre páginas
require_once __DIR__ . '/../includes/config.php';
require_login();
$user = htmlspecialchars($_SESSION['usuario']);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subir escenarios del juego</title>
    <link rel="stylesheet" href="css/home.css">
    <link rel="stylesheet" href="css/imagenes.css">
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
  <main class="main-content">
    <h2 class="titulos">Escenarios cambiables en el juego</h2>
    <form action="imagenes.php" method="post" class="formulario"enctype="multipart/form-data">
        <label>Escenario para: Pantalla de inicio:
            <input type="file" name="imagen_inicio" accept="image/*" >
        </label><br><br>
        <label>Escenario para: Pantalla de juego:
            <input type="file" name="imagen_juego" accept="image/*" >
        </label><br><br>
        <label>Escenario para: Mostrar puntuación:
            <input type="file" name="imagen_puntuacion" accept="image/*" >
        </label><br><br>
        <button type="submit" class="azul"name="submit">Subir Imágenes</button>
    </form>
  </main>
</body>
</html>
<?php
if (isset($_POST["submit"])) { //si se envio el formulario y es post
    $usuario = isset($_SESSION['usuario']) ? $_SESSION['usuario'] : 'user';
    $id_usuario = isset($_SESSION['id']) ? $_SESSION['id'] : '0'; 
    $carpeta_destino = __DIR__ . "/../../assets/"; // Carpeta assets en la raíz
    $nombres = [
        "imagen_inicio" => "inicio",
        "imagen_juego" => "juego",
        "imagen_puntuacion" => "puntuacion"
    ];
    $db = null;
    try {
        require_once __DIR__ . '/../includes/database.php';
        $database = new Database();
        $db = $database->connect();
    } catch (Exception $e) {
        echo "Error de conexión a la base de datos: " . $e->getMessage();
        exit;
    }
    foreach ($nombres as $input => $nombre_base) { //arreglo, clave, valor
        if (!isset($_FILES[$input]) || $_FILES[$input]['error'] !== UPLOAD_ERR_OK) {
            continue;// Si no se subió, no modificar nada en la BD
            //$_FILES es un arreglo superglobal que contiene información sobre los archivos subidos mediante un formulario con enctype="multipart/form-data".
            //Por cada <input type="file" name="algo">, se genera una entrada en $_FILES["algo"].
        }
        $tmp_name = $_FILES[$input]['tmp_name']; // Nombre temporal del archivo subido
        $extension = strtolower(pathinfo($_FILES[$input]['name'], PATHINFO_EXTENSION)); //obtiene la extensión del archivo subido
        $id_usuario_valido = is_numeric($id_usuario) ? $id_usuario : '0';
        $nombre_archivo = $nombre_base . "_" . $id_usuario_valido . "." . $extension;
        $destino = $carpeta_destino . $nombre_archivo;
        $permitidos = ['jpg', 'jpeg', 'png'];
        if (!in_array($extension, $permitidos)) { // Verifica si la extensión del archivo es permitida
            echo "El archivo de $nombre_base no es un formato permitido.<br>";
            continue;
        }
        if (move_uploaded_file($tmp_name, $destino)) {//mover a la carpeta 
            echo "Imagen '$nombre_base' subida correctamente como $nombre_archivo.<br>";
            $columna = '';
            if ($nombre_base === 'inicio') $columna = 'e_inicio';
            if ($nombre_base === 'juego') $columna = 'e_juego';
            if ($nombre_base === 'puntuacion') $columna = 'e_puntuacion';
            if ($columna) {
                $stmt = $db->prepare("SELECT usuario_id FROM escenarios WHERE usuario_id = ?");
                $stmt->execute([$id_usuario_valido]);
                if ($stmt->fetch()) {
                    $sql = "UPDATE escenarios SET $columna = ? WHERE usuario_id = ?";
                    $stmt2 = $db->prepare($sql);
                    $stmt2->execute([$nombre_archivo, $id_usuario_valido]); //rempaza el valor de ?
                } else {
                    $sql = "INSERT INTO escenarios (usuario_id, $columna) VALUES (?, ?)";
                    $stmt2 = $db->prepare($sql);
                    $stmt2->execute([$id_usuario_valido, $nombre_archivo]);
                }
            }
        } else {
            echo "Error al subir la imagen '$nombre_base'.<br>";
        }
    }
}
?>
