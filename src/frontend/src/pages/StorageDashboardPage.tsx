import { useGetStorageMetrics } from '../hooks/useQueries';
import { useLanguage } from '../hooks/useLanguage';
import CreatedByBanner from '../components/CreatedByBanner';
import TotalStorageMonitor from '../components/TotalStorageMonitor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Database, Image, Heart, HardDrive, Server, Activity, Video, FileText } from 'lucide-react';

interface StorageDashboardPageProps {
  onLogout: () => void;
}

export default function StorageDashboardPage({ onLogout }: StorageDashboardPageProps) {
  const { data: metrics } = useGetStorageMetrics();
  const { language } = useLanguage();

  const formatSize = (bytes: bigint) => {
    const num = Number(bytes);
    const mb = num / (1024 * 1024);
    const gb = mb / 1024;
    if (gb >= 1) {
      return `${gb.toFixed(2)} GB`;
    }
    return `${mb.toFixed(2)} MB`;
  };

  const getTotalUsage = () => {
    if (!metrics) return { used: 0, limit: 0, percentage: 0 };
    const photoUsed = Number(metrics.photos.used);
    const photoLimit = Number(metrics.photos.limit);
    const videosUsed = Number(metrics.videos.used);
    const videosLimit = Number(metrics.videos.limit);
    const documentsUsed = Number(metrics.documents?.used || 0);
    const documentsLimit = Number(metrics.documents?.limit || 0);
    const memoriesUsed = Number(metrics.memories?.used || 0);
    const memoriesLimit = Number(metrics.memories?.limit || 0);

    const totalUsed = photoUsed + videosUsed + documentsUsed + memoriesUsed;
    const totalLimit = photoLimit + videosLimit + documentsLimit + memoriesLimit;
    const percentage = totalLimit > 0 ? (totalUsed / totalLimit) * 100 : 0;

    return { used: totalUsed, limit: totalLimit, percentage };
  };

  const total = getTotalUsage();

  const categories = [
    {
      name: language === 'hindi' ? 'फ़ोटो' : 'Photos',
      icon: Image,
      color: 'from-blue-500 to-cyan-500',
      data: metrics?.photos,
    },
    {
      name: language === 'hindi' ? 'वीडियो' : 'Videos',
      icon: Video,
      color: 'from-rose-500 to-pink-500',
      data: metrics?.videos,
    },
    {
      name: language === 'hindi' ? 'डॉक्युमेंट' : 'Documents',
      icon: FileText,
      color: 'from-green-500 to-emerald-500',
      data: metrics?.documents,
    },
    {
      name: language === 'hindi' ? 'मेमोरीज़' : 'Memories',
      icon: Heart,
      color: 'from-purple-500 to-pink-500',
      data: metrics?.memories,
    },
  ];

  return (
    <div className="min-h-screen bg-background w-full max-w-full overflow-x-hidden">
      <CreatedByBanner />
      
      <div className="fixed inset-0 atmospheric-bg opacity-10 pointer-events-none z-0 w-full h-full" />

      <header className="sticky top-14 z-10 border-b glass-effect dark:glass-effect-dark w-full">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 max-w-full">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Database className="w-8 h-8 sm:w-10 sm:h-10 text-primary shrink-0" />
            <h1 className="text-base sm:text-xl font-bold text-gradient truncate">
              {language === 'hindi' ? 'स्टोरेज डैशबोर्ड' : 'Storage Dashboard'}
            </h1>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 max-w-7xl w-full space-y-6">
        <TotalStorageMonitor />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            const data = category.data;
            
            if (!data) return null;

            const isWarning = data.percentage >= 80;

            return (
              <Card key={category.name} className="glass-effect dark:glass-effect-dark">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${category.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <CardDescription>
                        {formatSize(data.used)} / {formatSize(data.limit)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Progress value={data.percentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{data.percentage.toFixed(1)}% {language === 'hindi' ? 'उपयोग में' : 'used'}</span>
                    <span>{formatSize(BigInt(Number(data.limit) - Number(data.used)))} {language === 'hindi' ? 'शेष' : 'remaining'}</span>
                  </div>
                  {isWarning && (
                    <Alert variant="destructive" className="py-2">
                      <AlertDescription className="text-xs">
                        {language === 'hindi' ? 'स्टोरेज लगभग भर गया है' : 'Storage almost full'}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="glass-effect dark:glass-effect-dark">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Server className="w-6 h-6 text-primary" />
              <div>
                <CardTitle>{language === 'hindi' ? 'मल्टी-कैनिस्टर आर्किटेक्चर' : 'Multi-Canister Architecture'}</CardTitle>
                <CardDescription>
                  {language === 'hindi' 
                    ? 'आपका डेटा कई कैनिस्टर में सुरक्षित रूप से वितरित किया गया है'
                    : 'Your data is securely distributed across multiple canisters'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="w-4 h-4 text-green-500" />
              <span>{language === 'hindi' ? 'सभी कैनिस्टर स्वस्थ और सक्रिय हैं' : 'All canisters healthy and active'}</span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
