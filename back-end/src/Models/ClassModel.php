<?php

namespace src\Models;

use src\Services\Hydration;

final class ClassModel {
  private int $Id;
  private string $StartTime;
  private string $EndTime;
  private int $Code;
  private int $IdPromotion;

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
   * Get the value of StartTime
   */
  public function getStartTime(): string {
    return $this->StartTime;
  }

  /**
   * Set the value of StartTime
   *
   * @param   string  $StartTime  
   * 
   */
  public function setStartTime(string $StartTime) {
    $this->StartTime = $StartTime;
  }

  /**
   * Get the value of EndTime
   */
  public function getEndTime(): string {
    return $this->EndTime;
  }

  /**
   * Set the value of EndTime
   *
   * @param   string  $EndTime  
   * 
   */
  public function setEndTime(string $EndTime) {
    $this->EndTime = $EndTime;
  }

  /**
   * Get the value of Code
   */
  public function getCode(): int {
    return $this->Code;
  }

  /**
   * Set the value of Code
   *
   * @param   int  $Code  
   * 
   */
  public function setCode(int $Code) {
    $this->Code = $Code;
  }

  /**
   * Get the value of IdPromotion
   */
  public function getIdPromotion(): int {
    return $this->IdPromotion;
  }

  /**
   * Set the value of IdPromotion
   *
   * @param   int  $IdPromotion  
   * 
   */
  public function setIdPromotion(int $IdPromotion) {
    $this->IdPromotion = $IdPromotion;
  }

  public function jsonSerialize(): mixed {
    return [
      'Id' => $this->Id,
      'StartTime' => $this->StartTime,
      'EndTime' => $this->EndTime,
      'Code' => $this->Code,
      'IdPromotion' => $this->IdPromotion
    ];
  }
}
