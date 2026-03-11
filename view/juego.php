<?php
session_start();
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/database.php';

$id = isset($_SESSION['id']) ? $_SESSION['id'] : '';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Videojuego practicas</title>
    <link rel="stylesheet" href="/Juego/style/style.css">
    <script src="/Juego/js/phaser.min.js"></script>
    <script type="module" src="/Juego/js/main.js"></script>
</head>
<body>
    <div id="game"></div>
</body>
</html>
