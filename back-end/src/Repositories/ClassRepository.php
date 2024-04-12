<?php

namespace src\Repositories;

use PDO;
use src\Models\ClassModel;
use src\Models\Database;

final class ClassRepository {
  private PDO $db;

  public function __construct() {
    $database = new Database();
    $this->db = $database->getDb();
  }

  public function getTodaysClasses(): array {
    $stmt = $this->db->query('SELECT * FROM '.PREFIXE.'CLASSES WHERE DAY(START_TIME) = DAY(CURDATE())');
    $classes = $stmt->fetchAll(PDO::FETCH_CLASS, ClassModel::class);
    return $classes;
  }
}
