<?php
require_once __DIR__ . '/../model/jugadoresM.php';
require_once __DIR__ . '/../includes/config.php';
class RegisterController {
    public function submitForm() {
        $name      = $_POST['jugador'] ?? '';
        $email     = $_POST['correo'] ?? '';
        $password  = $_POST['contrasena'] ?? '';
        $confirmPw = $_POST['contrasenaconfirmacion'] ?? '';

        if (!$name || !$email || !$password || !$confirmPw) {
            echo "<script>alert('Todos los campos son obligatorios.'); window.history.back();</script>";   
            return;
        }

        if ($password !== $confirmPw) {
            echo "<script>alert('Las contraseñas no coinciden.'); window.history.back();</script>";
            return;
        }

        $player = new Jugador();
        if ($player->exists($email)) {
            echo "<script>alert('El email ya está registrado.'); window.history.back();</script>";
            return;
        }

        if ($player->register($name, $email, $password)) {
            require __DIR__ . '/../view/success.php';
        } else {
            echo "<script>alert('Error al registrar.'); window.history.back();</script>";
        }
    }

    public function login() {
        $email = $_POST['correo'] ?? '';
        $password = $_POST['contrasena'] ?? '';

        if (!$email || !$password) {
            echo "<script>alert('Todos los campos son obligatorios.'); window.history.back();</script>";
            return;
        }
        $player = new Jugador();
        $result = $player->comprobarUsuario($email, $password);
        if ($result) {
            session_start();
            $_SESSION['id'] = $result['id']?? 0;
            $_SESSION['nombre_jugador'] = $result['nombre_jugador']?? '';
            $_SESSION['email'] = $result['email']?? '';
            $_SESSION['genero'] = $result['genero'] ?? '';
            $_SESSION['nivel'] = $result['nivel'] ?? 1;
            $_SESSION['puntos'] = $result['puntos'] ?? 0;
            $_SESSION['fecha_registro'] = $result['fecha_registro'] ?? 0;
            $_SESSION['fecha_nacimiento'] = $result['fecha_nacimiento'] ?? 0;

            header('Location: view/juego.php');
            exit;
        } else {
            echo "<script>alert('Usuario o contraseña incorrectos.'); window.history.back();</script>";
        }
    }
}