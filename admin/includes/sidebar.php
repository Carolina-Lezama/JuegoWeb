<?php
$panel = $_SESSION['panel'] ?? 'creador';
?>

<div class="menu-toggle">
    <a href="menu.php" class="panel-card creator"> ☰
</div>

<nav class="panel-sidebar">

<ul class="main_nav_list sidebar-list">

<?php if($panel == "admin"){ ?>

<li class="main_nav_item">
<a href="admin.php">
<span class="menu-icon"><i class="bi bi-house-door"></i></span>
<span class="menu-text">Panel administrador</span>
</a>
</li>

<li class="main_nav_item">
<a href="jugadores.php">
<span class="menu-icon"><i class="bi bi-people"></i></span>
<span class="menu-text">Jugadores</span>
</a>
</li>

<li class="main_nav_item">
<a href="verLogros.php">
<span class="menu-icon"><i class="bi bi-trophy"></i></span>
<span class="menu-text">Logros</span>
</a>
</li>

<li class="main_nav_item">
<a href="dashboard.php">
<span class="menu-icon"><i class="bi bi-speedometer2"></i></span>
<span class="menu-text">Dashboard</span>
</a>
</li>

<li class="main_nav_item">
<a href="estadisticas.php">
<span class="menu-icon"><i class="bi bi-bar-chart-line"></i></span>
<span class="menu-text">Estadísticas</span>
</a>
</li>

<li class="main_nav_item">
<a href="jugadores_2.php">
<span class="menu-icon"><i class="bi bi-person-gear"></i></span>
<span class="menu-text">Modificar jugadores</span>
</a>
</li>

<li class="main_nav_item">
<a href="inventario.php">
<span class="menu-icon"><i class="bi bi-box-seam"></i></span>
<span class="menu-text">Modificar inventario</span>
</a>
</li>

<?php } else { ?>

<li class="main_nav_item">
<a href="creador.php">
<span class="menu-icon"><i class="bi bi-house-door"></i></span>
<span class="menu-text">Panel creador</span>
</a>
</li>

<li class="main_nav_item">
<a href="logros.php">
<span class="menu-icon"><i class="bi bi-trophy"></i></span>
<span class="menu-text">Crear logros</span>
</a>
</li>

<li class="main_nav_item">
<a href="dialogos.php">
<span class="menu-icon"><i class="bi bi-chat-dots"></i></span>
<span class="menu-text">Cambiar dialogos</span>
</a>
</li>

<li class="main_nav_item">
<a href="imagenes.php">
<span class="menu-icon"><i class="bi bi-image"></i></span>
<span class="menu-text">Cambiar escenarios</span>
</a>
</li>

<?php } ?>

<li class="main_nav_item">
<a href="perfil.php">
<span class="menu-icon"><i class="bi bi-person"></i></span>
<span class="menu-text">Perfil</span>
</a>
</li>

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