<?php
session_start();
require_once __DIR__ . '/../includes/config.php';
require_login();
$user = htmlspecialchars($_SESSION['usuario']);
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Logros en el juego</title>
    <link rel="stylesheet" href="css/home.css">
    <link rel="stylesheet" href="css/logros.css">
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
  <div class="logros-flex-container">
    <div class="main-content-logros">
      <h2 class="centrar">Crear logros</h2>
      <form class="formulario" action="logros.php" method="post" enctype="multipart/form-data">
        <label>Nombre del logro:
            <input type="text" name="nombre_logro" maxlength="70" required>
        </label><br><br>
        <label>Descripción del logro:
            <textarea name="descripcion_logro" maxlength="120" rows="3" required></textarea>
        </label><br><br>
        <label>Imagen del logro:
            <input type="file" name="imagen_logro" accept="image/*" required>
        </label><br><br>
        <label>Tipo de logro:
            <select name="recompensa_logro" required>
                <option value="novato">Novato</option>
                <option value="avanzado">Avanzado</option>
                <option value="maestro">Maestro</option>
            </select>
        </label><br><br>
        <label>Cantidad de puntos a dar:</label>
        <input type="number" name="puntos_logro" min="0" required>
        <br><br>
        <button type="submit" class="guardar" name="submit">Guardar diálogos</button>
      </form>
    </div>
    <div class="tabla-logros-container">
      <h2>Logros guardados</h2>
      <?php
      $logros = [];
      try {
        require_once __DIR__ . '/../includes/database.php';
        $database = new Database();
        $db = $database->connect();
        $stmt = $db->query("SELECT id, nombre, descripcion, imagen, tipo, puntos, usuarios_id FROM logros");
        $logros = $stmt->fetchAll(PDO::FETCH_ASSOC);
      } catch (Exception $e) {
        $error = 'Error al consultar la base de datos: ' . $e->getMessage();
      }
      $columnas = [
        'eliminar' => '' ,
        'id' => 'ID',
        'nombre' => 'Nombre',
        'descripcion' => 'Descripción',
        'imagen' => 'Imagen',
        'tipo' => 'Tipo',
        'puntos' => 'Puntos',
        'usuarios_id' => 'Usuario',
        
      ];
      ?>
      <?php if (!empty($error)) { echo '<div class="mensaje-error">' . $error . '</div>'; } ?>
      <table class="tabla-logros">
        <thead>
          <tr>
            <?php foreach($columnas as $col => $nombre) { echo '<th>' . htmlspecialchars($nombre) . '</th>'; } ?>
          </tr>
        </thead>
        <tbody>
          <?php if (count($logros) > 0) {
            foreach($logros as $logro) { echo '<tr>';
              foreach($columnas as $col => $nombre) {
                if ($col === 'imagen') {
                  echo '<td>' . ($logro[$col] ? '<img src="../../assets/' . htmlspecialchars($logro[$col]) . '" alt="' . htmlspecialchars($logro['nombre']) . '" style="max-width:60px;max-height:60px;">' : '') . '</td>';
                } else if ($col === 'eliminar') {
                  echo '<td>
                          <form method="post" onsubmit="return confirm(\'¿Estás seguro de eliminar este logro?\');">
                            <input type="hidden" name="eliminar_logro_id" value="' . $logro['id'] . '">
                              <button type="submit" class="eliminar" title="Eliminar">
                                Eliminar
                              </button>
                          </form>
                        </td>';
                } else {
                  echo '<td>' . htmlspecialchars($logro[$col]) . '</td>';
                }
              }
              echo '</tr>';
            }
          } else {
            echo '<tr>';
            foreach($columnas as $col => $nombre) { echo '<td></td>'; }
            echo '</tr>';
          } ?>
        </tbody>
      </table>
    </div>
  </div>
  
</body>
</html>

