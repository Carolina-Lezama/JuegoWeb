<?php
require_once __DIR__ . '/../includes/config.php';
session_start();
require_login();

require_once __DIR__ . '/../includes/database.php';

$user = htmlspecialchars($_SESSION['usuario']);
$id_usuario = $_SESSION['id'] ?? 0;

$mensaje = "";
$error = "";

if (isset($_POST["submit"])) {

$carpeta_destino = __DIR__ . "/../../assets/";

$nombres = [
"imagen_inicio" => "inicio",
"imagen_juego" => "juego",
"imagen_puntuacion" => "puntuacion"
];

try{

$database = new Database();
$db = $database->connect();

foreach ($nombres as $input => $nombre_base) {

if (!isset($_FILES[$input]) || $_FILES[$input]['error'] !== UPLOAD_ERR_OK) {
continue;
}

$tmp_name = $_FILES[$input]['tmp_name'];

$extension = strtolower(pathinfo($_FILES[$input]['name'], PATHINFO_EXTENSION));

$permitidos = ['jpg','jpeg','png'];

if (!in_array($extension,$permitidos)) {
$error .= "Formato no permitido para $nombre_base.<br>";
continue;
}

$nombre_archivo = $nombre_base . "_" . $id_usuario . "." . $extension;

$destino = $carpeta_destino . $nombre_archivo;

if(move_uploaded_file($tmp_name,$destino)){

$columna = "";

if($nombre_base === "inicio") $columna = "e_inicio";
if($nombre_base === "juego") $columna = "e_juego";
if($nombre_base === "puntuacion") $columna = "e_puntuacion";

$stmt = $db->prepare("SELECT usuario_id FROM escenarios WHERE usuario_id=?");
$stmt->execute([$id_usuario]);

if($stmt->fetch()){

$sql = "UPDATE escenarios SET $columna=? WHERE usuario_id=?";
$stmt2 = $db->prepare($sql);
$stmt2->execute([$nombre_archivo,$id_usuario]);

}else{

$sql = "INSERT INTO escenarios (usuario_id,$columna) VALUES (?,?)";
$stmt2 = $db->prepare($sql);
$stmt2->execute([$id_usuario,$nombre_archivo]);

}

$mensaje .= "Imagen '$nombre_base' subida correctamente.<br>";

}else{

$error .= "Error al subir '$nombre_base'.<br>";

}

}

}catch(Exception $e){

$error = "Error: " . $e->getMessage();

}

}
?>

<!DOCTYPE html>
<html lang="es">

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Subir escenarios del juego</title>

<link rel="stylesheet" href="css/admin.css">
<link rel="stylesheet" href="css/imagenes.css">
<link rel="stylesheet" href="css/fuentes.css">

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

<script src="js/funcion.js"></script>

</head>

<body>

<?php include __DIR__ . '/../includes/sidebar.php'; ?>

<main class="main-content">

<h2 class="titulos">Escenarios cambiables en el juego</h2>

<?php if($mensaje){ ?>
<div class="mensaje-ok"><?php echo $mensaje; ?></div>
<?php } ?>

<?php if($error){ ?>
<div class="mensaje-error"><?php echo $error; ?></div>
<?php } ?>

<form action="imagenes.php" method="post" class="formulario" enctype="multipart/form-data">

<label>
Escenario para: Pantalla de inicio
<input type="file" name="imagen_inicio" accept="image/*">
</label>

<label>
Escenario para: Pantalla de juego
<input type="file" name="imagen_juego" accept="image/*">
</label>

<label>
Escenario para: Mostrar puntuación
<input type="file" name="imagen_puntuacion" accept="image/*">
</label>

<button type="submit" class="guardar" name="submit">
Subir imágenes
</button>

</form>

</main>

<script>

if (typeof initSidebarAutoClose === 'function') {
initSidebarAutoClose();
}

</script>

</body>
</html>