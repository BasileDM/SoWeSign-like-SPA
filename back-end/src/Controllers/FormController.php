<?php

namespace src\Controllers;

use src\Repositories\PromRepository;

class FormController {

/**
 * Handles the promotion form based on the given CRUD type and form content.
 *
 * @param string $crudType The CRUD type ('create', 'read', 'update', 'delete').
 * @param array $formContent The form content containing the promotion details.
 * @return void echoes a JSON response with the success/error message and dies.
 */
  public function handlePromotionForm(string $crudType, array $formContent): void {
    $promrepo = new PromRepository();
    if ($crudType === 'create') {
      $name = self::sanitizeString($formContent[0]);
      $startDate = self::sanitizeDate($formContent[1]);
      $endDate = self::sanitizeDate($formContent[2]);
      $availableSpots = self::sanitizeNumber($formContent[3]);
      $promrepo->create($name, $startDate, $endDate, $availableSpots);
      header('Content-Type: application/json');
      echo json_encode(['success' => 'Promotion created.', 'crudType' => $crudType, 'formContent' => $formContent]);
      die();
    }
  }

  public function handleUserForm() {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $promotion = $_POST['promotion'];
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
      echo json_encode(['error' => 'Invalid number.']);
      exit();
    };
    if ($dirtyNumber < 0) {
      echo json_encode(['error' => 'Invalid number.']);
      exit();
    };
    if ($dirtyNumber > 100) {
      echo json_encode(['error' => 'Invalid number.']);
      exit();
    };
    // return another error if the number is not an integer
    if (intval($dirtyNumber) != $dirtyNumber) {
      echo json_encode(['error' => 'Invalid number.']);
      exit();
    }
    return $dirtyNumber;
  }
}
