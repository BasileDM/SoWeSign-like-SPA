<?php

namespace src\Repositories;

use PDO;
use src\Models\Database;
use src\Models\User;

class UserRepository {
  private PDO $db;

  public function __construct() {
    $database = new Database();
    $this->db = $database->getDb();
  }
  
  /**
   * Retrieves a user from the database by their email address.
   *
   * @param string $mail The email address of the user to retrieve.
   * @return User|null The User object if found, or null if not found.
   */
  public function getByMail(string $mail): User {
    $sql = "SELECT * FROM " . PREFIXE . "USERS WHERE mail = :mail";
    $stmt = $this->db->prepare($sql);
    $stmt->execute(['mail' => $mail]);
    $stmt->setFetchMode(PDO::FETCH_CLASS, User::class);
    return $stmt->fetch();
  }

  /**
   * Retrieves a user from the database by their id.
   *
   * @param string $id The id of the user to retrieve.
   * @return User|null The User object if found, or null if not found.
   */
  public function getById(string $id): User {
    $sql = "SELECT * FROM " . PREFIXE . "USERS WHERE id = :id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute(['id' => $id]);
    $stmt->setFetchMode(PDO::FETCH_CLASS, User::class);
    return $stmt->fetch();
  }

  /**
   * Retrieves the promotion ID of a user based on the user ID.
   *
   * @param string $userId The ID of the user to retrieve the promotion for.
   * @return int The ID of the promotion associated with the user.
   */
  public function getUserPromotionId(string $userId): int {
    $sql = "SELECT ID_PROMOTION FROM " . PREFIXE . "RELATION_USER_PROMOTION WHERE ID_USER = :id";
    $stmt = $this->db->prepare($sql);
    $stmt->execute(['id' => $userId]);
    return $stmt->fetchColumn();
  }
}
