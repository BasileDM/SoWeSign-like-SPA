<?php

$url = $_SERVER['REQUEST_URI'];
$url = parse_url($url, PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

switch ($url) {

  case HOME_URL:
    var_dump($url);
    echo 'Hello, World! Home.';
    break;

  case HOME_URL . 'a':
    echo json_encode('A response from back-end-url/a route !');
    break;

  case HOME_URL . 'b':
    echo json_encode('A response from back-end-url/b route !');
    break;

  default:
    http_response_code(404);
}