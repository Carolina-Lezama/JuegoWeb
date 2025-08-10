<?php
require_once __DIR__ . '/../includes/database.php';

class Usuario {
    private $db;
    public function __construct() {
        $dbInstance = new Database();     
        $this->db = $dbInstance->connect();   
    }
    public function comprobarUsuario($usuario, $contrasena) {
        $stmt = $this->db->prepare("SELECT * FROM usuarios WHERE usuario = ?");
        $stmt->execute([$usuario]);
        $usuarioData = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($usuarioData && password_verify($contrasena, $usuarioData['contrasena'])) {
            return $usuarioData; 
        }
        return null; 
    }
}