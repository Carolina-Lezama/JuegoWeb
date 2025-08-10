<?php
require_once __DIR__ . '/../includes/config.php';
session_start();
require_login();
$user = htmlspecialchars($_SESSION['usuario']);
$correo = isset($_SESSION['correo']) ? htmlspecialchars($_SESSION['correo']) : ''; 
$rol = isset($_SESSION['rol']) ? htmlspecialchars($_SESSION['rol']) : ''; 
$materno= isset($_SESSION['apellido_materno']) ? htmlspecialchars($_SESSION['apellido_materno']) : ''; 
$paterno= isset($_SESSION['apellido_paterno']) ? htmlspecialchars($_SESSION['apellido_paterno']) : ''; 
$telefono= isset($_SESSION['telefono']) ? htmlspecialchars($_SESSION['telefono']) : ''; 
$nombres= isset($_SESSION['nombres']) ? htmlspecialchars($_SESSION['nombres']) : ''; 
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Perfil de Usuario</title>
    <link rel="stylesheet" href="css/home.css">
    <link rel="stylesheet" href="css/perfil.css">
    <link rel="stylesheet" href="css/fuentes.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <script src="js/funcion.js"></script>
</head>
<body>
  <button class="menu-toggle" onclick="document.querySelector('.panel-sidebar').classList.toggle('open')">☰</button>
  <div class="perfil-main-flex">
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
  </div>
  <main class="main-content">
        <div class="main-content-perfil" id="mainContentPerfil">
      <div class="perfil-container">
        <div class="perfil-header">
          <h2>Mi Perfil</h2>
        </div>
        <div class="perfil-info">
          <div class="perfil-datos">
            <p><strong>Usuario: </strong><?php echo $user; ?></p>
            <p><strong>Correo electronico: </strong> <?php echo $correo; ?></p>
            <p><strong>Rol: </strong><?php echo $rol; ?></p>
          </div>
        </div>
        <div class="perfil-acciones">
          <button class="btn-editar" id="btnEditarPerfil" type="button" onclick="mostrarFormEditarPerfil()">Editar Perfil</button>
        </div>
        <form id="formEditarPerfil" class="form-editar-perfil" style="display:none; margin-top:20px;" method="post" action="perfil.php">
          <label>Nombre (o nombres):
            <input type="text" name="nombre" maxlength="50" placeholder=<?php echo $nombres; ?>>
          </label><br><br>
          <label>Apellido paterno:
            <input type="text" name="apellido_paterno" maxlength="30" placeholder=<?php echo $paterno; ?>>
          </label><br><br>
          <label>Apellido materno:
            <input type="text" name="apellido_materno" maxlength="30" placeholder=<?php echo $materno; ?>>
          </label><br><br>
          <label>Telefono:
            <input name="telefono" type="tel" maxlength="10" pattern="[0-9]{10}" title="Debe contener 10 dígitos." placeholder=<?php echo $telefono; ?> >
          </label><br><br>
            <label>Nueva contraseña:
              <input type="password" name="nueva_contrasena" minlength="8" >  
            </label><br><br>
            <label>Confirmar nueva contraseña:
              <input type="password" name="confirmar_contrasena" minlength="8" >
            </label><br><br>
          <button type="submit" class="btn-editar">Guardar</button>
          <button type="button" class="btn-cerrar" id="cancelarEditarPerfil" onclick="cancelarFormEditarPerfil()">Cancelar</button>
        </form>
      </div>
    </div>
  </main>
</body>
</html>

<?php
require_once __DIR__ . '/../includes/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id_usuario = $_SESSION['id'];
    $db = (new Database())->connect();

    // Lista de campos a validar y actualizar
    $campos = [
        'nombres' => $_POST['nombre'] ?? '',
        'apellido_paterno' => $_POST['apellido_paterno'] ?? '',
        'apellido_materno' => $_POST['apellido_materno'] ?? '',
        'telefono' => $_POST['telefono'] ?? ''
    ];

    foreach ($campos as $columna => $valor) {
        $valor = trim($valor);
        if ($valor !== '') {
            // Verifica si el usuario ya existe en la tabla (opcional en este contexto)
            $stmt = $db->prepare("SELECT id FROM usuarios WHERE id = ?");
            $stmt->execute([$id_usuario]);
            if ($stmt->fetch()) {
                $sql = "UPDATE usuarios SET $columna = ? WHERE id = ?";
                $stmt2 = $db->prepare($sql);
                $stmt2->execute([$valor, $id_usuario]);
                if( $stmt2->rowCount() > 0) {
                    $_SESSION['nombres']=($_POST['nombre']!== '') ? $_POST['nombre'] : $_SESSION['nombres'];
                    $_SESSION['apellido_paterno']=($_POST['apellido_paterno']!== '') ? $_POST['apellido_paterno'] : $_SESSION['apellido_paterno'];
                    $_SESSION['apellido_materno']=($_POST['apellido_materno']!== '') ? $_POST['apellido_materno'] : $_SESSION['apellido_materno'];
                    $_SESSION['telefono']=($_POST['telefono']!== '') ? $_POST['telefono'] : $_SESSION['telefono'];
                }
            }
        }
    }

    // Manejo de contraseña
    $nueva = isset($_POST['nueva_contrasena']) ? trim($_POST['nueva_contrasena']) : '';
    $confirmar = isset($_POST['confirmar_contrasena']) ? trim($_POST['confirmar_contrasena']) : '';

    if ($nueva !== '' || $confirmar !== '') {
        if ($nueva === $confirmar) {
            $hash = password_hash($nueva, PASSWORD_DEFAULT);

            $stmt = $db->prepare("SELECT id FROM usuarios WHERE id = ?");
            $stmt->execute([$id_usuario]);

            if ($stmt->fetch()) {
                $sql = "UPDATE usuarios SET contrasena = ? WHERE id = ?";
                $stmt2 = $db->prepare($sql);
                $stmt2->execute([$hash, $id_usuario]);
            }
        } else {
            echo "<div class='mensaje-error'>Las contraseñas no coinciden.</div>";
            exit;
        }
    }

    echo "<script>setTimeout(function(){ window.location.href = window.location.pathname; }, 500);</script>";
    exit;
}
?>



