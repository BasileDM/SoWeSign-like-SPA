<?php

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
    
    break;

    case HOME_URL . 'dashboard':
      echo json_encode('This is the dashboard HTML !');
      break;

  default:
    echo json_encode('404');
    break;
}