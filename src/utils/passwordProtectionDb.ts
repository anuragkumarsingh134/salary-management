
import { supabase } from "@/integrations/supabase/client";
import { toast as showToast } from "@/hooks/use-toast";

export interface UserSettings {
  show_data_password: string;
  user_id: string;
  recovery_email: string;
}

export const fetchUserSettings = async (): Promise<UserSettings | null> => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      showToast({
        title: "Error",
        description: "No user found",
        variant: "destructive",
      });
      return null;
    }

    const { data: settings, error: fetchError } = await supabase
      .from('user_settings')
      .select('show_data_password')
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      if (fetchError.code !== 'PGRST116') { // Not a "no settings found" error
        console.error("Fetch error:", fetchError);
        showToast({
          title: "Error",
          description: "Failed to check password",
          variant: "destructive",
        });
      }
      return null;
    }

    return settings as UserSettings;
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return null;
  }
};

export const createUserSettings = async (password: string): Promise<boolean> => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const userEmail = (await supabase.auth.getUser()).data.user?.email;
    
    if (!userId) return false;

    const { error: insertError } = await supabase
      .from('user_settings')
      .insert([
        {
          show_data_password: password,
          user_id: userId,
          recovery_email: userEmail
        }
      ]);

    if (insertError) {
      console.error("Insert error:", insertError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error creating user settings:", error);
    return false;
  }
};

export const updateUserPassword = async (password: string): Promise<boolean> => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return false;

    const { error: updateError } = await supabase
      .from('user_settings')
      .update({ show_data_password: password })
      .eq('user_id', userId);

    if (updateError) {
      console.error("Update error:", updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error updating password:", error);
    return false;
  }
};

export const sendPasswordResetEmail = async (): Promise<boolean> => {
  try {
    const userEmail = (await supabase.auth.getUser()).data.user?.email;
    if (!userEmail) return false;

    const { error } = await supabase.functions.invoke('send-reset-password', {
      body: { email: userEmail }
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error sending password reset:', error);
    return false;
  }
};
