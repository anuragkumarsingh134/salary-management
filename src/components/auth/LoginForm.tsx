
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // If login fails, try to sign up
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/login`,
          },
        });

        if (signUpError) throw signUpError;

        toast({
          title: "Account created",
          description: "Please check your email to verify your account.",
        });
      } else {
        toast({
          title: "Success",
          description: "You have been logged in.",
        });
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Check your email for the password reset link.",
      });
      setIsResetMode(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">
          {isResetMode ? "Reset Password" : "Welcome"}
        </h2>
        <p className="text-muted-foreground">
          {isResetMode
            ? "Enter your email to receive a reset link"
            : "Sign in to your account or create a new one"}
        </p>
      </div>

      <form onSubmit={isResetMode ? handleResetPassword : handleLogin} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        
        {!isResetMode && (
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Processing..." : isResetMode ? "Send Reset Link" : "Continue"}
        </Button>

        <Button
          type="button"
          variant="link"
          className="w-full"
          onClick={() => setIsResetMode(!isResetMode)}
          disabled={loading}
        >
          {isResetMode ? "Back to Login" : "Forgot password?"}
        </Button>
      </form>
    </Card>
  );
};

export default LoginForm;
