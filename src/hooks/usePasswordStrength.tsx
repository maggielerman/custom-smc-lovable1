
import { useState } from "react";

export interface PasswordStrength {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
  score: number;
}

export function usePasswordStrength() {
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    score: 0
  });

  const checkPasswordStrength = (password: string) => {
    const hasLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    // Calculate score (1 point for each condition met)
    const score = [hasLength, hasUppercase, hasLowercase, hasNumber, hasSpecial]
      .filter(Boolean).length;
    
    setPasswordStrength({
      length: hasLength,
      uppercase: hasUppercase,
      lowercase: hasLowercase,
      number: hasNumber,
      special: hasSpecial,
      score
    });

    return {
      score,
      isStrong: score >= 3
    };
  };

  return { passwordStrength, checkPasswordStrength };
}
