<?php
require_once __DIR__ . '/../model/jugadoresM.php';
require_once __DIR__ . '/../includes/config.php';

class RegisterController {
    
    /**
     * Procesa el formulario de registro de nuevos jugadores
     */
    public function submitForm() {
        $name      = trim($_POST['jugador'] ?? '');
        $email     = trim($_POST['correo'] ?? '');
        $password  = $_POST['contrasena'] ?? '';
        $confirmPw = $_POST['contrasenaconfirmacion'] ?? '';

        // Validamos campos vacíos
        if (!$name || !$email || !$password || !$confirmPw) {
            $this->alertaInformativa('Todos los campos son obligatorios.');
            return;
        }

        // Verificamos coincidencia de credenciales
        if ($password !== $confirmPw) {
            $this->alertaInformativa('Las contraseñas no coinciden.');
            return;
        }

        $player = new Jugador();
        
        // 🔥 ALINEACIÓN CON EL NUEVO MODELO: Recibe el estado real del registro
        $resultadoRegistro = $player->register($name, $email, $password);

        if ($resultadoRegistro === true) {
            require __DIR__ . '/../view/success.php';
        } else {
            // Si el modelo devolvió un string o un array de error, se lo mostramos al usuario
            $mensajeError = is_array($resultadoRegistro) ? $resultadoRegistro['error'] : 'Error al registrar el usuario.';
            $this->alertaInformativa($mensajeError);
        }
    }

    /**
     * Procesa el inicio de sesión y el almacenamiento de variables de sesión
     */
    public function login() {
        $email    = trim($_POST['correo'] ?? '');
        $password = $_POST['contrasena'] ?? '';

        if (!$email || !$password) {
            $this->alertaInformativa('Todos los campos son obligatorios.');
            return;
        }

        $player = new Jugador();
        $result = $player->comprobarUsuario($email, $password);

        if ($result) {
            // 🔥 Aseguramos la sesión mediante el motor de configuración unificado
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }

            // Almacenamos los datos filtrados (recuerda que el modelo ya eliminó la contraseña)
            $_SESSION['usuario']           = true; // Bandera booleana para require_login()
            $_SESSION['id']                = $result['id'] ?? 0;
            $_SESSION['nombre_jugador']    = $result['nombre_jugador'] ?? '';
            $_SESSION['email']             = $result['email'] ?? '';
            $_SESSION['genero']            = $result['genero'] ?? '';
            $_SESSION['nivel']             = $result['nivel'] ?? 1;
            $_SESSION['puntos']            = $result['puntos'] ?? 0;
            $_SESSION['fecha_registro']    = $result['fecha_registro'] ?? '';
            $_SESSION['fecha_nacimiento']  = $result['fecha_nacimiento'] ?? '';

            // Redirección al catálogo o lobby principal del juego
            header('Location: view/catalogo.php');
            exit;
        } else {
            $this->alertaInformativa('Usuario o contraseña incorrectos.');
        }
    }

    /**
     * Helper interno para despachar alertas limpias e interrumpir la ejecución
     */
    private function alertaInformativa($mensaje) {
        // Sanitizamos el output para evitar inyecciones de código JS malicioso (XSS)
        $mensajeSeguro = htmlspecialchars($mensaje, ENT_QUOTES, 'UTF-8');
        echo "<script>alert('{$mensajeSeguro}'); window.history.back();</script>";
        exit;
    }
}