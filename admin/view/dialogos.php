<?php
require_once __DIR__ . '/../includes/config.php';
session_start();
require_login();

require_once __DIR__ . '/../includes/database.php';

$user = htmlspecialchars($_SESSION['usuario']);
$id_usuario = $_SESSION['id'] ?? 0;

$database = new Database();
$db = $database->connect();

$dialogo1 = "";
$dialogo2 = "";
$dialogo3 = "";
$error = "";

/* =========================================
   GUARDAR DIALOGOS
========================================= */

if (isset($_POST["submit"])) {

    $dialogo1 = trim($_POST['dialogo_escena1'] ?? '');
    $dialogo2 = trim($_POST['dialogo_escena2'] ?? '');
    $dialogo3 = trim($_POST['dialogo_escena3'] ?? '');

    try {

        $stmt = $db->prepare("SELECT COUNT(*) FROM dialogos WHERE id_usuarios = ?");
        $stmt->execute([$id_usuario]);

        $existe = $stmt->fetchColumn();

        if ($existe) {

            $stmt = $db->prepare("
            UPDATE dialogos 
            SET introduccion_uno=?, introduccion_dos=?, introduccion_tres=? 
            WHERE id_usuarios=?
            ");

            $stmt->execute([
                $dialogo1,
                $dialogo2,
                $dialogo3,
                $id_usuario
            ]);

        } else {

            $stmt = $db->prepare("
            INSERT INTO dialogos
            (id_usuarios, introduccion_uno, introduccion_dos, introduccion_tres)
            VALUES (?, ?, ?, ?)
            ");

            $stmt->execute([
                $id_usuario,
                $dialogo1,
                $dialogo2,
                $dialogo3
            ]);
        }

        header("Location: dialogos.php");
        exit;

    } catch (Exception $e) {

        $error = "Error al guardar: " . $e->getMessage();

    }
}

/* =========================================
   OBTENER DIALOGOS
========================================= */

try {

    $stmt = $db->prepare("
    SELECT introduccion_uno, introduccion_dos, introduccion_tres 
    FROM dialogos 
    WHERE id_usuarios = ?
    ");

    $stmt->execute([$id_usuario]);

    if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

        $dialogo1 = $row['introduccion_uno'];
        $dialogo2 = $row['introduccion_dos'];
        $dialogo3 = $row['introduccion_tres'];

    }

} catch (Exception $e) {

    $error = "Error al cargar diálogos";

}

?>

<!DOCTYPE html>
<html lang="es">

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Subir diálogos del juego</title>

<link rel="stylesheet" href="css/admin.css">
<link rel="stylesheet" href="css/dialogos.css">
<link rel="stylesheet" href="css/fuentes.css">

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

<script src="js/funcion.js"></script>

</head>

<body>

<?php include __DIR__ . '/../includes/sidebar.php'; ?>

<main class="main-content">

<h2 class="centrar">Diálogos cambiables en el juego</h2>

<?php if ($error != "") { ?>
<div class="mensaje-error"><?php echo htmlspecialchars($error); ?></div>
<?php } ?>

<form class="formulario" action="dialogos.php" method="post">

<label>Diálogo para primer escena de la Historia:
<textarea name="dialogo_escena1" maxlength="160" rows="3"><?php echo htmlspecialchars($dialogo1); ?></textarea>
</label>

<label>Diálogo para segunda escena de la Historia:
<textarea name="dialogo_escena2" maxlength="160" rows="3"><?php echo htmlspecialchars($dialogo2); ?></textarea>
</label>

<label>Diálogo para tercera escena de la Historia:
<textarea name="dialogo_escena3" maxlength="160" rows="3"><?php echo htmlspecialchars($dialogo3); ?></textarea>
</label>

<button type="submit" class="guardar" name="submit">
Guardar diálogos
</button>

</form>

</main>

<script>

if (typeof initSidebarAutoClose === 'function') {
initSidebarAutoClose();
}

</script>

</body>
</html>