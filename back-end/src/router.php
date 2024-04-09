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
    echo 'A page here !';
    break;

  default:
    http_response_code(404);
}