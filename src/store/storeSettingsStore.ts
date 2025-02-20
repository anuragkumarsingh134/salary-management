
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

interface StoreSettings {
  storeName: string;
  ownerName: string | null;
  country: string | null;
  phone: string | null;
  address: string | null;
}

interface StoreSettingsStore {
  settings: StoreSettings | null;
  isLoading: boolean;
  fetchSettings: () => Promise<void>;
  updateStoreSettings: (settings: Partial<StoreSettings>) => Promise<void>;
}

type DatabaseStoreSettings = {
  store_name: string;
  owner_name: string | null;
  country: string | null;
  phone: string | null;
  address: string | null;
}

export const useStoreSettings = create<StoreSettingsStore>((set) => ({
  settings: null,
  isLoading: true,
  fetchSettings: async () => {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('store_name, owner_name, country, phone, address')
        .maybeSingle() as { data: DatabaseStoreSettings | null; error: any };

      if (error) throw error;

      set({ 
        settings: data ? { 
          storeName: data.store_name,
          ownerName: data.owner_name,
          country: data.country,
          phone: data.phone,
          address: data.address
        } : null,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching store settings:', error);
      set({ isLoading: false });
    }
  },
  updateStoreSettings: async (settings: Partial<StoreSettings>) => {
    try {
      const updates = {
        ...(settings.storeName && { store_name: settings.storeName }),
        ...(settings.ownerName !== undefined && { owner_name: settings.ownerName }),
        ...(settings.country !== undefined && { country: settings.country }),
        ...(settings.phone !== undefined && { phone: settings.phone }),
        ...(settings.address !== undefined && { address: settings.address })
      };

      const { error } = await supabase
        .from('store_settings')
        .update(updates)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      set((state) => ({
        settings: state.settings ? { ...state.settings, ...settings } : null
      }));
    } catch (error) {
      console.error('Error updating store settings:', error);
    }
  },
}));