<?php
if (isset($_POST["submit"])) { //si se envio el formulario y es post
    $usuario = isset($_SESSION['usuario']) ? $_SESSION['usuario'] : 'user';
    $id_usuario = isset($_SESSION['id']) ? $_SESSION['id'] : '0'; 
    $carpeta_destino = __DIR__ . "/../../assets/"; // Carpeta assets en la raíz
    $db = null;
    $id_usuario_valido = is_numeric($id_usuario) ? $id_usuario : '0';
    $exito = false;
    try {
        require_once __DIR__ . '/../includes/database.php';
        $database = new Database();
        $db = $database->connect();
    } catch (Exception $e) {
        echo "Error de conexión a la base de datos: " . $e->getMessage();
        exit;
    }
    // Obtener datos del formulario
    $nombre = isset($_POST['nombre_logro']) ? trim($_POST['nombre_logro']) : '';
    $descripcion = isset($_POST['descripcion_logro']) ? trim($_POST['descripcion_logro']) : '';
    $tipo = isset($_POST['recompensa_logro']) ? trim($_POST['recompensa_logro']) : '';
    $puntos = isset($_POST['puntos_logro']) ? intval($_POST['puntos_logro']) : 0;
    $imagen_nombre = '';
    // Procesar imagen de logro
    if (isset($_FILES['imagen_logro']) && $_FILES['imagen_logro']['error'] === UPLOAD_ERR_OK) {
        $tmp_name = $_FILES['imagen_logro']['tmp_name'];
        $extension = strtolower(pathinfo($_FILES['imagen_logro']['name'], PATHINFO_EXTENSION));
        // Obtener el número de logro para este usuario
        $stmt2 = $db->prepare("SELECT COUNT(*) FROM logros WHERE usuarios_id = ?");
        $stmt2->execute([$id_usuario_valido]);
        $num_logros = $stmt2->fetchColumn() + 1;
        $imagen_nombre = "logro_" . $id_usuario_valido . "_" . $num_logros . "." . $extension;
        $destino = $carpeta_destino . $imagen_nombre;
        $permitidos = ['jpg', 'jpeg', 'png'];
        if (!in_array($extension, $permitidos)) {
            echo "<div class='mensaje-error'>Formato de imagen no permitido. Solo jpg, jpeg, png.</div>";
            exit;
        }
        if (!move_uploaded_file($tmp_name, $destino)) {
            echo "<div class='mensaje-error'>No se pudo guardar la imagen.</div>";
            exit;
        }
    }
    // Insertar en la base de datos
    $sql = "INSERT INTO logros (nombre, descripcion, imagen, tipo, puntos, usuarios_id) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt3 = $db->prepare($sql);
    if ($stmt3->execute([$nombre, $descripcion, $imagen_nombre, $tipo, $puntos, $id_usuario_valido])) {
        $exito = true;
    } else {
        echo "<div class='mensaje-error'>No se pudo guardar el logro en la base de datos.</div>";
    }
    if ($exito) {
        echo "<script>
                setTimeout(function(){ window.location.href = window.location.pathname; } , 500);
              </script>";
        exit;
    }
}

if (isset($_POST['eliminar_logro_id'])) {
    $id_eliminar = intval($_POST['eliminar_logro_id']);
    try {
        require_once __DIR__ . '/../includes/database.php';
        $database = new Database();
        $db = $database->connect();
        // Obtener nombre de imagen para borrar archivo
        $stmt = $db->prepare("SELECT imagen FROM logros WHERE id = ?");
        $stmt->execute([$id_eliminar]);
        $img = $stmt->fetchColumn();
        // Eliminar de la base de datos
        $stmt = $db->prepare("DELETE FROM logros WHERE id = ?");
        if ($stmt->execute([$id_eliminar])) {
            if ($img && file_exists(__DIR__ . "/../../assets/" . $img)) {
                unlink(__DIR__ . "/../../assets/" . $img);// Eliminar archivo de imagen
            }
            echo "<script>setTimeout(function(){ window.location.href = window.location.pathname; }, 300);</script>";
            exit;
        } else {
            echo "<div class='mensaje-error'>No se pudo eliminar el logro.</div>";
        }
    } catch (Exception $e) {
        echo "<div class='mensaje-error'>Error al eliminar: " . $e->getMessage() . "</div>";
    }
}
?>


