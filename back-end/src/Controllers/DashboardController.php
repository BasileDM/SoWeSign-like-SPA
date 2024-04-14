<?php

namespace src\Controllers;

use src\Repositories\ClassRepository;
use src\Repositories\UserRepository;

final class DashboardController {

  /**
   * Retrieves the classes for a given user ID, serializes them, and returns them as JSON response.
   *
   * @param string $userId The ID of the user to fetch classes for
   */
  public static function getClasses(string $userId): void {
    $classesRepo = new ClassRepository();
    $userRepo = new UserRepository();
    $userProm = $userRepo->getUserPromotion($userId);
    $todaysClasses = $classesRepo->getTodaysClasses($userProm);

    $serializedClasses = array_map(function($class) {
      return $class->jsonSerialize();
    }, $todaysClasses);

    header('Content-Type: application/json');
    echo json_encode(['success' => 'Classes returned', 'todaysClasses' => $serializedClasses]);
    exit();
  }
}

