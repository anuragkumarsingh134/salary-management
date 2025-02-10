
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // Only attempt signup if it's an invalid credentials error
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

          // Check if the user needs to verify their email
          if (!signUpData.session) {
            toast({
              title: "Account created",
              description: "Please check your email to verify your account.",
            });
          } else {
            // If auto-confirmation is enabled, user will be signed in immediately
            toast({
              title: "Welcome!",
              description: "Your account has been created successfully.",
            });
            navigate("/");
          }
        } else {
          // If it's a different error, throw it
          throw signInError;
        }
      } else if (signInData.session) {
        // If sign in was successful
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Welcome</h2>
          <p className="text-muted-foreground">
            Sign in to your account or create a new one
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
              disabled={loading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? "Processing..." : "Continue"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
