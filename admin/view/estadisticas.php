<?php
session_start();
require_once __DIR__ . '/../includes/config.php';
require_login();

require_once __DIR__ . '/../includes/database.php';

$database = new Database();
$db = $database->connect();

/* =============================
LOGROS MÁS DESBLOQUEADOS
============================= */

$stmt = $db->query("
SELECT l.nombre, COUNT(lj.id_logro) total
FROM logros_jugador lj
JOIN logros l ON lj.id_logro = l.id
GROUP BY l.id
ORDER BY total DESC
LIMIT 5
");

$logros = $stmt->fetchAll(PDO::FETCH_ASSOC);


/* =============================
OBJETOS MÁS OBTENIDOS
============================= */

$stmt = $db->query("
SELECT o.nombre_objeto, COUNT(oj.objetos_id) total
FROM objetos_jugador oj
JOIN objetos o ON oj.objetos_id = o.id
GROUP BY o.id
ORDER BY total DESC
LIMIT 5
");

$objetos = $stmt->fetchAll(PDO::FETCH_ASSOC);


/* =============================
JUGADORES POR NIVEL
============================= */

$stmt = $db->query("
SELECT nivel, COUNT(*) total
FROM jugadores
GROUP BY nivel
ORDER BY nivel
");

$niveles = $stmt->fetchAll(PDO::FETCH_ASSOC);


/* =============================
REGISTROS POR MES
============================= */

$stmt = $db->query("
SELECT DATE_FORMAT(fecha_registro,'%Y-%m') mes, COUNT(*) total
FROM jugadores
GROUP BY mes
ORDER BY mes
");

$registros = $stmt->fetchAll(PDO::FETCH_ASSOC);


/* =============================
TOP PUNTUACIONES
============================= */

$stmt = $db->query("
SELECT j.nombre_jugador, SUM(p.puntos) puntos
FROM puntuacion p
JOIN jugadores j ON j.id = p.id_jugador
GROUP BY j.id
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

<title>Estadísticas del juego</title>

<link rel="stylesheet" href="css/admin.css">
<link rel="stylesheet" href="css/estadisticas.css">
<link rel="stylesheet" href="css/fuentes.css">

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

</head>

<body>

<?php include __DIR__ . '/../includes/sidebar.php'; ?>

<div class="estadisticas-container">

<h1>Estadísticas del juego</h1>

<div class="grid-estadisticas">

<div class="grafico">
<h3>Logros más desbloqueados</h3>
<canvas id="logrosChart"></canvas>
</div>

<div class="grafico">
<h3>Objetos más obtenidos</h3>
<canvas id="objetosChart"></canvas>
</div>

<div class="grafico">
<h3>Jugadores por nivel</h3>
<canvas id="nivelesChart"></canvas>
</div>

<div class="grafico">
<h3>Registros por mes</h3>
<canvas id="registroChart"></canvas>
</div>

</div>

<div class="tabla-top">

<h2>Top puntuaciones</h2>

<table>

<thead>
<tr>
<th>Jugador</th>
<th>Puntos</th>
</tr>
</thead>

<tbody>

<?php foreach($top as $t){ ?>

<tr>
<td><?php echo htmlspecialchars($t['nombre_jugador']); ?></td>
<td><?php echo $t['puntos']; ?></td>
</tr>

<?php } ?>

</tbody>

</table>

</div>

</div>


<script>

/* LOGROS */

new Chart(document.getElementById('logrosChart'),{

type:'bar',

data:{
labels: <?php echo json_encode(array_column($logros,'nombre')); ?>,
datasets:[{
data: <?php echo json_encode(array_column($logros,'total')); ?>
}]
}

});


/* OBJETOS */

new Chart(document.getElementById('objetosChart'),{

type:'bar',

data:{
labels: <?php echo json_encode(array_column($objetos,'nombre_objeto')); ?>,
datasets:[{
data: <?php echo json_encode(array_column($objetos,'total')); ?>
}]
}

});


/* NIVELES */

new Chart(document.getElementById('nivelesChart'),{

type:'pie',

data:{
labels: <?php echo json_encode(array_column($niveles,'nivel')); ?>,
datasets:[{
data: <?php echo json_encode(array_column($niveles,'total')); ?>
}]
}

});


/* REGISTROS */

new Chart(document.getElementById('registroChart'),{

type:'line',

data:{
labels: <?php echo json_encode(array_column($registros,'mes')); ?>,
datasets:[{
data: <?php echo json_encode(array_column($registros,'total')); ?>
}]
}

});

</script>

</body>
</html>