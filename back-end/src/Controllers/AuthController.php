<?php

namespace src\Controllers;

use src\Repositories\UserRepository;

class AuthController {
  /**
   * login function to authenticate user with provided email and password.
   *
   * @param string $mail email of the user trying to login
   * @param string $pass password of the user trying to login
   */
  public static function login(string $mail, string $pass) {
    $userRepo = new UserRepository();
    $user = $userRepo->getByMail($mail);
    if (!$user) {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Wrong mail or password.']);
      die();
    }
    if (!password_verify($pass, $user->getPassword())) {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Wrong mail or password.']);
      die();
    }
    $token = self::generateToken($user->getMail(), $user->getId());
    header('Content-Type: application/json');
    echo json_encode(['success' => 'Login successful.', 'page' => 'dashboard', 'token' => $token]);
    die();
  }

  /**
   * Generates a JWT token.
   * 
   * @return string
   */
  public static function generateToken($userMail, $userId): string {
    // Fonction pour encoder en base64url
    function base64UrlEncode($data) {
      return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    // En-tête
    $header = [
      'alg' => 'HS256',
      'typ' => 'JWT'
    ];
    $encodedHeader = base64UrlEncode(json_encode($header));

    // Payload
    $payload = [
      'ID' => $userId,
      'mail' => $userMail,
      'iat' => time()
    ];
    $encodedPayload = base64UrlEncode(json_encode($payload));

    // Clé secrète
    $secret = JWT_SECRET;

    // Signature
    $signature = hash_hmac('sha256', $encodedHeader . '.' . $encodedPayload, $secret, true);
    $encodedSignature = base64UrlEncode($signature);

    // JWT
    $jwt = $encodedHeader . '.' . $encodedPayload . '.' . $encodedSignature;

    return $jwt;
  }

  /**
   * Check the signature of a JWT token.
   *
   * @param string $token The JWT token to check.
   * @return bool Returns true if the signature is valid, false otherwise.
   */
  public static function checkTokenSignature($token): bool {
    $jwt = explode('.', $token);
    if (count($jwt) !== 3) {
        return false; // Invalid JWT format
    }
    
    $header = base64_decode(str_replace(['-', '_'], ['+', '/'], $jwt[0]));
    $payload = base64_decode(str_replace(['-', '_'], ['+', '/'], $jwt[1]));
    $signature = base64_decode(str_replace(['-', '_'], ['+', '/'], $jwt[2]));
    
    $newSignature = hash_hmac('sha256', $jwt[0] . '.' . $jwt[1], JWT_SECRET, true);
    
    return hash_equals($signature, $newSignature);
  }

  public static function checkTokenTime($token): bool {
    // the token should expire after 1 hour
    $jwt = explode('.', $token);
    $payload = json_decode(base64_decode($jwt[1]), true);
    $exp = $payload['iat'] + 3600;
    return $exp > time();
  }

  public static function getTokenTimeLeft($token): int {
    $jwt = explode('.', $token);
    $payload = json_decode(base64_decode($jwt[1]), true);
    $exp = $payload['iat'] + 3600;
    return $exp - time();
  }
}
