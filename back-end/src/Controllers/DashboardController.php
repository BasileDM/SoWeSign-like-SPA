<?php

namespace src\Controllers;

final class DashboardController {

  public static function getClasses(): void {
    header('Content-Type: application/json');
    echo json_encode(['page' => 'dashboard']);
  }
}
