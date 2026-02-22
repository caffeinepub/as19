import { useGetStorageMetrics } from '../hooks/useQueries';
import { useLanguage } from '../hooks/useLanguage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { HardDrive, Image, Video, FileText, Heart } from 'lucide-react';

export default function TotalStorageMonitor() {
  const { data: metrics } = useGetStorageMetrics();
  const { language } = useLanguage();

  if (!metrics) return null;

  const formatSize = (bytes: bigint) => {
    const num = Number(bytes);
    const gb = num / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  const getTotalUsage = () => {
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

  const breakdown = [
    {
      name: language === 'hindi' ? 'फ़ोटो' : 'Photos',
      icon: Image,
      color: 'text-blue-500',
      used: metrics.photos.used,
    },
    {
      name: language === 'hindi' ? 'वीडियो' : 'Videos',
      icon: Video,
      color: 'text-rose-500',
      used: metrics.videos.used,
    },
    {
      name: language === 'hindi' ? 'डॉक्युमेंट' : 'Documents',
      icon: FileText,
      color: 'text-green-500',
      used: metrics.documents?.used || BigInt(0),
    },
    {
      name: language === 'hindi' ? 'मेमोरीज़' : 'Memories',
      icon: Heart,
      color: 'text-purple-500',
      used: metrics.memories?.used || BigInt(0),
    },
  ];

  return (
    <Card className="glass-effect dark:glass-effect-dark border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary/60">
            <HardDrive className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">
              {language === 'hindi' ? 'कुल स्टोरेज' : 'Total Storage'}
            </CardTitle>
            <CardDescription>
              {formatSize(BigInt(total.used))} / {formatSize(BigInt(total.limit))}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={total.percentage} className="h-3" />
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {breakdown.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.name} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                <Icon className={`w-4 h-4 ${item.color} shrink-0`} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{formatSize(item.used)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
