<?php
session_start();
require_once __DIR__ . '/../includes/config.php';
require_login();

require_once __DIR__ . '/../includes/database.php';

$user = htmlspecialchars($_SESSION['usuario']);
$id_usuario = $_SESSION['id'] ?? 0;

$database = new Database();
$db = $database->connect();

$error = "";
$exito = "";

/* =====================================================
   ELIMINAR LOGRO
===================================================== */
if (isset($_POST['eliminar_logro_id'])) {

    $id_eliminar = intval($_POST['eliminar_logro_id']);

    try {

        $stmt = $db->prepare("SELECT imagen FROM logros WHERE id = ?");
        $stmt->execute([$id_eliminar]);
        $img = $stmt->fetchColumn();

        $stmt = $db->prepare("DELETE FROM logros WHERE id = ?");
        $stmt->execute([$id_eliminar]);

        if ($img && file_exists(__DIR__ . "/../../assets/Logros/" . $img)) {
            unlink(__DIR__ . "/../../assets/Logros/" . $img);
        }

        header("Location: logros.php");
        exit;

    } catch (Exception $e) {
        $error = "Error al eliminar logro: " . $e->getMessage();
    }
}


/* =====================================================
   CREAR LOGRO
===================================================== */
if (isset($_POST["submit"])) {

    $nombre = trim($_POST['nombre_logro']);
    $descripcion = trim($_POST['descripcion_logro']);
    $tipo = trim($_POST['recompensa_logro']);
    $puntos = intval($_POST['puntos_logro']);

    $imagen_nombre = "";

    $carpeta_destino = __DIR__ . "/../../assets/static/Logros/";

    if (!file_exists($carpeta_destino)) {
        mkdir($carpeta_destino, 0755, true);
    }

    if (isset($_FILES['imagen_logro']) && $_FILES['imagen_logro']['error'] === UPLOAD_ERR_OK) {

        $tmp_name = $_FILES['imagen_logro']['tmp_name'];
        $extension = strtolower(pathinfo($_FILES['imagen_logro']['name'], PATHINFO_EXTENSION));

        $permitidos = ['jpg','jpeg','png','webp'];

        if (!in_array($extension, $permitidos)) {
            $error = "Formato no permitido. Solo JPG, PNG o WEBP.";
        }
        else {

            $stmt = $db->prepare("SELECT COUNT(*) FROM logros WHERE usuarios_id = ?");
            $stmt->execute([$id_usuario]);
            $num_logros = $stmt->fetchColumn() + 1;

            $imagen_nombre = "logro_" . $id_usuario . "_" . $num_logros . "." . $extension;

            $destino = $carpeta_destino . $imagen_nombre;

            if (!move_uploaded_file($tmp_name, $destino)) {
                $error = "No se pudo guardar la imagen.";
            }
        }

    } else {
        $error = "Debes subir una imagen.";
    }

    if ($error === "") {

        try {

            $sql = "INSERT INTO logros 
            (nombre, descripcion, imagen, tipo, puntos, usuarios_id) 
            VALUES (?, ?, ?, ?, ?, ?)";

            $stmt = $db->prepare($sql);

            $stmt->execute([
                $nombre,
                $descripcion,
                $imagen_nombre,
                $tipo,
                $puntos,
                $id_usuario
            ]);

            header("Location: logros.php");
            exit;

        } catch (Exception $e) {
            $error = "Error al guardar logro: " . $e->getMessage();
        }

    }

}


/* =====================================================
   CONSULTAR LOGROS
===================================================== */

$logros = [];

try {

    $stmt = $db->query("
    SELECT id,nombre,descripcion,imagen,tipo,puntos,usuarios_id
    FROM logros
    ORDER BY id DESC
    ");

    $logros = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (Exception $e) {

    $error = "Error al consultar logros: " . $e->getMessage();

}


$columnas = [
'eliminar' => '',
'id' => 'ID',
'nombre' => 'Nombre',
'descripcion' => 'Descripción',
'imagen' => 'Imagen',
'tipo' => 'Tipo',
'puntos' => 'Puntos',
'usuarios_id' => 'Usuario'
];

?>


<!DOCTYPE html>
<html lang="es">

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Logros en el juego</title>

<link rel="stylesheet" href="css/admin.css">
<link rel="stylesheet" href="css/logros.css">
<link rel="stylesheet" href="css/fuentes.css">

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

<script src="js/funcion.js"></script>

</head>

<body>

<?php include __DIR__ . '/../includes/sidebar.php'; ?>


<div class="logros-flex-container">


<div class="main-content-logros">

<h2 class="centrar">Crear logros</h2>


<?php if ($error != "") { ?>
<div class="mensaje-error"><?php echo htmlspecialchars($error); ?></div>
<?php } ?>


<form class="formulario" action="logros.php" method="post" enctype="multipart/form-data">

<label>Nombre del logro
<input type="text" name="nombre_logro" maxlength="70" required>
</label>

<label>Descripción del logro
<textarea name="descripcion_logro" maxlength="120" rows="3" required></textarea>
</label>

<label>Imagen del logro
<input type="file" name="imagen_logro" accept="image/*" required>
</label>

<label>Tipo de logro
<select name="recompensa_logro" required>
<option value="novato">Novato</option>
<option value="avanzado">Avanzado</option>
<option value="maestro">Maestro</option>
</select>
</label>

<label>Puntos otorgados</label>
<input type="number" name="puntos_logro" min="0" required>

<button type="submit" class="guardar" name="submit">
Guardar logro
</button>

</form>

</div>



<div class="tabla-logros-container">

<h2>Logros guardados</h2>


<table class="tabla-logros">

<thead>

<tr>
<?php
foreach($columnas as $col => $nombre){
echo '<th>'.htmlspecialchars($nombre).'</th>';
}
?>
</tr>

</thead>

<tbody>

<?php

if(count($logros) > 0){

foreach($logros as $logro){

echo '<tr>';

foreach($columnas as $col => $nombre){

if($col === 'imagen'){

$img = $logro[$col];

if($img && !str_contains($img,'.')){
$img .= '.png';
}

echo '<td>'.
($img ?
'<img src="/Juego/assets/static/Logros/'.htmlspecialchars($img).'" style="max-width:60px;">'
:'').
'</td>';

}

else if($col === 'eliminar'){

echo '<td>

<form method="post" onsubmit="return confirm(\'¿Eliminar logro?\');">

<input type="hidden" name="eliminar_logro_id" value="'.$logro['id'].'">

<button type="submit" class="eliminar">Eliminar</button>

</form>

</td>';

}

else{

echo '<td>'.htmlspecialchars($logro[$col]).'</td>';

}

}

echo '</tr>';

}

}

else{

echo '<tr>';

foreach($columnas as $col=>$nombre){
echo '<td></td>';
}

echo '</tr>';

}

?>

</tbody>

</table>

</div>

</div>


<script>

if (typeof initSidebarAutoClose === 'function') {
initSidebarAutoClose();
}

</script>

</body>
</html>