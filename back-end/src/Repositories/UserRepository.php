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

  /**
   * Retrieves the status (abscence, presence, late) of a user in a specific class.
   *
   * @param string $userId The ID of the user.
   * @param string $classId The ID of the class.
   * @return int|null The status of the user in the class if found, otherwise null.
   */
  public function getStatus(string $userId, string $classId): int|null {
    $sql = "SELECT STATUS FROM " . PREFIXE . "RELATION_USER_CLASS WHERE ID_USER = :id AND ID_CLASS = :classId";
    $stmt = $this->db->prepare($sql);
    $stmt->execute(['id' => $userId, 'classId' => $classId]);
    if ($stmt->rowCount() > 0) {
      return $stmt->fetchColumn();
    }
    return null;
  }

  /**
   * Retrieves all users from the database with a role of 1 (apprenants).
   *
   * @return array An array of User objects representing all the users with a role of 1 (apprenants).
   */
  public function getAll(): array {
    $sql = "SELECT ID, FIRST_NAME, LAST_NAME, PASSWORD, ACTIVATED, MAIL, ID_ROLE, ID_PROMOTION FROM " . PREFIXE . "USERS 
    JOIN " . PREFIXE . "RELATION_USER_PROMOTION ON " . PREFIXE . "USERS.ID = " . PREFIXE . "RELATION_USER_PROMOTION.ID_USER
    WHERE ID_ROLE = 1";
    $stmt = $this->db->prepare($sql);
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_CLASS, User::class);
    return $stmt->fetchAll();
  }

  /**
   * Inserts a new user into the database.
   *
   * @param string $firstName The first name of the user.
   * @param string $lastName The last name of the user.
   * @param string $mail The email address of the user.
   */
  public function create(string $lastName, string $firstName, string $mail): void {
    $sql = "INSERT INTO " . PREFIXE . "USERS (FIRST_NAME, LAST_NAME, MAIL) VALUES (:firstName, :lastName, :mail)";
    $stmt = $this->db->prepare($sql);
    $stmt->execute(['firstName' => $firstName, 'lastName' => $lastName, 'mail' => $mail]);
  }

  /**
   * Updates a user's information in the database.
   *
   * @param string $lastName The last name of the user.
   * @param string $firstName The first name of the user.
   * @param string $mail The email address of the user.
   * @param string $id The ID of the user to be updated.
   * @return void
   */
  public function edit(string $lastName, string $firstName, string $mail, string $id): void {
    $stmt = $this->db->prepare("UPDATE " . PREFIXE . "USERS SET FIRST_NAME = :firstName, LAST_NAME = :lastName, MAIL = :mail WHERE ID = :id");
    $stmt->execute(['firstName' => $firstName, 'lastName' => $lastName, 'mail' => $mail, 'id' => $id]);    
  }
}
