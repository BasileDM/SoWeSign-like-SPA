<?php

namespace src\Controllers;

use src\Repositories\ClassRepository;

final class DashboardController {

  public static function getClasses(): void {
    $classesRepo = new ClassRepository();
    $todaysClasses = $classesRepo->getTodaysClasses();

    $serializedClasses = array_map(function($class) {
      return $class->jsonSerialize();
    }, $todaysClasses);

    header('Content-Type: application/json');
    echo json_encode(['success' => 'Classes returned', 'todaysClasses' => $serializedClasses]);
  }
}

