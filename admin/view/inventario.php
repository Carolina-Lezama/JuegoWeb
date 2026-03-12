<?php
session_start();
require_once __DIR__ . '/../includes/config.php';
require_login();

require_once __DIR__ . '/../includes/database.php';

$database = new Database();
$db = $database->connect();

$error = "";

/* ==========================
ACTUALIZAR USOS
========================== */

if(isset($_POST['editar_id'])){

$id = intval($_POST['editar_id']);
$usos = intval($_POST['usos']);

$stmt = $db->prepare("
UPDATE objetos_jugador
SET usos=?
WHERE id=?
");

$stmt->execute([$usos,$id]);

header("Location: inventario.php");
exit;

}


/* ==========================
ELIMINAR OBJETO
========================== */

if(isset($_POST['eliminar_id'])){

$id = intval($_POST['eliminar_id']);

$stmt = $db->prepare("
DELETE FROM objetos_jugador
WHERE id=?
");

$stmt->execute([$id]);

header("Location: inventario.php");
exit;

}


/* ==========================
FILTRO POR JUGADOR
========================== */

$filtro = $_GET['jugador'] ?? "";


/* ==========================
CONSULTA INVENTARIO
========================== */

$sql = "
SELECT 
oj.id,
j.nombre_jugador,
o.nombre_objeto,
o.rareza,
oj.usos
FROM objetos_jugador oj
JOIN jugadores j ON j.id = oj.jugadores_id
JOIN objetos o ON o.id = oj.objetos_id
";

if($filtro!=""){

$sql .= " WHERE j.nombre_jugador LIKE ?";

$stmt = $db->prepare($sql);
$stmt->execute(["%$filtro%"]);

}else{

$stmt = $db->query($sql);

}

$inventario = $stmt->fetchAll(PDO::FETCH_ASSOC);

?>

<!DOCTYPE html>
<html lang="es">

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Inventario de jugadores</title>

<link rel="stylesheet" href="css/admin.css">
<link rel="stylesheet" href="css/inventario.css">
<link rel="stylesheet" href="css/fuentes.css">

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

</head>

<body>

<?php include __DIR__ . '/../includes/sidebar.php'; ?>

<div class="inventario-container">

<h1>Inventario de jugadores</h1>


<form class="busqueda">

<input type="text" name="jugador" placeholder="Buscar jugador..." value="<?php echo htmlspecialchars($filtro); ?>">

<button type="submit">
<i class="bi bi-search"></i>
</button>

</form>


<table class="tabla-inventario">

<thead>

<tr>

<th>ID</th>
<th>Jugador</th>
<th>Objeto</th>
<th>Rareza</th>
<th>Usos</th>
<th>Guardar</th>
<th>Eliminar</th>

</tr>

</thead>

<tbody>

<?php foreach($inventario as $i){ ?>

<tr>

<td><?php echo $i['id']; ?></td>

<td><?php echo htmlspecialchars($i['nombre_jugador']); ?></td>

<td><?php echo htmlspecialchars($i['nombre_objeto']); ?></td>

<td class="rareza <?php echo $i['rareza']; ?>">
<?php echo $i['rareza']; ?>
</td>


<form method="post">

<td>

<input type="number" name="usos" value="<?php echo $i['usos']; ?>" min="0">

</td>

<td>

<input type="hidden" name="editar_id" value="<?php echo $i['id']; ?>">

<button class="editar">
<i class="bi bi-save"></i>
</button>

</td>

</form>


<td>

<form method="post" onsubmit="return confirm('¿Eliminar objeto del jugador?');">

<input type="hidden" name="eliminar_id" value="<?php echo $i['id']; ?>">

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