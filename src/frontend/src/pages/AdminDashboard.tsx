import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { 
  useIsCallerAdmin, 
  useGetUniqueUserProfileCount, 
  useGetVirtualCanisterCount,
  useGetAggregateStorageSummary 
} from '../hooks/useQueries';
import { useLanguage } from '../hooks/useLanguage';
import AdminMetricCard from '../components/AdminMetricCard';
import AdminStorageTable from '../components/AdminStorageTable';
import { Shield, Users, Database, HardDrive, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboard() {
  const { identity } = useInternetIdentity();
  const { language } = useLanguage();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: userCount, isLoading: userCountLoading } = useGetUniqueUserProfileCount();
  const { data: canisterCount, isLoading: canisterCountLoading } = useGetVirtualCanisterCount();
  const { data: storageSummary, isLoading: storageSummaryLoading } = useGetAggregateStorageSummary();

  const isHindi = language === 'hindi';

  // Show loading state while checking admin status
  if (isAdminLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  // Access denied for non-admin users
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
        <Card className="max-w-md w-full bg-slate-900/50 border-red-500/20">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-red-500" />
              <CardTitle className="text-2xl text-red-500">
                {isHindi ? 'पहुंच अस्वीकृत' : 'Access Denied'}
              </CardTitle>
            </div>
            <CardDescription className="text-slate-400">
              {isHindi 
                ? 'आपके पास इस डैशबोर्ड तक पहुंचने की अनुमति नहीं है। केवल मास्टर एडमिन ही इस क्षेत्र में प्रवेश कर सकते हैं।'
                : 'You do not have permission to access this dashboard. Only the Master Admin can access this area.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="bg-red-950/20 border-red-500/30">
              <AlertDescription className="text-slate-300">
                {isHindi 
                  ? `आपका प्रिंसिपल: ${identity?.getPrincipal().toString().slice(0, 20)}...`
                  : `Your Principal: ${identity?.getPrincipal().toString().slice(0, 20)}...`}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate total storage in bytes
  const totalStorageBytes = storageSummary 
    ? Number(storageSummary.totalPhotosSize) + 
      Number(storageSummary.totalVideosSize) + 
      Number(storageSummary.totalDocumentsSize) + 
      Number(storageSummary.totalMemoriesSize)
    : 0;

  // Format bytes to GB/TB
  const formatStorage = (bytes: number): string => {
    const gb = bytes / (1024 ** 3);
    if (gb >= 1000) {
      return `${(gb / 1024).toFixed(2)} TB`;
    }
    return `${gb.toFixed(2)} GB`;
  };

  const totalStorageLimit = 21.47; // GB
  const storageUsagePercent = (totalStorageBytes / (totalStorageLimit * 1024 ** 3)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30">
            <Activity className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              {isHindi ? 'मास्टर एडमिन डैशबोर्ड' : 'Master Admin Dashboard'}
            </h1>
            <p className="text-slate-400 mt-1">
              {isHindi 
                ? 'अपने AS19 MultiDrive नेटवर्क की निगरानी करें'
                : 'Monitor your AS19 MultiDrive network'}
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Count */}
          <AdminMetricCard
            title={isHindi ? 'कुल उपयोगकर्ता' : 'Total Users'}
            value={userCountLoading ? '...' : String(userCount || 0)}
            subtitle={isHindi ? 'अद्वितीय प्रिंसिपल' : 'Unique Principals'}
            icon={<Users className="w-6 h-6" />}
            iconColor="text-emerald-400"
            iconBgColor="from-emerald-500/20 to-green-500/20"
            borderColor="border-emerald-500/30"
          />

          {/* Virtual Canister Count */}
          <AdminMetricCard
            title={isHindi ? 'वर्चुअल कैनिस्टर' : 'Virtual Canisters'}
            value={canisterCountLoading ? '...' : String(canisterCount || 0)}
            subtitle={isHindi ? 'स्वचालित रूप से उत्पन्न' : 'Auto-generated'}
            icon={<Database className="w-6 h-6" />}
            iconColor="text-purple-400"
            iconBgColor="from-purple-500/20 to-pink-500/20"
            borderColor="border-purple-500/30"
          />

          {/* Total Storage */}
          <AdminMetricCard
            title={isHindi ? 'कुल स्टोरेज' : 'Total Storage'}
            value={storageSummaryLoading ? '...' : formatStorage(totalStorageBytes)}
            subtitle={`${storageUsagePercent.toFixed(1)}% ${isHindi ? 'उपयोग किया गया' : 'used'}`}
            icon={<HardDrive className="w-6 h-6" />}
            iconColor="text-cyan-400"
            iconBgColor="from-cyan-500/20 to-blue-500/20"
            borderColor="border-cyan-500/30"
            progress={storageUsagePercent}
          />
        </div>

        {/* Storage Breakdown */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-slate-100">
              {isHindi ? 'स्टोरेज वितरण' : 'Storage Distribution'}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {isHindi 
                ? 'श्रेणी के अनुसार विस्तृत स्टोरेज उपयोग'
                : 'Detailed storage usage by category'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {storageSummaryLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              <AdminStorageTable storageSummary={storageSummary} isHindi={isHindi} />
            )}
          </CardContent>
        </Card>

        {/* Network Health Note */}
        <Alert className="bg-slate-900/50 border-slate-700/50">
          <Shield className="w-4 h-4 text-cyan-400" />
          <AlertDescription className="text-slate-300">
            {isHindi 
              ? '🔒 गोपनीयता गारंटी: यह डैशबोर्ड केवल मेटाडेटा दिखाता है। वास्तविक उपयोगकर्ता सामग्री (फ़ाइलें, फ़ोटो, वीडियो) एन्क्रिप्टेड और दुर्गम रहती है।'
              : '🔒 Privacy Guarantee: This dashboard shows metadata only. Actual user content (files, photos, videos) remains encrypted and inaccessible.'}
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
