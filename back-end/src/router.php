<?php

$url = $_SERVER['REQUEST_URI'];
$url = parse_url($url, PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

switch ($url) {

  case HOME_URL:
    var_dump($url);
    echo 'Hello, World!';
    break;
    
  case HOME_URL . '/a':
    var_dump($url);
    echo 'nope';
    break;

  default:
  var_dump($url);
  die();
    http_response_code(404);
}