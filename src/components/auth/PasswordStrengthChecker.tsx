
import React from "react";
import { Check, X } from "lucide-react";

interface PasswordStrength {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
  score: number;
}

interface PasswordStrengthCheckerProps {
  passwordStrength: PasswordStrength;
}

const PasswordStrengthChecker: React.FC<PasswordStrengthCheckerProps> = ({ passwordStrength }) => {
  return (
    <div className="mt-2 space-y-2">
      <p className="text-sm font-medium">
        Password strength: 
        <span className={`ml-1 ${
          passwordStrength.score >= 4 ? "text-green-600" : 
          passwordStrength.score >= 3 ? "text-yellow-600" :
          "text-red-600"
        }`}>
          {passwordStrength.score >= 4 ? "Strong" : 
           passwordStrength.score >= 3 ? "Good" : 
           passwordStrength.score >= 2 ? "Fair" : 
           "Weak"}
        </span>
      </p>
      <div className="space-y-1 text-sm">
        <div className="flex items-center">
          {passwordStrength.length ? 
            <Check className="h-4 w-4 text-green-500 mr-1" /> : 
            <X className="h-4 w-4 text-red-500 mr-1" />}
          <span>At least 8 characters</span>
        </div>
        <div className="flex items-center">
          {passwordStrength.uppercase ? 
            <Check className="h-4 w-4 text-green-500 mr-1" /> : 
            <X className="h-4 w-4 text-red-500 mr-1" />}
          <span>Uppercase letter (A-Z)</span>
        </div>
        <div className="flex items-center">
          {passwordStrength.lowercase ? 
            <Check className="h-4 w-4 text-green-500 mr-1" /> : 
            <X className="h-4 w-4 text-red-500 mr-1" />}
          <span>Lowercase letter (a-z)</span>
        </div>
        <div className="flex items-center">
          {passwordStrength.number ? 
            <Check className="h-4 w-4 text-green-500 mr-1" /> : 
            <X className="h-4 w-4 text-red-500 mr-1" />}
          <span>Number (0-9)</span>
        </div>
        <div className="flex items-center">
          {passwordStrength.special ? 
            <Check className="h-4 w-4 text-green-500 mr-1" /> : 
            <X className="h-4 w-4 text-red-500 mr-1" />}
          <span>Special character (!@#$...)</span>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthChecker;
