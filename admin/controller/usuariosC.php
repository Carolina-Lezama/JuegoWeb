<?php
require_once __DIR__ . '/../model/usuariosM.php';
require_once __DIR__ . '/../includes/config.php';

class BuscarController {
    public function buscar() {
        $usuario = $_POST['usuario'] ?? ''; 
        $contrasena = $_POST['contrasena'] ?? '';  // extrae valor través de un formulario HTML por método POST.
                                            // izquierda valor extraido, derecha se asigna un valor vacío.
        if (!$usuario || !$contrasena) { //verifica si los campos están vacíos, no definidos o nulos.
            echo "<script>alert('Todos los campos son requeridos'); window.history.back();</script>";
            return;
        }
        $user = new Usuario(); // Instancia la clase para acceder a sus métodos.
        $resultado = $user->comprobarUsuario($usuario, $contrasena);
        if ($resultado) {
            session_start();
            $_SESSION['usuario'] = $usuario; //guardando el nombre de usuario en la sesión, permite saber quién está logueado
            $_SESSION['correo'] = $resultado['correo'] ?? '';
            $_SESSION['id'] = $resultado['id'] ?? '';
            $_SESSION['nombres'] = $resultado['nombres'] ?? '';
            $_SESSION['apellido_paterno'] = $resultado['apellido_paterno'] ?? '';
            $_SESSION['apellido_materno'] = $resultado['apellido_materno'] ?? '';
            $_SESSION['telefono'] = $resultado['telefono'] ?? '';
            $_SESSION['rol'] = $resultado['rol'] ?? '';
            header('Location: view/home.php');//redirige a otra pagina después de iniciar sesión correctamente.
            exit;
        } else {
            echo "<script>alert('Usuario no encontrado'); window.history.back();</script>";
        }
    }
}
