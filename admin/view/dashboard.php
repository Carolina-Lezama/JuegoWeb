<?php
session_start();
require_once __DIR__ . '/../includes/config.php';
require_login();

require_once __DIR__ . '/../includes/database.php';

$database = new Database();
$db = $database->connect();

/* =============================
   ESTADÍSTICAS GENERALES
============================= */

$total_usuarios = $db->query("SELECT COUNT(*) FROM usuarios")->fetchColumn();

$total_jugadores = $db->query("SELECT COUNT(*) FROM jugadores")->fetchColumn();

$total_logros = $db->query("SELECT COUNT(*) FROM logros")->fetchColumn();

$total_logros_desbloqueados = $db->query("SELECT COUNT(*) FROM logros_jugador")->fetchColumn();

$total_objetos = $db->query("SELECT COUNT(*) FROM objetos")->fetchColumn();

$total_objetos_obtenidos = $db->query("SELECT COUNT(*) FROM objetos_jugador")->fetchColumn();

$total_puntos = $db->query("SELECT SUM(puntos) FROM puntuacion")->fetchColumn();

/* =============================
   TOP JUGADORES
============================= */

$stmt = $db->query("
SELECT nombre_jugador, nivel, puntos
FROM jugadores
ORDER BY puntos DESC
LIMIT 5
");

$top = $stmt->fetchAll(PDO::FETCH_ASSOC);

?>

<!DOCTYPE html>
<html lang="es">

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Dashboard</title>

<link rel="stylesheet" href="css/admin.css">
<link rel="stylesheet" href="css/dashboard.css">
<link rel="stylesheet" href="css/fuentes.css">

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

</head>

<body>

<?php include __DIR__ . '/../includes/sidebar.php'; ?>

<div class="dashboard-container">

<h1>Panel de Administración</h1>

<div class="cards">

<div class="card">
<i class="bi bi-person"></i>
<h3>Usuarios</h3>
<p><?php echo $total_usuarios; ?></p>
</div>

<div class="card">
<i class="bi bi-controller"></i>
<h3>Jugadores</h3>
<p><?php echo $total_jugadores; ?></p>
</div>

<div class="card">
<i class="bi bi-trophy"></i>
<h3>Logros</h3>
<p><?php echo $total_logros; ?></p>
</div>

<div class="card">
<i class="bi bi-award"></i>
<h3>Logros obtenidos</h3>
<p><?php echo $total_logros_desbloqueados; ?></p>
</div>

<div class="card">
<i class="bi bi-box"></i>
<h3>Objetos</h3>
<p><?php echo $total_objetos; ?></p>
</div>

<div class="card">
<i class="bi bi-bag"></i>
<h3>Objetos obtenidos</h3>
<p><?php echo $total_objetos_obtenidos; ?></p>
</div>

<div class="card">
<i class="bi bi-star"></i>
<h3>Puntos totales</h3>
<p><?php echo $total_puntos ?? 0; ?></p>
</div>

</div>


<div class="ranking">

<h2>Top jugadores</h2>

<table>

<thead>
<tr>
<th>Jugador</th>
<th>Nivel</th>
<th>Puntos</th>
</tr>
</thead>

<tbody>

<?php foreach($top as $j){ ?>

<tr>
<td><?php echo htmlspecialchars($j['nombre_jugador']); ?></td>
<td><?php echo $j['nivel']; ?></td>
<td><?php echo $j['puntos']; ?></td>
</tr>

<?php } ?>

</tbody>

</table>

</div>

</div>

</body>
</html>