import { useEffect, useState } from 'react';
import { useSyncStatus } from '../hooks/useSyncStatus';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SyncStatusIndicator() {
  const { isOnline, isSyncing, lastSyncTime, syncError } = useSyncStatus();
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);

  useEffect(() => {
    if (lastSyncTime && !isSyncing && !syncError) {
      setShowSyncSuccess(true);
      const timer = setTimeout(() => setShowSyncSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastSyncTime, isSyncing, syncError]);

  const formatLastSync = (date: Date | null) => {
    if (!date) return '';
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return 'अभी';
    if (diff < 3600) return `${Math.floor(diff / 60)} मिनट पहले`;
    return `${Math.floor(diff / 3600)} घंटे पहले`;
  };

  if (!isOnline) {
    return (
      <Badge 
        variant="outline" 
        className="bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 border-red-300 dark:border-red-800 flex items-center gap-1.5 px-2 py-1"
      >
        <WifiOff className="w-3 h-3" />
        <span className="text-xs font-medium">ऑफ़लाइन</span>
      </Badge>
    );
  }

  if (syncError) {
    return (
      <Badge 
        variant="outline" 
        className="bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-800 flex items-center gap-1.5 px-2 py-1"
      >
        <AlertCircle className="w-3 h-3" />
        <span className="text-xs font-medium">सिंक त्रुटि</span>
      </Badge>
    );
  }

  if (isSyncing) {
    return (
      <Badge 
        variant="outline" 
        className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-800 flex items-center gap-1.5 px-2 py-1"
      >
        <RefreshCw className="w-3 h-3 animate-spin" />
        <span className="text-xs font-medium">सिंक हो रहा है...</span>
      </Badge>
    );
  }

  if (showSyncSuccess) {
    return (
      <Badge 
        variant="outline" 
        className="bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 border-green-300 dark:border-green-800 flex items-center gap-1.5 px-2 py-1 animate-in fade-in duration-300"
      >
        <CheckCircle2 className="w-3 h-3" />
        <span className="text-xs font-medium">सिंक हो गया</span>
      </Badge>
    );
  }

  return (
    <Badge 
      variant="outline" 
      className="bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-800 flex items-center gap-1.5 px-2 py-1"
    >
      <Wifi className="w-3 h-3" />
      <span className="text-xs font-medium hidden sm:inline">
        {lastSyncTime ? formatLastSync(lastSyncTime) : 'ऑनलाइन'}
      </span>
    </Badge>
  );
}
