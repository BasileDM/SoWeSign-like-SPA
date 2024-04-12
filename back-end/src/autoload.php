<?php

spl_autoload_register('loadClasses');

/**
 * Load classes dynamically based on the provided class name.
 *
 * @param string $class The class name to be loaded.
 * @throws Exception Class file not found.
 * @return void
 */
function loadClasses(string $class): void {
  $class = str_replace('src', '', $class);
  $class = str_replace('\\', '/', $class);
  $class = $class . '.php';

  if (file_exists(__DIR__ . $class)) {
    require_once __DIR__ . $class;
  } else {
    throw new Exception('Class : ' . $class . '.php not found.');
  }
}
