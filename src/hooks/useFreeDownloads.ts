import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface FreeDownloads {
  id: string;
  user_id: string;
  downloads_remaining: number;
  created_at: string;
  updated_at: string;
}

export const useFreeDownloads = () => {
  const [freeDownloads, setFreeDownloads] = useState<FreeDownloads | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchFreeDownloads = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      console.log('Fetching free downloads for user:', user.id);
      const { data, error } = await supabase
        .from('user_free_downloads')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching free downloads:', error);
        // If table doesn't exist or no record exists, initialize it
        if (error.code === 'PGRST116' || error.code === '42P01') {
          await initializeFreeDownloads();
          return;
        }
        throw error;
      }
      
      console.log('Fetched free downloads:', data);
      setFreeDownloads(data);
    } catch (error) {
      console.error('Error fetching free downloads:', error);
      // Don't show error toast for missing table - it will be created
      if (error?.code !== '42P01') {
        toast({
          title: "Error",
          description: "Failed to load download information",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const initializeFreeDownloads = async () => {
    if (!user) return;

    try {
      console.log('Initializing free downloads for user:', user.id);
      const { data, error } = await supabase.rpc('initialize_free_downloads', {
        user_id: user.id
      });

      if (error) throw error;

      // Fetch the newly created record
      await fetchFreeDownloads();
    } catch (error) {
      console.error('Error initializing free downloads:', error);
    }
  };

  const consumeFreeDownload = async (): Promise<boolean> => {
    if (!user || !freeDownloads) return false;

    try {
      console.log('Consuming free download for user:', user.id);
      const { data, error } = await supabase.rpc('consume_free_download', {
        user_id: user.id
      });

      if (error) throw error;

      if (data) {
        // Refresh the free downloads data
        await fetchFreeDownloads();
        return true;
      } else {
        console.log('No free downloads remaining');
        return false;
      }
    } catch (error) {
      console.error('Error consuming free download:', error);
      toast({
        title: "Error",
        description: "Failed to process download",
        variant: "destructive",
      });
      return false;
    }
  };

  // Set up real-time subscription to listen for free download updates
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('free_downloads_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_free_downloads',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Free downloads updated via real-time:', payload);
          fetchFreeDownloads();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    fetchFreeDownloads();
  }, [user]);

  const hasFreeDownloads = freeDownloads ? freeDownloads.downloads_remaining > 0 : false;
  const freeDownloadsRemaining = freeDownloads ? freeDownloads.downloads_remaining : 0;

  return {
    freeDownloads,
    hasFreeDownloads,
    freeDownloadsRemaining,
    loading,
    consumeFreeDownload,
    refreshFreeDownloads: fetchFreeDownloads,
  };
};