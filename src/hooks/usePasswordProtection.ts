
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
          // No settings found, first time setup
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
            console.error("Insert error:", insertError);
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
            title: "Key Set",
            description: "Your key has been set and data is now visible.",
          });
          return;
        }
        
        console.error("Fetch error:", fetchError);
        toast({
          title: "Error",
          description: "Failed to check password",
          variant: "destructive",
        });
        return;
      }

      if (!settings.show_data_password) {
        // First time setting the password
        const { error: updateError } = await supabase
          .from('user_settings')
          .update({ show_data_password: password })
          .eq('user_id', userId);

        if (updateError) {
          console.error("Update error:", updateError);
          toast({
            title: "Error",
            description: "Failed to set key",
            variant: "destructive",
          });
          return;
        }

        setShowData(true);
        setPasswordDialogOpen(false);
        setPassword("");
        toast({
          title: "Key Set",
          description: "Your key has been set and data is now visible.",
        });
        return;
      }

      if (showData) {
        // Changing the key
        const { error: updateError } = await supabase
          .from('user_settings')
          .update({ show_data_password: password })
          .eq('user_id', userId);

        if (updateError) {
          console.error("Update error:", updateError);
          toast({
            title: "Error",
            description: "Failed to change key",
            variant: "destructive",
          });
          return;
        }

        setPasswordDialogOpen(false);
        setPassword("");
        toast({
          title: "Key Changed",
          description: "Your key has been updated successfully.",
        });
        return;
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
        console.log("Password mismatch:", { 
          provided: password, 
          stored: settings.show_data_password 
        });
        toast({
          title: "Access Denied",
          description: "Incorrect key. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error handling password:', error);
      toast({
        title: "Error",
        description: "An error occurred while checking the key.",
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

      const { error } = await supabase.functions.invoke('send-reset-password', {
        body: { email: userEmail }
      });

      if (error) throw error;

      toast({
        title: "Key Sent",
        description: "Your key has been sent to your email address.",
      });

      setPasswordDialogOpen(false);
    } catch (error: any) {
      console.error('Error handling password reminder:', error);
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
