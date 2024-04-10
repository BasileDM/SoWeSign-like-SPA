<?php

namespace src\Controllers;

use src\Repositories\UserRepository;

class AuthController {
  /**
   * login function to authenticate user with provided email and password.
   *
   * @param string $mail email of the user trying to login
   * @param string $pass password of the user trying to login
   * @return bool returns true if login is successful, false otherwise
   */
  public static function login(string $mail, string $pass): bool {
    $userRepo = new UserRepository();
    $user = $userRepo->getByMail($mail);
    if (!$user) {
      return false;
    }
    if (!password_verify($pass, $user->getPassword())) {
      return false;
    }
    $_SESSION['user_mail'] = $user->getMail();
    $_SESSION['user_id'] = $user->getId();
    $_SESSION['user_role'] = $user->getIdRole();

    return true;
  }

  public static function cryptPassword($pass) {
    return password_hash($pass, PASSWORD_DEFAULT);
  }
}
