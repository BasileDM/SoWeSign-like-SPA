<?php

use src\Controllers\AuthController;
use src\Controllers\DashboardController;

$url = $_SERVER['REQUEST_URI'];
$url = parse_url($url, PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];
$request = json_decode(file_get_contents('php://input'), true);

switch ($url) {

  case HOME_URL:
    echo 'Current url: ' . $url . '<br>';
    echo 'Welcome to the API.';
    break;

  case HOME_URL . 'login':
    if ($method !== 'POST' || !isset($request['mail']) || !isset($request['password'])) {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Invalid request.']);
      exit();
    }
    AuthController::login($request['mail'], $request['password']);
    break;

  case HOME_URL . 'dashboard':
    if (!AuthController::checkTokenSignature($request['token'])) {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Error : Bad token.']);
      exit();
    }
    if (!AuthController::checkTokenTime($request['token'])) {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Error : Expired token, please log in again.']);
      exit();
    }
    $dashboardHTML = file_get_contents(__DIR__ . '/Views/dashboard.html');
    header('Content-Type: application/json');
    echo json_encode(['success' => 'Dashboard loaded.', 'dashboard' => $dashboardHTML]);
    break;

  case HOME_URL . 'getclasses':
    if (!AuthController::checkTokenSignature($request['token'])) {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Error : Bad token.']);
      exit();
    }
    if (!AuthController::checkTokenTime($request['token'])) {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Error : Expired token, please log in again.']);
      exit();
    }
    DashboardController::getClasses();
    break;

  default:
    header('Content-Type: application/json');
    echo json_encode('404');
    break;
}
