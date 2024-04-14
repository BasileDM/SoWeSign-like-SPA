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
   * @return void
   */
  public static function getClasses(string $userId): void {
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
    // Add a property to the serialized classes called promName with the value of the variable $promName
    array_walk($serializedClasses, function(&$class) use ($promName, $studentsNumber) {
      $class['PromName'] = $promName;
      $class['StudentsNumber'] = $studentsNumber;
    });

    header('Content-Type: application/json');
    echo json_encode(['success' => 'Classes returned', 'todaysClasses' => $serializedClasses]);
    exit();
  }
}

