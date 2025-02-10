
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const usePasswordProtection = () => {
  const [showData, setShowData] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

      const { data: settings, error: fetchError } = await supabase
        .from('user_settings')
        .select('show_data_password')
        .eq('user_id', userId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          const { error: insertError } = await supabase
            .from('user_settings')
            .insert([
              {
                show_data_password: password,
                user_id: userId,
                recovery_email: (await supabase.auth.getUser()).data.user?.email
              }
            ]);

          if (insertError) {
            toast({
              title: "Error",
              description: "Failed to set password",
              variant: "destructive",
            });
            return;
          }

          setShowData(true);
          setPasswordDialogOpen(false);
          setPassword("");
          toast({
            title: "Password Set",
            description: "Your password has been set and data is now visible.",
          });
          return;
        }
        throw fetchError;
      }

      if (settings.show_data_password === password) {
        setShowData(true);
        setPasswordDialogOpen(false);
        setPassword("");
        toast({
          title: "Access Granted",
          description: "You now have access to view the data.",
        });
      } else {
        toast({
          title: "Access Denied",
          description: "Incorrect password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error handling password:', error);
      toast({
        title: "Error",
        description: "An error occurred while checking the password.",
        variant: "destructive",
      });
    }
  };

  const handleShowDataClick = () => {
    if (!showData) {
      setPasswordDialogOpen(true);
    } else {
      setShowData(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      const userEmail = (await supabase.auth.getUser()).data.user?.email;
      if (!userEmail) {
        toast({
          title: "Error",
          description: "No email found",
          variant: "destructive",
        });
        return;
      }

      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) {
        toast({
          title: "Error",
          description: "No user found",
          variant: "destructive",
        });
        return;
      }

      const resetToken = Math.random().toString(36).substring(2, 15);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      const { error: updateError } = await supabase
        .from('user_settings')
        .update({
          reset_token: resetToken,
          reset_token_expires_at: expiresAt.toISOString()
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      // Call the Edge Function to send the reset email
      const { data, error } = await supabase.functions.invoke('send-reset-password', {
        body: JSON.stringify({ 
          email: userEmail, 
          resetToken 
        })
      });

      if (error) throw error;

      toast({
        title: "Reset Instructions Sent",
        description: "Please check your email for instructions to reset your password.",
      });

      setPasswordDialogOpen(false);
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
    showData,
    passwordDialogOpen,
    password,
    setPassword,
    setPasswordDialogOpen,
    handlePasswordSubmit,
    handleShowDataClick,
    handleForgotPassword,
  };
};
