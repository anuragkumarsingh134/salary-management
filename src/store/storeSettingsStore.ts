
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

interface StoreSettings {
  storeName: string;
}

interface StoreSettingsStore {
  settings: StoreSettings | null;
  isLoading: boolean;
  fetchSettings: () => Promise<void>;
  updateStoreName: (name: string) => Promise<void>;
}

export const useStoreSettings = create<StoreSettingsStore>((set) => ({
  settings: null,
  isLoading: true,
  fetchSettings: async () => {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('store_name')
        .single();

      if (error) throw error;

      set({ 
        settings: { 
          storeName: data.store_name 
        },
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching store settings:', error);
      set({ isLoading: false });
    }
  },
  updateStoreName: async (name: string) => {
    try {
      const { error } = await supabase
        .from('store_settings')
        .update({ store_name: name })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      set((state) => ({
        settings: state.settings ? { ...state.settings, storeName: name } : null
      }));
    } catch (error) {
      console.error('Error updating store name:', error);
    }
  },
}));
