
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const useAuthentication = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const signInOrSignUp = async (email: string, password: string) => {
    setLoading(true);

    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message === "Invalid login credentials") {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: window.location.origin,
            },
          });

          if (signUpError) {
            console.error("Signup error:", signUpError);
            throw signUpError;
          }

          if (!signUpData.session) {
            toast({
              title: "Account created",
              description: "Please check your email to verify your account.",
            });
          } else {
            toast({
              title: "Welcome!",
              description: "Your account has been created successfully.",
            });
            navigate("/");
          }
        } else {
          throw signInError;
        }
      } else if (signInData.session) {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        navigate("/");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Authentication error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (email: string, onSuccess: () => void) => {
    try {
      if (!email) {
        toast({
          title: "Error",
          description: "Please enter your email address",
          variant: "destructive",
        });
        return;
      }

      // Generate a reset token
      const resetToken = Math.random().toString(36).substring(2, 15);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      // Send password reset email
      const { error } = await supabase.functions.invoke('send-reset-password', {
        body: { email, resetToken }
      });

      if (error) throw error;

      toast({
        title: "Reset Instructions Sent",
        description: "Please check your email for instructions to reset your password.",
      });

      onSuccess();
    } catch (error: any) {
      console.error('Error handling password reset:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while processing your request.",
        variant: "destructive",
      });
    }
  };

  return {
    loading,
    signInOrSignUp,
    handleForgotPassword,
  };
};
