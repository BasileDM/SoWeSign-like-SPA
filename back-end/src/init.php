<?php
session_start();

use src\Models\Database;

require_once __DIR__ . '/autoload.php';
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/router.php';

if (DB_INITIALIZED === false) {
  $db = new Database;
  $db->init();
}
