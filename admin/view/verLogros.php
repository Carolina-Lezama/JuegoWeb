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

        if ($img && file_exists(__DIR__ . "/../../assets/static/Logros/" . $img)) {
            unlink(__DIR__ . "/../../assets/static/Logros/" . $img);
        }

        header("Location: verLogros.php");
        exit;

    } catch (Exception $e) {
        $error = "Error al eliminar logro: " . $e->getMessage();
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
<link rel="stylesheet" href="css/verLogros.css">
<link rel="stylesheet" href="css/fuentes.css">

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

<script src="js/funcion.js"></script>

</head>

<body>

<?php include __DIR__ . '/../includes/sidebar.php'; ?>

<div class="logros-container">

<div class="tabla-container">

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

echo '<td>'.
($img ?
'<img src="/Juego/assets/static/Logros/'.htmlspecialchars($img).'" class="img-logro">'
:'').
'</td>';

}

else if($col === 'eliminar'){

echo '<td>

<form method="post" onsubmit="return confirm(\'¿Eliminar logro?\');">

<input type="hidden" name="eliminar_logro_id" value="'.$logro['id'].'">

<button type="submit" class="btn-eliminar">
<i class="bi bi-trash"></i>
</button>

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

echo '<tr><td colspan="8">No hay logros registrados</td></tr>';

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