<?php

namespace src\Repositories;

use PDO;
use PDOException;
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
   * @return User|false The User object if found, or false if not found.
   * @throws PDOException If an error occurs while fetching the user from the database.
   */
  public function getByMail(string $mail): User|false {
    try {
      $sql = "SELECT * FROM " . PREFIXE . "USERS WHERE mail = :mail";
      $stmt = $this->db->prepare($sql);
      $stmt->execute(['mail' => $mail]);
      $stmt->setFetchMode(PDO::FETCH_CLASS, User::class);
      return $stmt->fetch();
    } catch (PDOException $e) {
      throw new PDOException($e->getMessage());
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Backend error. Please contact your administrator.']);
      die();
    }
  }

  /**
   * Retrieves a user from the database by their id.
   *
   * @param string $id The id of the user to retrieve.
   * @return User|null The User object if found, or null if not found.
   * @throws PDOException If an error occurs while fetching the user from the database.
   */
  public function getById(string $id): User {
    try {
      $sql = "SELECT * FROM " . PREFIXE . "USERS WHERE id = :id";
      $stmt = $this->db->prepare($sql);
      $stmt->execute(['id' => $id]);
      $stmt->setFetchMode(PDO::FETCH_CLASS, User::class);
      return $stmt->fetch();
    } catch (PDOException $e) {
      throw new PDOException($e->getMessage());
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Backend error. Please contact your administrator.']);
      die();
    }
  }

  /**
   * Retrieves the promotion ID of a user based on the user ID.
   *
   * @param string $userId The ID of the user to retrieve the promotion for.
   * @return int The ID of the promotion associated with the user.
   * @throws PDOException If an error occurs while fetching the promotion ID from the database.
   */
  public function getUserPromotionId(string $userId): int {
    try {
      $sql = "SELECT ID_PROMOTION FROM " . PREFIXE . "RELATION_USER_PROMOTION WHERE ID_USER = :id";
      $stmt = $this->db->prepare($sql);
      $stmt->execute(['id' => $userId]);
      return $stmt->fetchColumn();
    } catch (PDOException $e) {
      throw new PDOException($e->getMessage());
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Backend error. Please contact your administrator.']);
      die();
    }
  }

  /**
   * Retrieves the status (abscence, presence, late) of a user in a specific class.
   *
   * @param string $userId The ID of the user.
   * @param string $classId The ID of the class.
   * @return int|null The status of the user in the class if found, otherwise null.
   * @throws PDOException If an error occurs while fetching the status from the database.
   */
  public function getStatus(string $userId, string $classId): int|null {
    try {
      $sql = "SELECT STATUS FROM " . PREFIXE . "RELATION_USER_CLASS WHERE ID_USER = :id AND ID_CLASS = :classId";
      $stmt = $this->db->prepare($sql);
      $stmt->execute(['id' => $userId, 'classId' => $classId]);
      if ($stmt->rowCount() > 0) {
        return $stmt->fetchColumn();
      }
      return null;
    } catch (PDOException $e) {
      throw new PDOException($e->getMessage());
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Backend error. Please contact your administrator.']);
      die();
    }
  }

  /**
   * Retrieves all users from the database with a role of 1 (apprenants).
   *
   * @return array An array of User objects representing all the users with a role of 1 (apprenants).
   * @throws PDOException If an error occurs while fetching the users from the database.
   */
  public function getAll(): array {
    try {
      $sql = "SELECT ID, FIRST_NAME, LAST_NAME, PASSWORD, ACTIVATED, MAIL, ID_ROLE, ID_PROMOTION FROM " . PREFIXE . "USERS 
      JOIN " . PREFIXE . "RELATION_USER_PROMOTION ON " . PREFIXE . "USERS.ID = " . PREFIXE . "RELATION_USER_PROMOTION.ID_USER
      WHERE ID_ROLE = 1";
      $stmt = $this->db->prepare($sql);
      $stmt->execute();
      $stmt->setFetchMode(PDO::FETCH_CLASS, User::class);
      return $stmt->fetchAll();
    } catch (PDOException $e) {
      throw new PDOException($e->getMessage());
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Backend error. Please contact your administrator.']);
      die();
    }
  }

  public function getUnactivatedMails(): array {
    try {
      $sql = "SELECT MAIL FROM " . PREFIXE . "USERS WHERE ACTIVATED = 0";
      $stmt = $this->db->prepare($sql);
      $stmt->execute();
      return $stmt->fetchAll();
    } catch (PDOException $e) {
      throw new PDOException($e->getMessage());
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Backend error. Please contact your administrator.']);
      die();
    }    
  }

  public function activate(string $mail, string $password): void {
    try {
      $sql = "UPDATE " . PREFIXE . "USERS SET ACTIVATED = 1, PASSWORD = :password WHERE MAIL = :mail";
      $stmt = $this->db->prepare($sql);
      $stmt->execute(['mail' => $mail, 'password' => $password]);
    } catch (PDOException $e) {
      throw new PDOException($e->getMessage());
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Backend error. Please contact your administrator.']);
      die();
    }
  }

  /**
   * Inserts a new user into the database.
   *
   * @param int $promId The promotion ID of the user.
   * @param string $firstName The first name of the user.
   * @param string $lastName The last name of the user.
   * @param string $mail The email address of the user.
   * @throws PDOException If an error occurs while inserting the user into the database.
   * @return void
   */
  public function create(int $promId, string $lastName, string $firstName, string $mail): void {
    try {
      $newUser = new User();
      $newUser->setFirstName($firstName);
      $newUser->setLastName($lastName);
      $newUser->setActivated(false);
      $newUser->setMail($mail);
      $newUser->setIdRole(1);
      $newUser->setIdPromotion($promId);
      $sql = "INSERT INTO " . PREFIXE . "USERS (FIRST_NAME, LAST_NAME, ACTIVATED, MAIL, ID_ROLE) 
      VALUES (:firstName, :lastName, :activated, :mail, :idRole)";
      $stmt = $this->db->prepare($sql);
      $stmt->execute([
        'firstName' => $newUser->getFirstName(),
        'lastName' => $newUser->getLastName(),
        'activated' => 0,
        'mail' => $newUser->getMail(),
        'idRole' => $newUser->getIdRole()
      ]);
      $lastInsertId = $this->db->lastInsertId();
      $newUser->setId($lastInsertId);
      $sql = "INSERT INTO " . PREFIXE . "RELATION_USER_PROMOTION (ID_USER, ID_PROMOTION) VALUES (:id, :promId)";
      $stmt = $this->db->prepare($sql);
      $stmt->execute(['id' => $newUser->getId(), 'promId' => $newUser->getIdPromotion()]);
    } catch (PDOException $e) {
      throw new PDOException($e->getMessage());
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Backend error. Please contact your administrator.']);
      die();
    }
  }

  /**
   * Updates a user's information in the database.
   *
   * @param string $lastName The last name of the user.
   * @param string $firstName The first name of the user.
   * @param string $mail The email address of the user.
   * @param string $id The ID of the user to be updated.
   * @throws PDOException If an error occurs while updating the user in the database.
   * @return void
   */
  public function edit(string $lastName, string $firstName, string $mail, string $id): void {
    try {
      $stmt = $this->db->prepare("UPDATE " . PREFIXE . "USERS SET FIRST_NAME = :firstName, LAST_NAME = :lastName, MAIL = :mail WHERE ID = :id");
      $stmt->execute(['firstName' => $firstName, 'lastName' => $lastName, 'mail' => $mail, 'id' => $id]);
    } catch (PDOException $e) {
      throw new PDOException($e->getMessage());
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Backend error. Please contact your administrator.']);
      die();
    }
  }

  public function delete(string $id): void {
    try {
      $sql = "DELETE FROM " . PREFIXE . "RELATION_USER_CLASS WHERE ID_USER = :id;
        DELETE FROM " . PREFIXE . "RELATION_USER_PROMOTION WHERE ID_USER = :id;
        DELETE FROM " . PREFIXE . "USERS WHERE ID = :id";
      $stmt = $this->db->prepare($sql);
      $stmt->execute(['id' => $id]);
    } catch (PDOException $e) {
      throw new PDOException($e->getMessage());
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Backend error. Please contact your administrator.']);
      die();
    }
  }
}
