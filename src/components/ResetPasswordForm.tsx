
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const ResetPasswordForm = () => {
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
