<?php

namespace src\Repositories;

use src\Models\Database;

class UserRepository {
  private $db;

  public function __construct() {
    $database = new Database();
    $this->db = $database->getDb();
  }
  
}
