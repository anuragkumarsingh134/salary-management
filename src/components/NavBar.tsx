
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useStoreSettings } from "@/store/storeSettingsStore";

export const NavBar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings } = useStoreSettings();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
      
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="border-b border-gray-200">
      <div className="container max-w-6xl mx-auto h-16 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold uppercase">
            {settings?.storeName || 'NEW GK COLLECTIONS'}
          </h1>
        </div>
        <Button 
          variant="ghost" 
          onClick={handleSignOut} 
          className="text-base font-medium"
        >
          Sign Out
        </Button>
      </div>
    </nav>
  );
};
