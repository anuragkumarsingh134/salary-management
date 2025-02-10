
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we're in a password reset flow
    const checkPasswordRecovery = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking session:', error);
        toast({
          title: "Error",
          description: "Unable to verify password reset session. Please try again.",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      if (!session?.user) {
        toast({
          title: "Error",
          description: "Invalid or expired password reset link. Please request a new one.",
          variant: "destructive",
        });
        navigate('/login');
      }
    };

    checkPasswordRecovery();
  }, [navigate, toast]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your password has been reset successfully.",
      });

      // Clear the form and redirect to login
      setNewPassword("");
      navigate("/login");
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while resetting your password.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Reset Password</h2>
        <p className="text-muted-foreground">
          Enter your new password
        </p>
      </div>

      <form onSubmit={handleResetPassword} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full"
            disabled={loading}
            minLength={6}
          />
        </div>
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
        >
          {loading ? "Processing..." : "Reset Password"}
        </Button>
      </form>
    </Card>
  );
};

export default ResetPasswordForm;
