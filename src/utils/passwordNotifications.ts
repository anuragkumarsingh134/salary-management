
import { toast } from "@/hooks/use-toast";

export const showSuccessToast = (action: 'set' | 'changed' | 'access-granted') => {
  const messages = {
    'set': {
      title: "Key Set",
      description: "Your key has been set and data is now visible."
    },
    'changed': {
      title: "Key Changed",
      description: "Your key has been updated successfully."
    },
    'access-granted': {
      title: "Access Granted",
      description: "You now have access to view the data."
    }
  };

  const message = messages[action];
  toast(message);
};

export const showErrorToast = (error: 'fetch' | 'set' | 'change' | 'password' | 'generic' | 'user') => {
  const errors = {
    'fetch': {
      title: "Error",
      description: "Failed to check password",
      variant: "destructive" as const
    },
    'set': {
      title: "Error",
      description: "Failed to set key",
      variant: "destructive" as const
    },
    'change': {
      title: "Error",
      description: "Failed to change key",
      variant: "destructive" as const
    },
    'password': {
      title: "Access Denied",
      description: "Incorrect key. Please try again.",
      variant: "destructive" as const
    },
    'user': {
      title: "Error",
      description: "No user found",
      variant: "destructive" as const
    },
    'generic': {
      title: "Error",
      description: "An error occurred while checking the key.",
      variant: "destructive" as const
    }
  };

  const message = errors[error];
  toast(message);
};

export const showPasswordResetToast = (success: boolean) => {
  if (success) {
    toast({
      title: "Key Sent",
      description: "Your key has been sent to your email address."
    });
  } else {
    toast({
      title: "Error",
      description: "An error occurred while processing your request.",
      variant: "destructive"
    });
  }
};
