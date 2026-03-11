<?php
require_once __DIR__ . '/../includes/config.php';
session_start();
require_login();

$user = htmlspecialchars($_SESSION['usuario']);
?>

<!DOCTYPE html>
<html lang="es">
<head>

<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Selección de Panel</title>

<link rel="stylesheet" href="css/menu.css">

<!-- Bootstrap Icons -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

</head>

<body>

<header class="topbar">

<h2>Bienvenido, <?php echo $user; ?></h2>

<form action="cerrarS.php" method="post">
<button class="logout-btn">
<i class="bi bi-box-arrow-right"></i> Cerrar sesión
</button>
</form>

</header>


<main class="menu-container">

<h1>Selecciona un panel</h1>
<p>Elige el tipo de panel al que deseas acceder</p>

<div class="panel-options">

<a href="admin.php?panel=admin" class="panel-card admin">

<i class="bi bi-shield-lock"></i>

<h3>Administrador</h3>

<p>
Gestiona jugadores del sistema y administración general.
</p>

</a>


<a href="creador.php?panel=creador" class="panel-card creator">

<i class="bi bi-pencil-square"></i>

<h3>Creador de contenido</h3>

<p>
Administra diálogos, logros y escenarios del juego.
</p>

</a>

</div>

</main>

</body>
</html>