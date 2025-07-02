import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Purchase {
  id: string;
  plan_type: string;
  status: string;
  downloads_remaining: number;
  expires_at: string | null;
  created_at: string;
}

export const usePurchases = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [canDownload, setCanDownload] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Calculate total downloads remaining
  const totalDownloadsRemaining = purchases.reduce((total, purchase) => {
    const isNotExpired = !purchase.expires_at || new Date(purchase.expires_at) > new Date();
    return isNotExpired ? total + purchase.downloads_remaining : total;
  }, 0);

  const fetchPurchases = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      console.log('Fetching purchases for user:', user.id);
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('Fetched purchases:', data);
      setPurchases(data || []);
      
      // Check if user has any valid downloads remaining
      const hasValidPurchases = (data || []).some(purchase => {
        const isNotExpired = !purchase.expires_at || new Date(purchase.expires_at) > new Date();
        const hasDownloads = purchase.downloads_remaining > 0;
        console.log('Purchase check:', {
          id: purchase.id,
          downloads_remaining: purchase.downloads_remaining,
          isNotExpired,
          hasDownloads,
          expires_at: purchase.expires_at
        });
        return hasDownloads && isNotExpired;
      });
      
      console.log('Can download:', hasValidPurchases);
      setCanDownload(hasValidPurchases);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const consumeDownload = async () => {
    if (!user || !canDownload) return false;

    try {
      // Find the first valid purchase to consume from
      const validPurchase = purchases.find(purchase => {
        const isNotExpired = !purchase.expires_at || new Date(purchase.expires_at) > new Date();
        return purchase.downloads_remaining > 0 && isNotExpired;
      });

      if (!validPurchase) return false;

      const { error } = await supabase
        .from('purchases')
        .update({
          downloads_remaining: validPurchase.downloads_remaining - 1
        })
        .eq('id', validPurchase.id);

      if (error) throw error;

      // Refresh purchases after consuming
      await fetchPurchases();
      return true;
    } catch (error) {
      console.error('Error consuming download:', error);
      return false;
    }
  };

  // Set up real-time subscription to listen for purchase updates
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('purchases_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'purchases',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Purchase updated via real-time:', payload);
          fetchPurchases();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    fetchPurchases();
  }, [user]);

  return {
    purchases,
    canDownload,
    loading,
    totalDownloadsRemaining,
    consumeDownload,
    refreshPurchases: fetchPurchases,
  };
};