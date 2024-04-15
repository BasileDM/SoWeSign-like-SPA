<?php

namespace src\Repositories;

use PDO;
use src\Models\Database;

class PromRepository {
  private PDO $db;

  public function __construct() {
    $database = new Database();
    $this->db = $database->getDb();
  }

  /**
   * Retrieves the name of a promotion based on the promotion ID.
   *
   * @param int $promotionId The ID of the promotion to retrieve the name for.
   * @return string The name of the promotion.
   */
  public function getPromName(int $promotionId): string {
    $stmt = $this->db->query('SELECT NAME FROM '.PREFIXE.'PROMOTIONS WHERE ID = '.$promotionId.';');
    $name = $stmt->fetchColumn();
    return $name;
  }

  /**
   * Gets the number of students with a unique ID in a promotion.
   *
   * @param int $promotionId
   * @return int
   */
  public function getStudentsNumber(int $promotionId): int {
    $stmt = $this->db->query('SELECT COUNT(DISTINCT ID_USER) FROM '.PREFIXE.'RELATION_USER_PROMOTION WHERE ID_PROMOTION = '.$promotionId.';');
    $nbStudents = $stmt->fetchColumn();
    return $nbStudents;
  }

  public function getAll(): array {
    $stmt = $this->db->query('SELECT * FROM '.PREFIXE.'PROMOTIONS;');
    $promos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $promos;
  }
}