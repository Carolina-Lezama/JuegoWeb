<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Registro exitoso</title>

<meta http-equiv="refresh" content="2;url=inicio.php">

<style>

/* =========================
   ESTILO GENERAL
========================= */

body{

margin:0;

font-family:'Montserrat', Arial, sans-serif;

background:#0f172a;

color:#e2e8f0;

display:flex;

align-items:center;

justify-content:center;

height:100vh;

}

/* =========================
   TARJETA MENSAJE
========================= */

.msg{

background:#1e293b;

padding:35px 40px;

border-radius:12px;

box-shadow:0 10px 30px rgba(0,0,0,0.35);

text-align:center;

max-width:420px;

}

/* TITULO */

.msg h2{

color:#a7f3d0;

margin-bottom:12px;

font-size:1.7rem;

}

/* TEXTO */

.msg p{

color:#cbd5f5;

font-size:15px;

}

</style>

</head>

<body>

<div class="msg">

<h2>¡Registro exitoso!</h2>

<p>Redirigiendo a la página de inicio de sesión...</p>

</div>

<script>

setTimeout(function() {

window.location.href = 'view/inicio.php';

}, 2000);

</script>

</body>
</html>