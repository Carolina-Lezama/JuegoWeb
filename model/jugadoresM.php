<?php
require_once __DIR__ . '/../includes/database.php';

class Jugador {
    // Actualizar puntos del jugador activo
    public function actualizarPuntos($email, $puntos) {
        $stmt = $this->db->prepare("UPDATE jugadores SET puntos = ? WHERE email = ?");
        return $stmt->execute([$puntos, $email]);
    }
    private $db;

    public function __construct() {
        $dbInstance = new Database();     
        $this->db = $dbInstance->connect();   
    }

    public function register($name, $email, $password) {
        // Verificar si el nombre de usuario ya existe
        $stmtCheck = $this->db->prepare("SELECT id FROM jugadores WHERE nombre_jugador = ?");
        $stmtCheck->execute([$name]);
        if ($stmtCheck->fetch()) {
            // Ya existe ese nombre de usuario
            return false;
        }
        $stmt = $this->db->prepare(
            "INSERT INTO jugadores (nombre_jugador, email, contrasena ) VALUES (?, ?, ?)"
        );
        return $stmt->execute([
            $name,
            $email,
            password_hash($password, PASSWORD_BCRYPT)
        ]);
    }
    public function exists($email) {
        $stmt = $this->db->prepare(
            "SELECT id FROM jugadores WHERE email = ?"
        );
        $stmt->execute([$email]);
        return $stmt->fetch() !== false;
    }
    public function getByEmail($email) {
        $stmt = $this->db->prepare("SELECT * FROM jugadores WHERE email = ?");
        $stmt->execute([$email]);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        return $stmt->fetch();
    }

    public function comprobarUsuario($email, $contrasena) {
        $usuarioData = $this->getByEmail($email);
        if ($usuarioData && password_verify($contrasena, $usuarioData['contrasena'])) {
            return $usuarioData;
        }
        return null;
    }
}
