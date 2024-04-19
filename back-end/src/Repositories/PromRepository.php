<?php

namespace src\Repositories;

use PDO;
use PDOException;
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
    $stmt = $this->db->query('SELECT NAME FROM ' . PREFIXE . 'PROMOTIONS WHERE ID = ' . $promotionId . ';');
    $name = $stmt->fetchColumn();
    return $name;
  }

  /**
   * Gets the number of students with a unique ID in a specified promotion.
   *
   * @param int $promotionId
   * @return int
   */
  public function getStudentsNumber(int $promotionId): int {
    $stmt = $this->db->query('SELECT COUNT(DISTINCT ID_USER) FROM ' . PREFIXE . 'RELATION_USER_PROMOTION WHERE ID_PROMOTION = ' . $promotionId . ';');
    $nbStudents = $stmt->fetchColumn();
    return $nbStudents;
  }

  /**
   * Retrieves all promotions from the database.
   *
   * @return array An array containing all promotions.
   */
  public function getAll(): array {
    $stmt = $this->db->query('SELECT * FROM ' . PREFIXE . 'PROMOTIONS;');
    $promos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $promos;
  }

  /**
   * Creates a new record in the PROMOTIONS table with the given name, start date, end date, and available spots.
   *
   * @param string $name The name of the promotion.
   * @param string $startDate The start date of the promotion.
   * @param string $endDate The end date of the promotion.
   * @param int $availableSpots The number of available spots for the promotion.
   * @throws PDOException If there is an error executing the SQL statement.
   * @return void
   */
  public function create(string $name, string $startDate, string $endDate, int $availableSpots): void {
    try {
      $stmt = $this->db->prepare('INSERT INTO ' . PREFIXE . 'PROMOTIONS (START_DATE, END_DATE, AVAILABLE_SPOTS, NAME) VALUES (:startDate, :endDate, :availableSpots, :name);');
      $stmt->execute(['startDate' => $startDate, 'endDate' => $endDate, 'availableSpots' => $availableSpots, 'name' => $name]);
    } catch (PDOException $e) {
      throw new PDOException($e->getMessage());
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Backend error. Please contact your administrator.']);
      die();
    }
  }
}
