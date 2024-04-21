<?php

namespace src\Controllers;

use src\Repositories\PromRepository;
use src\Repositories\UserRepository;

class FormController {

  /**
   * Handles the promotion form based on the given CRUD type and form content.
   *
   * @param string $crudType The CRUD type ('create', 'edit').
   * @param array $formContent The form content containing the promotion details.
   * @return void echoes a JSON response with the success/error message and dies.
   */
  public function handlePromotionForm(string $crudType, array $formContent): void {
    $promRepo = new PromRepository();
    if ($crudType === 'create') {
      $name = self::sanitizeString($formContent[0]);
      $startDate = self::sanitizeDate($formContent[1]);
      $endDate = self::sanitizeDate($formContent[2]);
      $availableSpots = self::sanitizeNumber($formContent[3]);
      $promRepo->create($name, $startDate, $endDate, $availableSpots);
      header('Content-Type: application/json');
      echo json_encode(['success' => 'Promotion created.', 'crudType' => $crudType, 'formContent' => $formContent]);
      die();

    } elseif ($crudType === 'edit') {
      $id = self::sanitizeNumber($formContent[0]); // ADD ID IN FORM CONTENT TO FIX ERROR
      $name = self::sanitizeString($formContent[1]);
      $startDate = self::sanitizeDate($formContent[2]);
      $endDate = self::sanitizeDate($formContent[3]);
      $availableSpots = self::sanitizeNumber($formContent[4]);
      $promRepo->edit($id, $name, $startDate, $endDate, $availableSpots);
      header('Content-Type: application/json');
      echo json_encode(['success' => 'Promotion updated.', 'crudType' => $crudType, 'formContent' => $formContent]);
      die();
    }
  }

  public function handleUserForm(string $crudType, array $formContent): void {
    $userRepo = new UserRepository();
    if ($crudType === 'create') {
      $lastName = self::sanitizeString($formContent[0]);
      $firstName = self::sanitizeString($formContent[1]);
      $email = self::sanitizeEmail($formContent[2]);
      $userRepo->create($lastName, $firstName, $email);
      header('Content-Type: application/json');
      echo json_encode(['success' => 'User created.', 'crudType' => $crudType, 'formContent' => $formContent]);
      die();

    } elseif ($crudType === 'edit') {
      $id = self::sanitizeNumber($formContent[0]);
      $lastName = self::sanitizeString($formContent[1]);
      $firstName = self::sanitizeString($formContent[2]);
      $email = self::sanitizeEmail($formContent[3]);
      $userRepo->edit($lastName, $firstName, $email, $id);
      header('Content-Type: application/json');
      echo json_encode(['success' => 'User updated.', 'crudType' => $crudType, 'formContent' => $formContent]);
      die();
    }
  }

  public function deletePromotion(int $id): void {
    $promRepo = new PromRepository();
    $promRepo->delete($id);
    header('Content-Type: application/json');
    echo json_encode(['success' => 'Promotion deleted.']);
    die();
  }

  public function deleteUser(int $id): void {
    $userRepo = new UserRepository();
    $userRepo->delete($id);
    header('Content-Type: application/json');
    echo json_encode(['success' => 'User deleted.']);
    die();
  }

  // Check and sanitize data functions
  private static function sanitizeString(string $dirtyString): string {
    if (strlen($dirtyString) < 2 || strlen($dirtyString) > 50) {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Le nom doit contenir entre 2 et 50 caractères.']);
      die();
    }
    return htmlspecialchars($dirtyString, ENT_QUOTES, 'UTF-8');
  }

  private static function sanitizeEmail(string $dirtyEmail): string {
    if (strlen($dirtyEmail) < 2 || strlen($dirtyEmail) > 80) {
      echo json_encode(['error' => 'Invalid email.']);
      exit();
    };
    if (filter_var($dirtyEmail, FILTER_VALIDATE_EMAIL) === false) {
      echo json_encode(['error' => 'Invalid email.']);
      exit();
    };
    return filter_var($dirtyEmail, FILTER_SANITIZE_EMAIL);
  }

  private static function sanitizeDate(string $dirtyDate): string {
    if (strtotime($dirtyDate) === false) {
      echo json_encode(['error' => 'Invalid date.']);
      exit();
    };
    if (date('Y-m-d', strtotime($dirtyDate)) !== $dirtyDate) {
      echo json_encode(['error' => 'Invalid date.']);
      exit();
    };
    return $dirtyDate;
  }

  private static function sanitizeNumber(string $dirtyNumber): string {
    if (!is_numeric($dirtyNumber)) {
      echo json_encode(['error' => $dirtyNumber]);
      exit();
    };
    if ($dirtyNumber < 0 || $dirtyNumber > 100) {
      echo json_encode(['error' => 'Number must be between 0 and 100.']);
      exit();
    };
    if (intval($dirtyNumber) != $dirtyNumber) {
      echo json_encode(['error' => 'Invalid number.']);
      exit();
    }
    return $dirtyNumber;
  }
}
