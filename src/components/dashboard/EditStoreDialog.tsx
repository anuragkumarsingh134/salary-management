
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useStoreSettings } from "@/store/storeSettingsStore";

interface EditStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditStoreDialog = ({
  open,
  onOpenChange,
}: EditStoreDialogProps) => {
  const { settings, updateStoreSettings } = useStoreSettings();
  const [storeName, setStoreName] = useState(settings?.storeName || "");
  const [ownerName, setOwnerName] = useState(settings?.ownerName || "");
  const [country, setCountry] = useState(settings?.country || "");
  const [phone, setPhone] = useState(settings?.phone || "");
  const [address, setAddress] = useState(settings?.address || "");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateStoreSettings({
        storeName,
        ownerName,
        country,
        phone,
        address
      });

      toast({
        title: "Store Updated",
        description: "Your store settings have been updated successfully.",
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error updating store:', error);
      toast({
        title: "Error",
        description: "Failed to update store settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Store Settings</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name</Label>
            <Input
              id="storeName"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ownerName">Owner Name</Label>
            <Input
              id="ownerName"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Store"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
