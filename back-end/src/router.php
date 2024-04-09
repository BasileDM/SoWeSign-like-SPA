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

  case HOME_URL . 'a':
    echo json_encode('A response from back-end-url/a route ! ' . $request['mail'] . ' ' . $request['password']);
    break;

  case HOME_URL . 'b':
    echo json_encode('A response from back-end-url/b route !' . $request['mail'] . ' ' . $request['password']);
    break;

  default:
    echo json_encode('404');
    break;
}