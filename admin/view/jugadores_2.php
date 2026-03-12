<?php
session_start();
require_once __DIR__ . '/../includes/config.php';
require_login();

require_once __DIR__ . '/../includes/database.php';

$database = new Database();
$db = $database->connect();

$error = "";

/* ==========================
   ELIMINAR JUGADOR
========================== */

if(isset($_POST['eliminar_id'])){

$id = intval($_POST['eliminar_id']);

try{

$stmt = $db->prepare("DELETE FROM jugadores WHERE id=?");
$stmt->execute([$id]);

header("Location: jugadores_2.php");
exit;

}catch(Exception $e){

$error="Error al eliminar jugador";

}

}


/* ==========================
   ACTUALIZAR NIVEL Y PUNTOS
========================== */

if(isset($_POST['editar_id'])){

$id = intval($_POST['editar_id']);
$nivel = intval($_POST['nivel']);
$puntos = intval($_POST['puntos']);

$stmt = $db->prepare("
UPDATE jugadores
SET nivel=?, puntos=?
WHERE id=?
");

$stmt->execute([$nivel,$puntos,$id]);

header("Location: jugadores_2.php");
exit;

}


/* ==========================
   BUSCAR
========================== */

$buscar = $_GET['buscar'] ?? "";

if($buscar!=""){

$stmt = $db->prepare("
SELECT *
FROM jugadores
WHERE nombre_jugador LIKE ?
ORDER BY id DESC
");

$stmt->execute(["%$buscar%"]);

}else{

$stmt = $db->query("
SELECT *
FROM jugadores
ORDER BY id DESC
");

}

$jugadores = $stmt->fetchAll(PDO::FETCH_ASSOC);

?>

<!DOCTYPE html>
<html lang="es">

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Gestión de jugadores</title>

<link rel="stylesheet" href="css/admin.css">
<link rel="stylesheet" href="css/jugadores_2.css">
<link rel="stylesheet" href="css/fuentes.css">

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

</head>

<body>

<?php include __DIR__ . '/../includes/sidebar.php'; ?>

<div class="jugadores-container">

<h1>Gestión de jugadores</h1>


<form class="busqueda">

<input type="text" name="buscar" placeholder="Buscar jugador..." value="<?php echo htmlspecialchars($buscar); ?>">

<button type="submit">
<i class="bi bi-search"></i>
</button>

</form>


<table class="tabla-jugadores">

<thead>

<tr>

<th>ID</th>
<th>Jugador</th>
<th>Email</th>
<th>Nivel</th>
<th>Puntos</th>
<th>Editar</th>
<th>Eliminar</th>

</tr>

</thead>

<tbody>

<?php foreach($jugadores as $j){ ?>

<tr>

<td><?php echo $j['id']; ?></td>

<td><?php echo htmlspecialchars($j['nombre_jugador']); ?></td>

<td><?php echo htmlspecialchars($j['email']); ?></td>


<form method="post">

<td>

<input type="number" name="nivel" value="<?php echo $j['nivel']; ?>" min="1">

</td>

<td>

<input type="number" name="puntos" value="<?php echo $j['puntos']; ?>" min="0">

</td>

<td>

<input type="hidden" name="editar_id" value="<?php echo $j['id']; ?>">

<button class="editar">
<i class="bi bi-save"></i>
</button>

</td>

</form>


<td>

<form method="post" onsubmit="return confirm('¿Eliminar jugador?');">

<input type="hidden" name="eliminar_id" value="<?php echo $j['id']; ?>">

<button class="eliminar">
<i class="bi bi-trash"></i>
</button>

</form>

</td>

</tr>

<?php } ?>

</tbody>

</table>

</div>

</body>
</html>