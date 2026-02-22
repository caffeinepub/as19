import { useGetStorageMetrics } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, Server } from 'lucide-react';

const STORAGE_WARNING_PERCENTAGE = 80;

export default function VideoStorageMonitor() {
  const { data: metrics } = useGetStorageMetrics();

  if (!metrics) {
    return null;
  }

  const videoUsed = Number(metrics.videos.used);
  const videoLimit = Number(metrics.videos.limit);
  const videoPercentage = Number(metrics.videos.percentage);

  const showWarning = videoPercentage >= STORAGE_WARNING_PERCENTAGE;

  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    const gb = mb / 1024;
    if (gb >= 1) {
      return `${gb.toFixed(2)} GB`;
    }
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <Card className="border-rose-200 dark:border-rose-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <img src="/assets/generated/video-storage-meter-transparent.dim_128x128.png" alt="" className="w-5 h-5" />
          वीडियो स्टोरेज
        </CardTitle>
        <CardDescription className="flex items-center gap-1.5">
          <Server className="w-3 h-3" />
          आवंटित: {formatSize(videoLimit)} (~6 GB मल्टी-कैनिस्टर)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">उपयोग किया गया</span>
            <span className="font-medium">
              {formatSize(videoUsed)} / {formatSize(videoLimit)}
            </span>
          </div>
          <Progress 
            value={Math.min(videoPercentage, 100)} 
            className={`h-2 ${showWarning ? '[&>div]:bg-rose-500 dark:[&>div]:bg-rose-600' : '[&>div]:bg-rose-400 dark:[&>div]:bg-rose-500'}`}
          />
          <p className="text-xs text-muted-foreground text-right">
            {videoPercentage.toFixed(1)}% उपयोग किया गया
          </p>
        </div>

        {showWarning && (
          <Alert className="bg-rose-50 dark:bg-rose-950 border-rose-300 dark:border-rose-800">
            <div className="flex items-start gap-3">
              <Heart className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5 fill-rose-600 dark:fill-rose-400" />
              <div className="space-y-1 flex-1">
                <AlertDescription className="text-rose-800 dark:text-rose-200 font-medium">
                  {videoPercentage >= 100 ? 'वीडियो स्टोरेज पूर्ण हो गया है' : 'वीडियो स्टोरेज सीमा के करीब पहुंच रहे हैं'}
                </AlertDescription>
                <p className="text-sm text-rose-700 dark:text-rose-300">
                  कृपया पुराने वीडियो हटाएं या स्टोरेज प्रबंधित करें
                </p>
              </div>
            </div>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
