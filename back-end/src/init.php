<?php
session_start();

use src\Models\Database;

require_once __DIR__ . '/autoload.php';
require_once __DIR__ . '/../config.php';

if (DB_INITIALIZED === false) {
  $db = new Database;
  $db->init();
}
require_once __DIR__ . '/router.php';

