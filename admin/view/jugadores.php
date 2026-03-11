<?php
session_start();
require_once __DIR__ . '/../includes/config.php';
require_login();

$user = htmlspecialchars($_SESSION['usuario']);

$jugadores = [];

try {
    require_once __DIR__ . '/../includes/database.php';

    $database = new Database();
    $db = $database->connect();

    $stmt = $db->query("SELECT id, nombre_jugador, email, fecha_registro, fecha_nacimiento, genero, nivel, puntos FROM jugadores");

    $jugadores = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (Exception $e) {

    $error = 'Error al consultar la base de datos: ' . $e->getMessage();
}

$columnas = [
'id' => 'ID',
'nombre_jugador' => 'Usuario',
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

<title>Lista de jugadores</title>

<link rel="stylesheet" href="css/admin.css">
<link rel="stylesheet" href="css/jugadores.css">
<link rel="stylesheet" href="css/fuentes.css">

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

<script src="js/funcion.js"></script>

</head>

<body>

<?php include __DIR__ . '/../includes/sidebar.php'; ?>

<main class="main-content-jugadores">

<h2>Lista de jugadores registrados</h2>

<?php
if (!empty($error)) {
echo '<div class="mensaje-error">' . $error . '</div>';
}
?>

<div class="tabla-jugadores-container">

<table class="tabla-jugadores">

<thead>

<tr>
<?php
foreach($columnas as $col => $nombre){
echo '<th>' . htmlspecialchars($nombre) . '</th>';
}
?>
</tr>

</thead>

<tbody>

<?php

if (count($jugadores) > 0) {

foreach($jugadores as $jugador){

echo '<tr>';

foreach($columnas as $col => $nombre){

echo '<td>' . htmlspecialchars($jugador[$col] ?? '') . '</td>';

}

echo '</tr>';

}

}else{

echo '<tr>';

foreach($columnas as $col => $nombre){
echo '<td></td>';
}

echo '</tr>';

}

?>

</tbody>

</table>

</div>

</main>

<script>

if (typeof initSidebarAutoClose === 'function') {
initSidebarAutoClose();
}

</script>

</body>

</html>