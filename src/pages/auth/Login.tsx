
import { useState } from "react";
import { Card } from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";
import { useAuthentication } from "@/hooks/useAuthentication";

const Login = () => {
  const { loading, signInOrSignUp, handleForgotPassword } = useAuthentication();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Welcome</h2>
          <p className="text-muted-foreground">
            Sign in to your account or create a new one
          </p>
        </div>

        <LoginForm
          onSubmit={signInOrSignUp}
          onForgotPassword={handleForgotPassword}
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default Login;
