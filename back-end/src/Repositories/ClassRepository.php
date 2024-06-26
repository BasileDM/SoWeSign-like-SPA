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

  /**
   * Retrieves today's classes for a specific promotion ID.
   *
   * @param int $promotionId The ID of the promotion to get classes for.
   * @return array The array of classes for today.
   */
  public function getTodaysClasses(int $promotionId): array {
    $stmt = $this->db->query('SELECT * FROM ' . PREFIXE . 'CLASSES WHERE DAY(START_TIME) = DAY(CURDATE()) AND ID_PROMOTION = ' . $promotionId . ';');
    $classes = $stmt->fetchAll(PDO::FETCH_CLASS, ClassModel::class);
    if (empty($classes)) {
      $stmt = $this->db->prepare("INSERT INTO " . PREFIXE . "CLASSES(START_TIME, END_TIME, CODE, ID_PROMOTION) VALUES (CONCAT(CURDATE(), ' 09:00:00'), CONCAT(CURDATE(), ' 12:00:00'), NULL, :promotionId);
      INSERT INTO SWS_CLASSES(START_TIME, END_TIME, CODE, ID_PROMOTION) VALUES (CONCAT(CURDATE(), ' 13:00:00'), CONCAT(CURDATE(), ' 17:00:00'), NULL, :promotionId);
      SELECT * FROM ' . PREFIXE . 'CLASSES WHERE DAY(START_TIME) = DAY(CURDATE()) AND ID_PROMOTION = ' . $promotionId . ';");
      $stmt->execute(['promotionId' => $promotionId]);
      $classes = $stmt->fetchAll(PDO::FETCH_CLASS, ClassModel::class); 
    }
    return $classes;
  }

  /**
   * Adds code to the specified class.
   *
   * @param int $classId The ID of the class to add the code to.
   * @param string $code The code to be added.
   */
  public function addCode(int $classId, string $code): void {
    $stmt = $this->db->prepare('UPDATE ' . PREFIXE . 'CLASSES SET CODE = :code WHERE ID = :id;');
    $stmt->execute(['code' => $code, 'id' => $classId]);
  }

  /**
   * Adds presence status for a user in a class.
   *
   * @param string $userId The ID of the user.
   * @param string $classId The ID of the class.
   * @param int $presenceStatus The presence status of the user, either  1 for presence or 2 for late.
   * @return void
   */
  public function addPresenceStatus(string $userId, string $classId, int $presenceStatus): void {
    $sql = 'INSERT INTO ' . PREFIXE . 'RELATION_USER_CLASS(ID_CLASS, ID_USER, STATUS) VALUES (:classId, :userId, :presenceStatus);';
    $stmt = $this->db->prepare($sql);
    $stmt->execute(['classId' => $classId, 'userId' => $userId, 'presenceStatus' => $presenceStatus]);
  }

  public function getLatePresences(): array {
    $stmt = $this->db->query('SELECT *  FROM ' . PREFIXE . 'RELATION_USER_CLASS 
    JOIN ' . PREFIXE . 'RELATION_USER_PROMOTION ON ' . PREFIXE . 'RELATION_USER_CLASS.ID_USER = ' . PREFIXE . 'RELATION_USER_PROMOTION.ID_USER
    JOIN ' . PREFIXE . 'CLASSES ON ' . PREFIXE . 'RELATION_USER_CLASS.ID_CLASS = ' . PREFIXE . 'CLASSES.ID
    WHERE STATUS = 2;');
    $presences = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $presences;
  }

  /**
   * Retrieves the code for a specific class.
   *
   * @param string $classId The ID of the class to retrieve the code for.
   * @return string The code of the class.
   */
  public function getClassCode(string $classId): string {
    $stmt = $this->db->prepare('SELECT CODE FROM ' . PREFIXE . 'CLASSES WHERE ID = :id;');
    $stmt->execute(['id' => $classId]);
    $intCode = $stmt->fetchColumn();
    return (string) $intCode;
  }
}
