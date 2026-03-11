<?php
require_once __DIR__ . '/../includes/config.php';
session_start();
require_login();

$user = htmlspecialchars($_SESSION['usuario']);
$correo = isset($_SESSION['correo']) ? htmlspecialchars($_SESSION['correo']) : '';
$panel = $_SESSION['panel'] ?? 'creador';
$materno= isset($_SESSION['apellido_materno']) ? htmlspecialchars($_SESSION['apellido_materno']) : '';
$paterno= isset($_SESSION['apellido_paterno']) ? htmlspecialchars($_SESSION['apellido_paterno']) : '';
$telefono= isset($_SESSION['telefono']) ? htmlspecialchars($_SESSION['telefono']) : '';
$nombres= isset($_SESSION['nombres']) ? htmlspecialchars($_SESSION['nombres']) : '';
?>

<?php
require_once __DIR__ . '/../includes/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $id_usuario = $_SESSION['id'];

    $nombre = trim($_POST['nombre'] ?? '');
    $paterno = trim($_POST['apellido_paterno'] ?? '');
    $materno = trim($_POST['apellido_materno'] ?? '');
    $telefono = trim($_POST['telefono'] ?? '');

    $db = (new Database())->connect();

    if ($nombre !== '') {
        $stmt = $db->prepare("UPDATE usuarios SET nombres = ? WHERE id = ?");
        $stmt->execute([$nombre, $id_usuario]);
        $_SESSION['nombres'] = $nombre;
    }

    if ($paterno !== '') {
        $stmt = $db->prepare("UPDATE usuarios SET apellido_paterno = ? WHERE id = ?");
        $stmt->execute([$paterno, $id_usuario]);
        $_SESSION['apellido_paterno'] = $paterno;
    }

    if ($materno !== '') {
        $stmt = $db->prepare("UPDATE usuarios SET apellido_materno = ? WHERE id = ?");
        $stmt->execute([$materno, $id_usuario]);
        $_SESSION['apellido_materno'] = $materno;
    }

    if ($telefono !== '') {
        $stmt = $db->prepare("UPDATE usuarios SET telefono = ? WHERE id = ?");
        $stmt->execute([$telefono, $id_usuario]);
        $_SESSION['telefono'] = $telefono;
    }

    $nueva = trim($_POST['nueva_contrasena'] ?? '');
    $confirmar = trim($_POST['confirmar_contrasena'] ?? '');

    if ($nueva !== '' && $nueva === $confirmar) {

        $hash = password_hash($nueva, PASSWORD_DEFAULT);

        $stmt = $db->prepare("UPDATE usuarios SET contrasena = ? WHERE id = ?");
        $stmt->execute([$hash, $id_usuario]);

    }

    header("Location: perfil.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Perfil de Usuario</title>

<link rel="stylesheet" href="css/admin.css">
<link rel="stylesheet" href="css/perfil.css">
<link rel="stylesheet" href="css/fuentes.css">

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

<script src="js/funcion.js"></script>

</head>

<body>
<?php include __DIR__ . '/../includes/sidebar.php'; ?>

<li class="main_nav_item logout-nav-item">
<form action="cerrarS.php" method="post" style="display:inline;">
<button type="submit" class="btn-cerrar" style="width:100%;text-align:left;background:none;border:none;padding:0;font:inherit;color:inherit;cursor:pointer;">
<span class="menu-icon"><i class="bi bi-box-arrow-right"></i></span>
<span class="menu-text">Cerrar Sesión</span>
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
<p><strong>Rol: </strong><?php echo $panel; ?></p>

</div>

</div>

<div class="perfil-acciones">

<button class="btn-editar" id="btnEditarPerfil" type="button" onclick="mostrarFormEditarPerfil()">
Editar Perfil
</button>

</div>

<form id="formEditarPerfil" class="form-editar-perfil" style="display:none; margin-top:20px;" method="post" action="perfil.php">

<label>Nombre (o nombres):
<input type="text" name="nombre" maxlength="50" placeholder="<?php echo $nombres; ?>">
</label><br><br>

<label>Apellido paterno:
<input type="text" name="apellido_paterno" maxlength="30" placeholder="<?php echo $paterno; ?>">
</label><br><br>

<label>Apellido materno:
<input type="text" name="apellido_materno" maxlength="30" placeholder="<?php echo $materno; ?>">
</label><br><br>

<label>Telefono:
<input name="telefono" type="tel" maxlength="10" pattern="[0-9]{10}" title="Debe contener 10 dígitos." placeholder="<?php echo $telefono; ?>">
</label><br><br>

<label>Nueva contraseña:
<input type="password" name="nueva_contrasena" minlength="8">
</label><br><br>

<label>Confirmar nueva contraseña:
<input type="password" name="confirmar_contrasena" minlength="8">
</label><br><br>

<button type="submit" class="btn-editar">Guardar</button>

<button type="button" class="btn-cerrar" id="cancelarEditarPerfil" onclick="cancelarFormEditarPerfil()">
Cancelar
</button>

</form>

</div>

</div>

</main>

<script>
if (typeof initSidebarAutoClose === 'function') {
initSidebarAutoClose();
}
</script>

</body>
</html>