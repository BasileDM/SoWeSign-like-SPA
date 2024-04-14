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

  public function getTodaysClasses(int $promotionId): array {
    $stmt = $this->db->query('SELECT * FROM '.PREFIXE.'CLASSES WHERE DAY(START_TIME) = DAY(CURDATE()) AND ID_PROMOTION = '.$promotionId.';');
    $classes = $stmt->fetchAll(PDO::FETCH_CLASS, ClassModel::class);
    return $classes;
  }

  public function addCode(int $classId, string $code): void {
    $stmt = $this->db->prepare('UPDATE '.PREFIXE.'CLASSES SET CODE = :code WHERE ID = :id;');
    $stmt->execute(['code' => $code, 'id' => $classId]);
  }
}
