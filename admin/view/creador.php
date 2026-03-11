<?php
require_once __DIR__ . '/../includes/config.php';
session_start();
require_login();

$user = htmlspecialchars($_SESSION['usuario']);
if(isset($_GET['panel'])){
    $_SESSION['panel'] = $_GET['panel'];
}else{
    $_SESSION['panel'] = 'creador';
}   
?>

<!DOCTYPE html>
<html lang="es">

<head>

<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Panel Creador</title>

<link href="css/creador.css" rel="stylesheet">
<link rel="stylesheet" href="css/fuentes.css">

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

<script src="js/funcion.js"></script>

</head>

<body>

<?php include __DIR__ . '/../includes/sidebar.php'; ?>

<main class="main-content">

<h2>Bienvenido Creador, <?php echo $user; ?>!</h2>

<p>Aquí puedes gestionar el contenido del juego.</p>

</main>


<script>

if (typeof initSidebarAutoClose === 'function') {
initSidebarAutoClose();
}

</script>

</body>
</html>