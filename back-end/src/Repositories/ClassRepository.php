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

  public function getClasses(): array {
    $stmt = $this->db->query('SELECT * FROM classes');
    $classes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $classes;
  }
}
