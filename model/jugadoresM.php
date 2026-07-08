<?php
require_once __DIR__ . '/../includes/database.php';

class Jugador {
    // Las propiedades se declaran siempre al inicio por legibilidad y orden
    private $db;

    public function __construct() {
        $dbInstance = new Database();     
        $this->db = $dbInstance->connect();   
    }

    /**
     * Registra un nuevo jugador validando unicidad de correo y nombre.
     */
    public function register($name, $email, $password) {
        // 1. CRÍTICO: Verificar si el correo ya está registrado
        if ($this->exists($email)) {
            return ['error' => 'El correo electrónico ya está registrado.'];
        }

        // 2. Verificar si el nombre de usuario ya existe
        $stmtCheck = $this->db->prepare("SELECT id FROM jugadores WHERE nombre_jugador = ?");
        $stmtCheck->execute([$name]);
        if ($stmtCheck->fetch()) {
            return ['error' => 'El nombre de usuario ya está en uso.'];
        }

        // 3. Inserción segura con hash
        $stmt = $this->db->prepare(
            "INSERT INTO jugadores (nombre_jugador, email, contrasena) VALUES (?, ?, ?)"
        );
        
        $success = $stmt->execute([
            $name,
            $email,
            password_hash($password, PASSWORD_BCRYPT)
        ]);

        return $success ? true : ['error' => 'Error al registrar en la base de datos.'];
    }

    /**
     * Verifica si un correo existe en la base de datos.
     */
    public function exists($email) {
        $stmt = $this->db->prepare(
            "SELECT id FROM jugadores WHERE email = ?"
        );
        $stmt->execute([$email]);
        return $stmt->fetch() !== false;
    }

    /**
     * Obtiene los datos del jugador por email sin comprometer la contraseña.
     */
    public function getByEmail($email) {
        // Excluimos explícitamente la contraseña de las consultas estándar
        $stmt = $this->db->prepare("SELECT id, nombre_jugador, email, puntos FROM jugadores WHERE email = ?");
        $stmt->execute([$email]);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        return $stmt->fetch();
    }

    /**
     * Verifica las credenciales para el inicio de sesión de forma segura.
     */
    public function comprobarUsuario($email, $contrasena) {
        // Necesitamos la contraseña solo para verificarla internamente
        $stmt = $this->db->prepare("SELECT * FROM jugadores WHERE email = ?");
        $stmt->execute([$email]);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $usuarioData = $stmt->fetch();

        if ($usuarioData && password_verify($contrasena, $usuarioData['contrasena'])) {
            //  SEGURIDAD: Eliminamos el hash de la contraseña antes de retornar el usuario
            unset($usuarioData['contrasena']);
            return $usuarioData;
        }
        return null;
    }

    /**
     * Actualiza los puntos acumulados del jugador activo de forma segura.
     */
    public function actualizarPuntos($email, $puntos) {
        // Validación de tipo e integridad de datos
        $puntos = filter_var($puntos, FILTER_VALIDATE_INT);
        if ($puntos === false || $puntos < 0) {
            return false;
        }

        $stmt = $this->db->prepare("UPDATE jugadores SET puntos = ? WHERE email = ?");
        return $stmt->execute([$puntos, $email]);
    }
}