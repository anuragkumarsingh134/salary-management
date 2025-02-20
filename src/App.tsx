
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ResetPassword from "./pages/auth/ResetPassword";
import { User } from "@supabase/supabase-js";
import { useToast } from "./components/ui/use-toast";

const queryClient = new QueryClient();

const SESSION_TIMEOUT = 3600000; // 1 hour in milliseconds

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  let inactivityTimer: NodeJS.Timeout;

  const resetInactivityTimer = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    
    if (user) {
      inactivityTimer = setTimeout(async () => {
        try {
          await supabase.auth.signOut();
          toast({
            title: "Session Expired",
            description: "You have been logged out due to inactivity",
          });
        } catch (error) {
          console.error("Error signing out:", error);
        }
      }, SESSION_TIMEOUT);
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        resetInactivityTimer();
      }
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        resetInactivityTimer();
      }
    });

    // Set up activity listeners
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'mousemove'];
    const handleUserActivity = () => {
      resetInactivityTimer();
    };

    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });

    // Cleanup function
    return () => {
      subscription.unsubscribe();
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/auth/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/login" element={<Navigate to="/auth/login" replace />} />
            <Route path="/auth/signup" element={!user ? <SignUp /> : <Navigate to="/" />} />
            <Route path="/signup" element={<Navigate to="/auth/signup" replace />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            
            {/* Protected routes */}
            <Route path="/" element={user ? <Index /> : <Navigate to="/auth/login" />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
