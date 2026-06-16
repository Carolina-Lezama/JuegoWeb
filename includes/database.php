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
                // Configuraciones optimizadas para producción/desarrollo
                $opciones = [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // Evita tener que mapear en cada query
                    PDO:: some_option_placeholder_if_needed => true
                ];

                // Removemos el placeholder y dejamos el array limpio
                $opciones = [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4" // Asegura el encoding a nivel driver
                ];

                $this->conn = new PDO(
                    "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
                    DB_USER,
                    DB_PASS,
                    $opciones
                );

            } catch (PDOException $e) {
                // Registra el error real internamente en el servidor de forma privada
                error_log("Database connection failed: " . $e->getMessage());
                
                // Lanza una excepción genérica para no mostrar rutas ni datos sensibles al cliente
                throw new Exception("Error de conexión a la base de datos. Por favor, intente más tarde.");
            }
        }
        return $this->conn;
    }

    /**
     * Cierra la conexión activa con el servidor.
     */
    public function disconnect() {
        $this->conn = null;
    }
}
?>