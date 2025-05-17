
import React, { useState } from "react";
import { AlertCircle, Shield } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordStrengthChecker from "./PasswordStrengthChecker";
import { usePasswordStrength } from "@/hooks/usePasswordStrength";

interface RegisterFormProps {
  onSubmit: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { passwordStrength, checkPasswordStrength } = usePasswordStrength();

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    checkPasswordStrength(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordStrength.score < 3) {
      toast.error("Please create a stronger password");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(email, password, firstName, lastName);
    } catch (error) {
      // Error is handled in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Create an account to save your book customizations and orders.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="registerEmail">Email</Label>
            <Input 
              id="registerEmail"
              type="email" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="registerPassword">Password</Label>
            <Input
              id="registerPassword"
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              required
              className={password && `border-${
                passwordStrength.score >= 4 ? "green" :
                passwordStrength.score >= 3 ? "yellow" :
                passwordStrength.score >= 2 ? "orange" : "red"
              }-500`}
            />
            {password && <PasswordStrengthChecker passwordStrength={passwordStrength} />}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={
                confirmPassword && password !== confirmPassword
                  ? "border-red-500"
                  : ""
              }
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-sm text-red-600 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" /> Passwords don't match
              </p>
            )}
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
            <div className="flex">
              <div className="ml-1">
                <p className="text-sm text-blue-700">
                  Strong passwords and MFA help protect your account from unauthorized access.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-book-red hover:bg-red-700"
            disabled={isSubmitting || 
              !email || 
              !password || 
              passwordStrength.score < 3 ||
              password !== confirmPassword}
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RegisterForm;
