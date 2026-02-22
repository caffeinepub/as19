import { useGetStorageMetrics } from '../hooks/useQueries';
import { useLanguage } from '../hooks/useLanguage';
import { useTranslations } from '../lib/translations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, AlertTriangle } from 'lucide-react';

export default function DocumentStorageMonitor() {
  const { data: metrics } = useGetStorageMetrics();
  const { language } = useLanguage();
  const t = useTranslations(language);

  if (!metrics?.documents) return null;

  const { used, limit, percentage } = metrics.documents;
  const isWarning = percentage >= 80;

  const formatSize = (bytes: bigint) => {
    const num = Number(bytes);
    const mb = num / (1024 * 1024);
    const gb = mb / 1024;
    if (gb >= 1) {
      return `${gb.toFixed(2)} GB`;
    }
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <Card className="glass-effect dark:glass-effect-dark">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-base">{t('storage.documents')}</CardTitle>
            <CardDescription className="text-xs">
              {formatSize(used)} {t('storage.of')} {formatSize(limit)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={percentage} className="h-2" />
        
        {isWarning && (
          <Alert variant="destructive" className="py-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {language === 'hindi' 
                ? 'स्टोरेज लगभग भर गया है'
                : 'Storage almost full'}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
