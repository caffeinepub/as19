import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ReactNode } from 'react';

interface AdminMetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  iconColor: string;
  iconBgColor: string;
  borderColor: string;
  progress?: number;
}

export default function AdminMetricCard({
  title,
  value,
  subtitle,
  icon,
  iconColor,
  iconBgColor,
  borderColor,
  progress,
}: AdminMetricCardProps) {
  return (
    <Card className={`bg-slate-900/50 border ${borderColor} backdrop-blur-sm hover:bg-slate-900/70 transition-all duration-300`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm text-slate-400 mb-1">{title}</p>
            <p className="text-3xl font-bold text-slate-100">{value}</p>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 bg-gradient-to-br ${iconBgColor} rounded-xl border ${borderColor}`}>
            <div className={iconColor}>{icon}</div>
          </div>
        </div>
        {progress !== undefined && (
          <div className="space-y-2">
            <Progress 
              value={progress} 
              className="h-2 bg-slate-800"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
