<?php
session_start();

// Vaciar variables de sesión
$_SESSION = [];

// Destruir sesión
session_unset();
session_destroy();

// Redirigir al catálogo
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Location: catalogo.php");
exit;
