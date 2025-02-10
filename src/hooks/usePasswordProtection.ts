
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
      if (!userId) throw new Error("No user found");

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
                user_id: userId
              }
            ]);

          if (insertError) throw insertError;

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

  return {
    showData,
    passwordDialogOpen,
    password,
    setPassword,
    setPasswordDialogOpen,
    handlePasswordSubmit,
    handleShowDataClick,
  };
};
