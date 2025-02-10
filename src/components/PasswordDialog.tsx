
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          <div className="flex flex-col space-y-2">
            <Button type="submit" className="w-full">
              Submit
            </Button>
            <Button
              type="button"
              variant="link"
              className="text-sm"
              onClick={onForgotPassword}
            >
              Forgot Password?
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordDialog;
