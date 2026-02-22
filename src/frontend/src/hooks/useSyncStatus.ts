import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useInternetIdentity } from './useInternetIdentity';

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  syncError: string | null;
}

export function useSyncStatus() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    isSyncing: false,
    lastSyncTime: null,
    syncError: null,
  });

  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true, syncError: null }));
      // Refetch all queries when coming back online
      queryClient.refetchQueries();
    };

    const handleOffline = () => {
      setSyncStatus(prev => ({ 
        ...prev, 
        isOnline: false, 
        syncError: 'इंटरनेट कनेक्शन नहीं है' 
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [queryClient]);

  // Track query fetching state
  useEffect(() => {
    if (!identity) return;

    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event?.type === 'updated') {
        const query = event.query;
        const isFetching = query.state.fetchStatus === 'fetching';
        
        if (isFetching) {
          setSyncStatus(prev => ({ ...prev, isSyncing: true }));
        } else {
          setSyncStatus(prev => ({ 
            ...prev, 
            isSyncing: false,
            lastSyncTime: new Date(),
            syncError: query.state.error ? 'सिंक करते समय त्रुटि हुई' : null,
          }));
        }
      }
    });

    return unsubscribe;
  }, [queryClient, identity]);

  return syncStatus;
}
