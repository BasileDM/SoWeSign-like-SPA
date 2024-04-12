<?php

namespace src\Controllers;

use PDO;
use src\Models\Database;

final class ClassRepository {
  private PDO $db;

  public function __construct() {
    $database = new Database();
    $this->db = $database->getDb();
  }

  public function getTodaysClasses(): array {
    $stmt = $this->db->query('SELECT * FROM classes WHERE date = CURDATE()');
    $classes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $classes;
  }
}
