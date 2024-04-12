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
  public function getByMail($mail) {
    $sql = "SELECT * FROM " . PREFIXE . "USERS WHERE mail = :mail";
    $stmt = $this->db->prepare($sql);
    $stmt->execute(['mail' => $mail]);
    $stmt->setFetchMode(PDO::FETCH_CLASS, User::class);
    return $stmt->fetch();
  }
}
