<?php

namespace src\Controllers;

use src\Repositories\ClassRepository;
use src\Repositories\PromRepository;
use src\Repositories\UserRepository;

final class DashboardController {
  /**
   * Retrieves the classes for a given user ID, serializes them, and returns them as JSON response.
   *
   * @param string $userId The ID of the user to fetch classes for
   * @param string $userRole The role of the user
   * @return void
   */
  public static function getClasses(string $userId, string $userRole): void {
    $classesRepo = new ClassRepository();
    $userRepo = new UserRepository();
    $userPromId = $userRepo->getUserPromotionId($userId);
    $todaysClasses = $classesRepo->getTodaysClasses($userPromId);

    $serializedClasses = array_map(function($class) {
      return $class->jsonSerialize();
    }, $todaysClasses);

    $promRepo = new PromRepository();
    $promName = $promRepo->getPromName($userPromId);
    $studentsNumber = $promRepo->getStudentsNumber($userPromId);

    // Add additional properties to each class
    array_walk($serializedClasses, function(&$class) use ($promName, $studentsNumber, $userRepo, $userId) {
      $class['PromName'] = $promName;
      $class['StudentsNumber'] = $studentsNumber;
      $class['userStatus'] = $userRepo->getStatus($userId, $class['Id']);
    });

    // if $userRole is "1" remove Code property from the array
    if ($userRole === "1") {
      array_walk($serializedClasses, function(&$class) {
        unset($class['Code']);
      });
    }

    header('Content-Type: application/json');
    echo json_encode(['success' => 'Classes returned', 'todaysClasses' => $serializedClasses]);
    exit();
  }
}

