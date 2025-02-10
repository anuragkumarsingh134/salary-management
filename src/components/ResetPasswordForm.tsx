
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const ResetPasswordForm = () => {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) {
        toast({
          title: "Error",
          description: "No user found",
          variant: "destructive",
        });
        return;
      }

      // Verify the token
      const { data: settings, error: fetchError } = await supabase
        .from('user_settings')
        .select('reset_token, reset_token_expires_at')
        .eq('user_id', userId)
        .single();

      if (fetchError) throw fetchError;

      if (!settings.reset_token || settings.reset_token !== token) {
        toast({
          title: "Invalid Token",
          description: "The reset token is invalid. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Check if token is expired
      if (settings.reset_token_expires_at && new Date(settings.reset_token_expires_at) < new Date()) {
        toast({
          title: "Token Expired",
          description: "The reset token has expired. Please request a new one.",
          variant: "destructive",
        });
        return;
      }

      // Update the password in user_settings
      const { error: updateError } = await supabase
        .from('user_settings')
        .update({
          show_data_password: newPassword,
          reset_token: null,
          reset_token_expires_at: null
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Your password has been reset successfully.",
      });

      // Clear the form
      setToken("");
      setNewPassword("");
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
          Enter your reset token and new password
        </p>
      </div>

      <form onSubmit={handleResetPassword} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Reset Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            className="w-full"
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
          {loading ? "Processing..." : "Reset Password"}
        </Button>
      </form>
    </Card>
  );
};

export default ResetPasswordForm;
