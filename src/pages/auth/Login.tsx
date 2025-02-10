
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First try to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // If sign in fails with invalid credentials, try to sign up
      if (signInError?.message === "Invalid login credentials") {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        toast({
          title: "Verification Required",
          description: "Please check your email to verify your account.",
        });
      } else if (signInError) {
        // If there's a different error during sign in, throw it
        throw signInError;
      } else {
        // If sign in was successful
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome</h2>
        <p className="text-center text-muted-foreground mb-6">
          Sign in to your account or create a new one
        </p>
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : "Continue"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
