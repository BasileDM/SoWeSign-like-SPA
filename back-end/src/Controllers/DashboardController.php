<?php

namespace src\Controllers;

use src\Repositories\ClassRepository;

final class DashboardController {

  public static function getClasses(): void {
    $classesRepo = new ClassRepository();
    $todaysClasses = $classesRepo->getTodaysClasses();
    header('Content-Type: application/json');
    echo json_encode(['success' => 'Classes returned', 'todaysClasses1' => $todaysClasses[0], 'todaysClasses2' => $todaysClasses[1]]);
  }
}
