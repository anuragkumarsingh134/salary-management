
import React, { useState } from "react";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {showResetForm ? "Reset Password" : "Enter Password"}
          </DialogTitle>
          <DialogDescription>
            {showResetForm 
              ? "Enter your reset token and new password" 
              : "Enter your password to view the data"}
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
              Back to Login
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
            <div className="hidden">
              <input type="text" autoComplete="username" value="" readOnly />
              <input type="password" autoComplete="current-password" value="" readOnly />
            </div>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              autoComplete="off"
              name="view-only-data-key"
              data-form-type="other"
              data-lpignore="true"
              aria-autocomplete="none"
            />
            <div className="flex flex-col space-y-2">
              <Button type="submit" className="w-full">
                Submit
              </Button>
              <Button
                type="button"
                variant="link"
                className="text-sm"
                onClick={() => {
                  onForgotPassword();
                  setShowResetForm(true);
                }}
              >
                Forgot Password?
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PasswordDialog;
