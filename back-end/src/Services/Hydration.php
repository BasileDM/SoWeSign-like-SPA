<?php

namespace src\Services;

trait Hydration {
  public function __construct(array $data = []) {
    $this->hydrate($data);
  }

  public function __set($name, $value) {
    $this->hydrate([$name => $value]);
  }

  /**
   * Hydrates an object with data.
   *
   * @param array $data The data to hydrate the object with.
   * @return void
   */
  private function hydrate(array $data): void {
    $setter = "set";
    foreach ($data as $key => $value) {
      $parts = explode("_", $key);
      foreach ($parts as $part) {
        $part = strtolower($part);
        $part = ucfirst($part);
        $setter .= $part;
      }
      $this->$setter($value);
    }
  }
}
