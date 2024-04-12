<?php

namespace src\Models;

use PDO;
use PDOException;


final class Database {
  private PDO $db;
  private string $config;

  public function __construct() {
    $this->config = __DIR__ . '/../../config.php';
    require_once $this->config;
    $this->db = $this->connect();
  }

  /**
   * Get the database connection.
   *
   * @return PDO
   */
  public function getDb(): PDO {
    return $this->db;
  }

  /**
   * Get the configuration value.
   *
   * @return string
   */
  public function getConfig(): string {
    return $this->config;
  }

  /**
   * Connects to the database using the provided credentials.
   *
   * @return PDO|string
   * @throws PDOException Connexion to DB failed: error message
   */
  public function connect(): PDO|string {
    try {
      $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME;
      return new PDO($dsn, DB_USER, DB_PASS);
    } catch (PDOException $e) {
      echo "Connexion to DB failed: " . $e->getMessage();
      exit;
    }
  }

  /**
   * Checks if the database already exists and create it if it doesn't.
   *
   * @return string|bool
   * @throws PDOException
   */
  public function init(): string|bool {
    if ($this->doesUsersTableExists()) {
      return "Database already exists.";
      die();
    } else {
      try {
        $sql = file_get_contents(__DIR__ . "/../Migration/SWSDatabase.sql");
        $this->db->query($sql);
        if ($this->updateConfig()) {
          return true;
        } else {
          return false;
        }
      } catch (PDOException $error) {
        return $error->getMessage();
      }
    }
  }

  /**
   * Makes the config file DB_INITIALIZED true.
   *
   * @return bool
   */
  public function updateConfig(): bool {
    $configFile = fopen($this->config, "w");
    $content = "<?php
    define('DB_INITIALIZED', TRUE);
    define('JWT_SECRET', '" . JWT_SECRET . "');
    define('DB_HOST', '" . DB_HOST . "');
    define('DB_NAME', '" . DB_NAME . "');
    define('DB_USER', '" . DB_USER . "');
    define('DB_PASS', '" . DB_PASS . "');
    define('PREFIXE', '" . PREFIXE . "');
    define('HOME_URL', '" . HOME_URL . "');";

    if (fwrite($configFile, $content)) {
      fclose($configFile);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Checks if the 'Users' table exists in the database.
   *
   * @return bool
   */
  public function doesUsersTableExists(): bool {
    $sql = "SHOW TABLES LIKE '" . PREFIXE . "USERS';";
    $return = $this->db->query($sql)->fetch();
    if ($return && $return[0] == PREFIXE . "USERS") {
      return true;
    } else {
      return false;
    }
  }
}
