<?php

namespace src\Controllers;

use src\Repositories\ClassRepository;
use src\Repositories\UserRepository;

class AuthController {

  /**
   * login function to authenticate user with provided email and password.
   *
   * @param string $mail : Email of the user trying to login
   * @param string $pass : Password of the user trying to login
   * @return void Sends a JSON response with a success message and a token.
   */
  public static function login(string $mail, string $pass): void {
    $userRepo = new UserRepository();
    $user = $userRepo->getByMail($mail);
    if (!$user) {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Wrong mail or password.']);
      die();
    }
    if (!$user->isActivated() || $user->getPassword() === null) {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Le compte n\'est pas activé. Veuillez vérifier vos mails.']);
      die();
    }
    if (!password_verify($pass, $user->getPassword())) {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Wrong mail or password.']);
      die();
    }
    $token = self::generateToken($user->getMail(), $user->getId(), $user->getIdRole());
    header('Content-Type: application/json');
    echo json_encode(['success' => 'Login successful.', 'page' => 'dashboard', 'token' => $token]);
    die();
  }

  /**
   * Generates a JWT token with the provided user ID and email.
   * 
   * @param string $userMail : Email of the user
   * @param string $userId : ID of the user
   * @return string
   */
  public static function generateToken(string $userMail, string $userId, string $role): string {
    // Function to encode to base64url
    function base64UrlEncode($data) {
      return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    // Header
    $header = [
      'alg' => 'HS256',
      'typ' => 'JWT'
    ];
    $encodedHeader = base64UrlEncode(json_encode($header));

    // Payload
    $payload = [
      'ID' => $userId,
      'mail' => $userMail,
      'role' => $role,
      'iat' => time()
    ];
    $encodedPayload = base64UrlEncode(json_encode($payload));

    // Secret key
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
   * @param string $token : The JWT token to check.
   * @return bool Returns true if the signature is valid, false otherwise.
   */
  public static function checkTokenSignature(string $token): bool {
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

  /**
   * A function to check if the token has expired after 1 hour.
   *
   * @param string $token : The token to be checked for expiration
   * @return bool Returns true if the token has not expired, false otherwise
   */
  public static function checkTokenTime(string $token): bool {
    // the token should expire after 1 hour
    $jwt = explode('.', $token);
    $payload = json_decode(base64_decode($jwt[1]), true);
    $exp = $payload['iat'] + 3600;
    return $exp > time();
  }

  /**
   * Get the time left for a token to expire.
   *
   * @param string $token : The JWT token to analyze.
   * @return int The time left in seconds before the token expires.
   */
  public static function getTokenTimeLeft(string $token): int {
    $jwt = explode('.', $token);
    $payload = json_decode(base64_decode($jwt[1]), true);
    $exp = $payload['iat'] + 3600;
    return $exp - time();
  }

  /**
   * Get the payload from a JWT token.
   *
   * @param string $token The JWT token from which to extract the payload.
   * @return array The decoded payload data from the token.
   */
  public static function getTokenPayload(string $token): array {
    $jwt = explode('.', $token);
    $payload = json_decode(base64_decode($jwt[1]), true);
    return $payload;
  }

  /**
   * A function to check token security and validation.
   *
   * @param string $token The token to be checked for security.
   * @return void Sends a JSON response with an error message and exits if the token doesn't pass security checks.
   */
  public static function securityCheck(string $token): void {
    if (!isset($token)) {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'No token provided.']);
      exit();
    }
    if (!self::checkTokenSignature($token)) {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Error : Bad token.']);
      exit();
    }
    if (!self::checkTokenTime($token)) {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Error : Expired token, please log in again.']);
      exit();
    }
  }

  /**
   * Generate a class code
   *
   * @param string $classId
   * @return string
   */
  public static function generateClassCode($classId): string {
    $chars = '123456789';
    $length = 5;
    $code = '';
    for ($i = 0; $i < $length; $i++) {
      $code .= $chars[rand(0, strlen($chars) - 1)];
    }
    $classRepo = new ClassRepository();
    $classRepo->addCode($classId, $code);
    return (string) $code;
  }

  /**
   * Record the signature for a user in a class.
   *
   * @param string $submittedCode The code submitted by the user.
   * @param string $classId The ID of the class.
   * @param string $userId The ID of the user.
   * @param int $presence Status The presence status of the user, either  1 for presence or 2 for late.
   * @return void Sends a JSON response with a success or error message and exits.
   */
  public static function recordSignature(string $submittedCode, string $classId, string $userId, int $presenceStatus): void {
    $classRepo = new ClassRepository();
    $classCode = $classRepo->getClassCode($classId);
    if ($submittedCode !== $classCode) {
      header('Content-Type: application/json');
      echo json_encode(['error' => 'Invalid code.']);
      exit();
    }
    $classRepo->addPresenceStatus($userId, $classId, $presenceStatus);
    echo json_encode(['success' => $presenceStatus === 1 ? 'Votre présence a été enregistrée.' : 'Vous avez été enregistré(e) en retard !']);
  }

  /**
   * Hashes the given email with the JWT secret using SHA-256 algorithm.
   *
   * @param string $mail The email to be hashed.
   * @return string The hashed email.
   */
  public static function hashMail(string $mail): string {
    $mailAndKey = JWT_SECRET . $mail;
    return hash('sha256', $mailAndKey);
  }

  public static function compareHashedMails(string $code, array $unactivatedMails): string|null {
    foreach ($unactivatedMails as $unactivatedMail) {
      if (hash_equals(self::hashMail($unactivatedMail['MAIL']), $code)) {
        return $unactivatedMail['MAIL'];
      } else {
        return null;
      }
    }
  }

  public static function activate(string $code, string $pass): bool {
    $hashedPass = password_hash($pass, PASSWORD_DEFAULT);
    $userRepo = new UserRepository();
    $unactivatedMails = $userRepo->getUnactivatedMails();
    if ($mailToActivate = self::compareHashedMails($code, $unactivatedMails)) {
      $userRepo->activate($mailToActivate, $hashedPass);
      return true;
    } else {
      return false;
    }
  }
}
