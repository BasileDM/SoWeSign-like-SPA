<?php

use src\Controllers\AuthController;

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
    if (!$method == 'POST' || !isset($request['mail']) || !isset($request['password'])) {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Invalid request.']);
      exit();
    }
    if (!AuthController::login($request['mail'], $request['password'])) {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Wrong mail or password.']);
      exit();
    }
    header('Content-Type: application/json');
    echo json_encode(['success' => 'Login successful.', 'page' => 'dashboard']);
    break;

  case HOME_URL . 'dashboard':
    if (!AuthController::isLoggedIn()) {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Not authenticated.']);
      exit();
    }
    $dashboardHTML = file_get_contents(__DIR__ . '/Views/dashboard.html');
    header('Content-Type: application/json');
    $dashboardJSON = json_encode(['dashboard' => $dashboardHTML]);
    echo $dashboardJSON;
    break;

  default:
    header('Content-Type: application/json');
    echo json_encode('404');
    break;
}
