<?php
// Aseguramos las constantes leyendo directamente desde las variables de entorno (.env)
if (!defined('DB_HOST')) define('DB_HOST', $_ENV['DB_HOST'] ?? 'localhost');
if (!defined('DB_USER')) define('DB_USER', $_ENV['DB_USER'] ?? 'root');
if (!defined('DB_PASS')) define('DB_PASS', $_ENV['DB_PASS'] ?? '');
if (!defined('DB_NAME')) define('DB_NAME', $_ENV['DB_NAME'] ?? 'videojuego');

class Database {
    private $conn = null; 

    /**
     * Establece la conexión a la base de datos de forma segura.
     */
    public function connect() {
        if ($this->conn === null) {
            try {
                // Opciones limpias y reales, sin textos de ejemplo
                $opciones = [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
                ];

                $this->conn = new PDO(
                    "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
                    DB_USER,
                    DB_PASS,
                    $opciones
                );

            } catch (PDOException $e) {
                error_log("Database connection failed: " . $e->getMessage());
                throw new Exception("Error de conexión a la base de datos.");
            }
        }
        return $this->conn;
    }
}
?>