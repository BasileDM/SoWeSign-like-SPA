<?php

namespace src\Models;

use src\Services\Hydration;

final class User {
  private int $Id;
  private string $FirstName;
  private string $LastName;
  private string $Password;
  private bool $Activated;
  private string $Mail;
  private int $IdRole;

  use Hydration;

  /**
   * Get the value of Id
   */
  public function getId(): int {
    return $this->Id;
  }

  /**
   * Set the value of Id
   *
   * @param   int  $Id  
   * 
   */
  public function setId(int $Id) {
    $this->Id = $Id;
  }

  /**
   * Get the value of FirstName
   */
  public function getFirstName(): string {
    return $this->FirstName;
  }

  /**
   * Set the value of FirstName
   *
   * @param   string  $FirstName  
   * 
   */
  public function setFirstName(string $FirstName) {
    $this->FirstName = $FirstName;
  }

  /**
   * Get the value of LastName
   */
  public function getLastName(): string {
    return $this->LastName;
  }

  /**
   * Set the value of LastName
   *
   * @param   string  $LastName  
   * 
   */
  public function setLastName(string $LastName) {
    $this->LastName = $LastName;
  }

  /**
   * Get the value of Password
   */
  public function getPassword(): string {
    return $this->Password;
  }

  /**
   * Set the value of Password
   *
   * @param   string  $Password  
   * 
   */
  public function setPassword(string $Password) {
    $this->Password = $Password;
  }

  /**
   * Get the value of Activated
   */
  public function isActivated(): bool {
    return $this->Activated;
  }

  /**
   * Set the value of Activated
   *
   * @param   bool  $Activated  
   * 
   */
  public function setActivated(bool $Activated) {
    $this->Activated = $Activated;
  }

  /**
   * Get the value of Mail
   */
  public function getMail(): string {
    return $this->Mail;
  }

  /**
   * Set the value of Mail
   *
   * @param   string  $Mail  
   * 
   */
  public function setMail(string $Mail) {
    $this->Mail = $Mail;
  }

  /**
   * Get the value of IdRole
   */
  public function getIdRole(): int {
    return $this->IdRole;
  }

  /**
   * Set the value of IdRole
   *
   * @param   int  $IdRole  
   * 
   */
  public function setIdRole(int $IdRole) {
    $this->IdRole = $IdRole;
  }
}
