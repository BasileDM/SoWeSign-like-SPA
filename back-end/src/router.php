<?php

use src\Controllers\AuthController;
use src\Controllers\DashboardController;
use src\Controllers\FormController;

$url = $_SERVER['REQUEST_URI'];
$url = parse_url($url, PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];
$request = json_decode(file_get_contents('php://input'), true);

if ($url !== HOME_URL . 'login' && $url !== HOME_URL && $url !== HOME_URL . 'activate') {
  AuthController::securityCheck($request['token']);
  $tokenPayload = AuthController::getTokenPayload($request['token']);
  $userId = $tokenPayload['ID'];
  $userRole = $tokenPayload['role'];
  $userMail = $tokenPayload['mail'];
}

switch ($url) {
  case HOME_URL:
    echo 'Current url: ' . $url . '<br>';
    echo 'Welcome to the API.';
    exit();
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
    $dashboardHTML = file_get_contents(__DIR__ . '/Views/dashboard.html');
    header('Content-Type: application/json');
    echo json_encode(['success' => 'Dashboard loaded.', 'dashboard' => $dashboardHTML]);
    break;

  case HOME_URL . 'getclasses':
    DashboardController::getClasses($userId, $userRole);
    break;

  case HOME_URL . 'getproms':
    $payload = AuthController::getTokenPayload($request['token']);
    if ($payload['role'] == '1') {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Permission denied.']);
      exit();
    }
    DashboardController::getPromotions();
    break;

  case HOME_URL . 'getstudents':
    $payload = AuthController::getTokenPayload($request['token']);
    if ($payload['role'] == '1') {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Permission denied.']);
      exit();
    }
    DashboardController::getStudents();
    break;

  case HOME_URL . 'getlatepresences':
    $payload = AuthController::getTokenPayload($request['token']);
    if ($payload['role'] == '1') {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Permission denied.']);
      exit();
    }
    DashboardController::getLatePresences();
    break;

  case HOME_URL . 'generatecode':
    $payload = AuthController::getTokenPayload($request['token']);
    if ($payload['role'] == '1') {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Permission denied.']);
      exit();
    }
    if ($method !== 'POST' || $userRole !== '2') {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Invalid request.']);
      exit();
    }
    echo json_encode(['success' => 'Code generated.', 'code' => AuthController::generateClassCode($request['classId'])]);
    break;

  case HOME_URL . 'sign':
    if ($method !== 'POST' || $userRole !== '1' || !isset($request['classId']) || !isset($request['submittedCode']) || !isset($request['presenceStatus'])) {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Invalid request.']);
      exit();
    }
    AuthController::recordSignature($request['submittedCode'], $request['classId'], $userId, $request['presenceStatus']);
    break;

  case HOME_URL . 'handleForm':
    if ($method !== 'POST' || $userRole === '1' || !isset($request['crudType']) || !isset($request['formCategory'])) {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Invalid request.']);
      exit();
    }
    $formController = new FormController();
    if ($request['formCategory'] === 'promotion') {
      $formController->handlePromotionForm($request['crudType'], $request['formContent']);
    }
    if ($request['formCategory'] === 'user') {
      $formController->handleUserForm($request['crudType'], $request['formContent']);
    }
    break;

  case HOME_URL . 'deleteuser':
    $payload = AuthController::getTokenPayload($request['token']);
    if ($payload['role'] == '1') {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Permission denied.']);
      exit();
    }
    if ($method !== 'POST' || $userRole === '1' || !isset($request['deleteUserId'])) {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Invalid request.']);
      exit();
    }
    $formController = new FormController();
    $formController->deleteUser($request['deleteUserId']);
    break;

  case HOME_URL . 'deleteprom':
    $payload = AuthController::getTokenPayload($request['token']);
    if ($payload['role'] == '1') {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Permission denied.']);
      exit();
    }
    if ($method !== 'POST' || $userRole === '1' || !isset($request['deletePromId'])) {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Invalid request.']);
      exit();
    }
    $formController = new FormController();
    $formController->deletePromotion($request['deletePromId']);
    break;

  case HOME_URL . 'activate':
    if ($method !== 'POST' || !isset($request['code']) || !isset($request['password']) || !isset($request['passwordConfirm'])) {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Invalid request.']);
      exit();
    }
    if ($request['password'] !== $request['passwordConfirm']) {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Les mots de passe ne sont pas identiques.']);
      exit();
    }
    if (strlen($request['password']) < 8) {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Le mot de passe doit contenir au moins 8 caractères.']);
      exit();
    }
    if (AuthController::activate($request['code'], $request['password'],)) {
      header('Content-Type: application/json');
      echo json_encode(['success' => 'Le compte a été activé, vous pouvez vous connecter.']);
    } else {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Erreur lors de l\'activation.']);
    }
    break;

  default:
    header('Content-Type: application/json');
    echo json_encode(['error' => '404 Not found.']);
    break;
}
