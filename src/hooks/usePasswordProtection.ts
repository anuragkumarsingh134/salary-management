
import { useState } from "react";
import { 
  fetchUserSettings, 
  createUserSettings, 
  updateUserPassword,
  sendPasswordResetEmail
} from "@/utils/passwordProtectionDb";
import { 
  showSuccessToast, 
  showErrorToast,
  showPasswordResetToast
} from "@/utils/passwordNotifications";

export const usePasswordProtection = () => {
  const [showData, setShowData] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState("");

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const settings = await fetchUserSettings();
      
      // Case 1: No settings found, first time setup
      if (!settings) {
        const success = await createUserSettings(password);
        
        if (!success) {
          showErrorToast('set');
          return;
        }
        
        setShowData(true);
        setPasswordDialogOpen(false);
        setPassword("");
        showSuccessToast('set');
        return;
      }
      
      // Case 2: Settings exist but no password set (first time)
      if (!settings.show_data_password) {
        const success = await updateUserPassword(password);
        
        if (!success) {
          showErrorToast('set');
          return;
        }
        
        setShowData(true);
        setPasswordDialogOpen(false);
        setPassword("");
        showSuccessToast('set');
        return;
      }
      
      // Case 3: User already showing data, wants to change password
      if (showData) {
        const success = await updateUserPassword(password);
        
        if (!success) {
          showErrorToast('change');
          return;
        }
        
        setPasswordDialogOpen(false);
        setPassword("");
        showSuccessToast('changed');
        return;
      }
      
      // Case 4: Normal login - check password against stored
      if (settings.show_data_password === password) {
        setShowData(true);
        setPasswordDialogOpen(false);
        setPassword("");
        showSuccessToast('access-granted');
      } else {
        console.log("Password mismatch:", { 
          provided: password, 
          stored: settings.show_data_password 
        });
        showErrorToast('password');
      }
    } catch (error: any) {
      console.error('Error handling password:', error);
      showErrorToast('generic');
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
      const success = await sendPasswordResetEmail();
      showPasswordResetToast(success);
      
      if (success) {
        setPasswordDialogOpen(false);
      }
    } catch (error: any) {
      console.error('Error handling password reminder:', error);
      showErrorToast('generic');
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
