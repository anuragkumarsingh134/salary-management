
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
      // First, check if user exists by trying to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // Check if user exists but is not confirmed
        const { data: userCheck } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (userCheck.user && !userCheck.session) {
          // User exists but email not confirmed
          toast({
            title: "Email Not Confirmed",
            description: "Please check your email and confirm your account before signing in.",
            variant: "destructive",
          });
          return;
        }

        if (signInError.message === "Invalid login credentials") {
          // If user doesn't exist, sign them up
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

          toast({
            title: "Account created",
            description: "Please check your email to verify your account.",
          });
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

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
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
