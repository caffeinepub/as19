import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Image, Video, FileText, Heart } from 'lucide-react';
import { AggregateStorageSummary } from '../backend';

interface AdminStorageTableProps {
  storageSummary: AggregateStorageSummary | undefined;
  isHindi: boolean;
}

export default function AdminStorageTable({ storageSummary, isHindi }: AdminStorageTableProps) {
  if (!storageSummary) {
    return (
      <div className="text-center py-8 text-slate-400">
        {isHindi ? 'कोई डेटा उपलब्ध नहीं' : 'No data available'}
      </div>
    );
  }

  const formatBytes = (bytes: bigint): string => {
    const num = Number(bytes);
    const mb = num / (1024 ** 2);
    const gb = num / (1024 ** 3);
    
    if (gb >= 1) {
      return `${gb.toFixed(2)} GB`;
    }
    return `${mb.toFixed(2)} MB`;
  };

  const categories = [
    {
      name: isHindi ? 'फ़ोटो' : 'Photos',
      icon: <Image className="w-5 h-5 text-rose-400" />,
      count: Number(storageSummary.totalPhotos),
      size: storageSummary.totalPhotosSize,
      color: 'text-rose-400',
    },
    {
      name: isHindi ? 'वीडियो' : 'Videos',
      icon: <Video className="w-5 h-5 text-purple-400" />,
      count: Number(storageSummary.totalVideos),
      size: storageSummary.totalVideosSize,
      color: 'text-purple-400',
    },
    {
      name: isHindi ? 'दस्तावेज़' : 'Documents',
      icon: <FileText className="w-5 h-5 text-blue-400" />,
      count: Number(storageSummary.totalDocuments),
      size: storageSummary.totalDocumentsSize,
      color: 'text-blue-400',
    },
    {
      name: isHindi ? 'यादें' : 'Memories',
      icon: <Heart className="w-5 h-5 text-pink-400" />,
      count: Number(storageSummary.totalMemories),
      size: storageSummary.totalMemoriesSize,
      color: 'text-pink-400',
    },
  ];

  const totalSize = 
    Number(storageSummary.totalPhotosSize) +
    Number(storageSummary.totalVideosSize) +
    Number(storageSummary.totalDocumentsSize) +
    Number(storageSummary.totalMemoriesSize);

  return (
    <div className="rounded-lg border border-slate-700/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-800/50 hover:bg-slate-800/50">
            <TableHead className="text-slate-300">
              {isHindi ? 'श्रेणी' : 'Category'}
            </TableHead>
            <TableHead className="text-slate-300 text-right">
              {isHindi ? 'फ़ाइलें' : 'Files'}
            </TableHead>
            <TableHead className="text-slate-300 text-right">
              {isHindi ? 'आकार' : 'Size'}
            </TableHead>
            <TableHead className="text-slate-300 text-right">
              {isHindi ? 'प्रतिशत' : 'Percentage'}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => {
            const percentage = totalSize > 0 
              ? ((Number(category.size) / totalSize) * 100).toFixed(1)
              : '0.0';
            
            return (
              <TableRow key={category.name} className="border-slate-700/50 hover:bg-slate-800/30">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    {category.icon}
                    <span className="text-slate-200">{category.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right text-slate-300">
                  {category.count.toLocaleString()}
                </TableCell>
                <TableCell className="text-right text-slate-300">
                  {formatBytes(category.size)}
                </TableCell>
                <TableCell className="text-right">
                  <span className={category.color}>{percentage}%</span>
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow className="bg-slate-800/50 hover:bg-slate-800/50 font-bold border-t-2 border-slate-600">
            <TableCell className="text-slate-100">
              {isHindi ? 'कुल' : 'Total'}
            </TableCell>
            <TableCell className="text-right text-slate-100">
              {(
                Number(storageSummary.totalPhotos) +
                Number(storageSummary.totalVideos) +
                Number(storageSummary.totalDocuments) +
                Number(storageSummary.totalMemories)
              ).toLocaleString()}
            </TableCell>
            <TableCell className="text-right text-slate-100">
              {formatBytes(BigInt(totalSize))}
            </TableCell>
            <TableCell className="text-right text-cyan-400">
              100%
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
