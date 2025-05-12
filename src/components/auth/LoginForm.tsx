
import React, { useState } from "react";
import { toast } from "sonner";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onGoogleSignIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Login form: Attempting to sign in");
      await onSubmit(email, password);
      console.log("Login form: Sign in attempt completed");
    } catch (error: any) {
      console.error("Login form error:", error);
      // Error is handled in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleSubmitting(true);
      await onGoogleSignIn();
    } catch (error) {
      // Error is handled in the parent component
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Sign in to access your account and saved books.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting || isGoogleSubmitting}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting || isGoogleSubmitting}
              required
            />
          </div>
          <div className="flex justify-end">
            <Button 
              type="button" 
              variant="link" 
              className="text-sm text-book-red p-0 h-auto"
              onClick={() => toast.info("Password reset available on your Clerk account page")}
            >
              Forgot password?
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button 
            type="submit" 
            className="w-full bg-book-red hover:bg-red-700"
            disabled={isSubmitting || isGoogleSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2 inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Signing in...
              </>
            ) : "Sign In"}
          </Button>
          
          <div className="relative my-2">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-muted-foreground">
              OR
            </span>
          </div>
          
          <Button 
            type="button" 
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting || isGoogleSubmitting}
          >
            {isGoogleSubmitting ? (
              <>
                <span className="animate-spin mr-2 inline-block h-4 w-4 border-2 border-black border-t-transparent rounded-full"></span>
                Connecting...
              </>
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Continue with Google
              </>
            )}
          </Button>
          
          <div className="text-center mt-2">
            <div className="flex items-center justify-center text-sm">
              <Shield className="h-4 w-4 text-green-600 mr-1" />
              <span>Secure authentication</span>
            </div>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
