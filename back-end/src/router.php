<?php

$url = parse_url($_SERVER['REQUEST_URI']);
$method = $_SERVER['REQUEST_METHOD'];

switch ($url) {
  case '/':
    echo 'Hello, World!';
    break;
  default:
    http_response_code(404);
}