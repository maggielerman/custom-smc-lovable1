
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ArrowLeft, Loader2, QrCode, ShieldCheck } from "lucide-react";

const MFASetup = () => {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  
  useEffect(() => {
    // Check if the user is logged in
    if (!user) {
      navigate("/auth", { state: { from: location } });
      return;
    }
    
    // Check if user already has MFA set up
    checkExistingMFA();
  }, [user, navigate]);
  
  const checkExistingMFA = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      
      if (error) throw error;
      
      const totpFactor = data.totp.find(factor => factor.factor_type === 'totp');
      if (totpFactor && totpFactor.status === 'verified') {
        setSetupComplete(true);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to check MFA status");
    }
  };
  
  const setupMFA = async () => {
    try {
      setIsLoading(true);
      
      // Enroll MFA TOTP factor
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
      });
      
      if (error) throw error;
      
      if (data) {
        setFactorId(data.id);
        setQrCode(data.totp.qr_code);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to set up MFA");
    } finally {
      setIsLoading(false);
    }
  };
  
  const verifyMFA = async () => {
    if (!factorId || !verifyCode) {
      toast.error("Please enter the verification code from your authenticator app");
      return;
    }
    
    try {
      setIsVerifying(true);
      
      // Challenge and verify the factor
      const { data, error } = await supabase.auth.mfa.challenge({
        factorId: factorId,
      });
      
      if (error) throw error;
      
      const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
        factorId: factorId,
        challengeId: data.id,
        code: verifyCode,
      });
      
      if (verifyError) throw verifyError;
      
      toast.success("MFA successfully set up!");
      setSetupComplete(true);
      
      // Redirect to account settings after a short delay
      setTimeout(() => {
        navigate("/profile/settings");
      }, 2000);
      
    } catch (error: any) {
      toast.error(error.message || "Failed to verify MFA code");
    } finally {
      setIsVerifying(false);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Set Up MFA | Little Origins Books</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShieldCheck className="mr-2 h-5 w-5 text-green-500" />
              Multi-Factor Authentication
            </CardTitle>
            <CardDescription>
              Add an extra layer of security to your account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {setupComplete ? (
              <div className="text-center py-6">
                <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 mx-auto flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium text-green-700 mb-2">MFA is Active</h3>
                <p className="text-gray-600 mb-4">
                  Your account is protected with multi-factor authentication.
                </p>
                <Button onClick={() => navigate("/profile/settings")} className="mt-2">
                  Return to Settings
                </Button>
              </div>
            ) : qrCode ? (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <p className="text-gray-600">
                    Scan this QR code with your authenticator app (like Google Authenticator, Authy, or Microsoft Authenticator)
                  </p>
                  
                  <div className="flex justify-center py-4">
                    <img 
                      src={qrCode} 
                      alt="QR Code for MFA" 
                      className="border border-gray-300 rounded-md p-3"
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4 pt-2">
                  <Label htmlFor="verifyCode">Enter the 6-digit code from your authenticator app</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="verifyCode" 
                      placeholder="000000" 
                      value={verifyCode}
                      maxLength={6}
                      onChange={(e) => setVerifyCode(e.target.value.replace(/[^0-9]/g, ''))}
                    />
                    <Button 
                      onClick={verifyMFA} 
                      disabled={isVerifying || verifyCode.length !== 6}
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Verifying
                        </>
                      ) : "Verify"}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-gray-600">
                  Multi-factor authentication (MFA) adds an extra layer of security to your account. 
                  Once set up, you'll need both your password and a 6-digit code from an authenticator app to sign in.
                </p>
                
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-amber-700">
                        Before proceeding, download an authenticator app like Google Authenticator, 
                        Microsoft Authenticator, or Authy if you don't already have one.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button onClick={setupMFA} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    <>
                      <QrCode className="h-4 w-4 mr-2" />
                      Set up MFA
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
          
          {!setupComplete && !qrCode && (
            <CardFooter className="flex justify-center border-t pt-6">
              <p className="text-sm text-gray-500">
                You can also set up MFA later in your account settings
              </p>
            </CardFooter>
          )}
        </Card>
      </div>
    </>
  );
};

export default MFASetup;
