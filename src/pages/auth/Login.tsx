
import { useState } from "react";
import { Card } from "@/components/ui/card";
import ResetPasswordForm from "@/components/ResetPasswordForm";
import LoginForm from "@/components/auth/LoginForm";
import { useAuthentication } from "@/hooks/useAuthentication";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [showResetForm, setShowResetForm] = useState(false);
  const { loading, signInOrSignUp, handleForgotPassword } = useAuthentication();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Welcome</h2>
          <p className="text-muted-foreground">
            {showResetForm 
              ? "Enter your reset token and new password" 
              : "Sign in to your account or create a new one"}
          </p>
        </div>

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
          <LoginForm
            onSubmit={signInOrSignUp}
            onForgotPassword={() => {
              const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
              handleForgotPassword(emailInput.value, () => setShowResetForm(true));
            }}
            loading={loading}
          />
        )}
      </Card>
    </div>
  );
};

export default Login;
