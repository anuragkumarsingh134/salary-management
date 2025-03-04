
import React, { useState, CSSProperties } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ResetPasswordForm from "./ResetPasswordForm";

// Extend CSSProperties to include our custom properties
interface ExtendedCSSProperties extends CSSProperties {
  WebkitTextSecurity?: 'disc' | 'circle' | 'square' | 'none';
  MozTextSecurity?: 'disc' | 'circle' | 'square' | 'none';
  textSecurity?: 'disc' | 'circle' | 'square' | 'none';
}

interface PasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  password: string;
  setPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onForgotPassword: () => void;
}

const PasswordDialog = ({
  open,
  onOpenChange,
  password,
  setPassword,
  onSubmit,
  onForgotPassword,
}: PasswordDialogProps) => {
  const [showResetForm, setShowResetForm] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit(e as any);
    }
  };

  const handleForgotKeyClick = () => {
    onForgotPassword();
    // Don't show reset form immediately - let the email be sent first
    setShowResetForm(false);
  };

  const inputStyle: ExtendedCSSProperties = {
    WebkitTextSecurity: 'disc',
    MozTextSecurity: 'disc',
    textSecurity: 'disc'
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {showResetForm ? "Reset Password" : "Enter Data Key"}
          </DialogTitle>
          <DialogDescription>
            {showResetForm 
              ? "Enter your new password" 
              : "Enter your key to view the data"}
          </DialogDescription>
        </DialogHeader>
        {showResetForm ? (
          <div className="space-y-4">
            <ResetPasswordForm />
            <Button
              type="button"
              variant="link"
              className="text-sm w-full"
              onClick={() => setShowResetForm(false)}
            >
              Back to View Data
            </Button>
          </div>
        ) : (
          <form 
            onSubmit={onSubmit} 
            className="space-y-4" 
            autoComplete="off"
            data-form-type="other"
            autoSave="off"
          >
            <input 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              type="text"
              placeholder="Enter data key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyPress}
              autoFocus
              autoComplete="off"
              name="data-access-key"
              data-form-type="other"
              data-lpignore="true"
              aria-autocomplete="none"
              spellCheck="false"
              style={inputStyle}
            />
            <div className="flex flex-col space-y-2">
              <Button type="submit" className="w-full">
                Submit
              </Button>
              <Button
                type="button"
                variant="link"
                className="text-sm"
                onClick={handleForgotKeyClick}
              >
                Forgot Key?
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PasswordDialog;
