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

  public function getStudentsNumber(int $promotionId): int {
    // The sql request should COUNT in the prefixed table RELATION_USER_PROMOTION the number of students with a unique ID where the promotion is the promotionId
    $stmt = $this->db->query('SELECT COUNT(DISTINCT ID_USER) FROM '.PREFIXE.'RELATION_USER_PROMOTION WHERE ID_PROMOTION = '.$promotionId.';');
    $nbStudents = $stmt->fetchColumn();
    return $nbStudents;
  }
}