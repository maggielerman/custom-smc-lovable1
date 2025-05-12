
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Helmet } from "react-helmet";
import { toast } from "sonner";
import { AlertCircle, Check, X, Shield } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, signUp, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password strength check
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    score: 0
  });

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user && !loading) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location]);

  // Set active tab based on query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab === "register") {
      setActiveTab("register");
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Check password strength when password field changes
    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

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
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsSubmitting(true);
      await signIn(formData.email, formData.password);
      // No need to navigate, useEffect will handle it
    } catch (error) {
      // Error is handled in the signIn function
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordStrength.score < 3) {
      toast.error("Please create a stronger password");
      return;
    }

    try {
      setIsSubmitting(true);
      const metadata = {
        first_name: formData.firstName || undefined,
        last_name: formData.lastName || undefined
      };
      
      await signUp(formData.email, formData.password, metadata);
      setActiveTab("login");
    } catch (error) {
      // Error is handled in the signUp function
    } finally {
      setIsSubmitting(false);
    }
  };

  // If still loading auth state, show loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-book-red"></div>
      </div>
    );
  }

  // Helper function to render password strength indicators
  const renderPasswordStrengthIndicator = () => {
    return (
      <div className="mt-2 space-y-2">
        <p className="text-sm font-medium">Password strength: 
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

  return (
    <>
      <Helmet>
        <title>{activeTab === "login" ? "Sign In" : "Create Account"} | Little Origins Books</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-md">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Create Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Sign in to access your account and saved books.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email" 
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      variant="link" 
                      className="text-sm text-book-red p-0 h-auto"
                      onClick={() => toast.info("Password reset feature coming soon")}
                    >
                      Forgot password?
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-book-red hover:bg-red-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing in..." : "Sign In"}
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
          </TabsContent>
          
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Create an account to save your book customizations and orders.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="registerEmail">Email</Label>
                    <Input 
                      id="registerEmail"
                      name="email"
                      type="email" 
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="registerPassword">Password</Label>
                    <Input
                      id="registerPassword"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={formData.password && `border-${
                        passwordStrength.score >= 4 ? "green" :
                        passwordStrength.score >= 3 ? "yellow" :
                        passwordStrength.score >= 2 ? "orange" : "red"
                      }-500`}
                    />
                    {formData.password && renderPasswordStrengthIndicator()}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className={
                        formData.confirmPassword && formData.password !== formData.confirmPassword
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
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
                      !formData.email || 
                      !formData.password || 
                      passwordStrength.score < 3 ||
                      formData.password !== formData.confirmPassword}
                  >
                    {isSubmitting ? "Creating account..." : "Create Account"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Auth;
