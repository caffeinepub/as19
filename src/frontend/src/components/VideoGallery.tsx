import { useState } from 'react';
import { useGetAllVideos, useDeleteVideo } from '../hooks/useQueries';
import { useLanguage } from '../hooks/useLanguage';
import { useTranslations } from '../lib/translations';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Video, Download, Trash2, Loader2, Play } from 'lucide-react';

interface VideoGalleryProps {
  isAdmin: boolean;
}

export default function VideoGallery({ isAdmin }: VideoGalleryProps) {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const { data: videos = [], isLoading } = useGetAllVideos();
  const deleteVideo = useDeleteVideo();
  const [deletingId, setDeletingId] = useState<bigint | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const handleDownload = (video: any) => {
    try {
      const url = video.storageReference.getDirectURL();
      const link = document.createElement('a');
      link.href = url;
      link.download = video.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(language === 'hindi' ? 'डाउनलोड शुरू हो गया' : 'Download started');
    } catch (error) {
      toast.error(language === 'hindi' ? 'डाउनलोड करने में त्रुटि' : 'Error downloading video');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await deleteVideo.mutateAsync(deletingId);
      toast.success(language === 'hindi' ? 'वीडियो हटाया गया' : 'Video deleted successfully');
      setDeletingId(null);
    } catch (error: any) {
      toast.error(error.message || (language === 'hindi' ? 'हटाने में त्रुटि' : 'Error deleting video'));
    }
  };

  const formatSize = (bytes: bigint) => {
    const num = Number(bytes);
    const mb = num / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatDuration = (seconds?: bigint) => {
    if (!seconds) return '--:--';
    const num = Number(seconds);
    const mins = Math.floor(num / 60);
    const secs = num % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <Card className="glass-effect dark:glass-effect-dark">
        <CardContent className="py-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </CardContent>
      </Card>
    );
  }

  if (videos.length === 0) {
    return (
      <Card className="glass-effect dark:glass-effect-dark">
        <CardContent className="py-12 text-center">
          <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">{t('videos.noVideos')}</h3>
          <p className="text-muted-foreground">
            {language === 'hindi' ? 'अभी तक कोई वीडियो अपलोड नहीं किया गया' : 'No videos uploaded yet'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => {
          const videoUrl = video.storageReference.getDirectURL();
          const thumbnailUrl = video.thumbnailReference?.getDirectURL();

          return (
            <Card key={video.id.toString()} className="glass-effect dark:glass-effect-dark hover:shadow-lg transition-smooth overflow-hidden">
              <div 
                className="relative aspect-video bg-muted cursor-pointer group"
                onClick={() => setPlayingVideo(videoUrl)}
              >
                {thumbnailUrl ? (
                  <img 
                    src={thumbnailUrl} 
                    alt={video.filename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-12 h-12 text-white" />
                </div>
                {video.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(video.duration)}
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm truncate mb-1">{video.filename}</h3>
                <p className="text-xs text-muted-foreground mb-3">{formatSize(video.fileSize)}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(video)}
                    className="flex-1"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    {language === 'hindi' ? 'डाउनलोड' : 'Download'}
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeletingId(video.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Video Player Dialog */}
      <Dialog open={!!playingVideo} onOpenChange={(open) => !open && setPlayingVideo(null)}>
        <DialogContent className="max-w-4xl">
          {playingVideo && (
            <video 
              src={playingVideo} 
              controls 
              autoPlay 
              className="w-full rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'hindi' ? 'वीडियो हटाएं?' : 'Delete Video?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'hindi' 
                ? 'यह क्रिया पूर्ववत नहीं की जा सकती। यह वीडियो स्थायी रूप से हटा दिया जाएगा।'
                : 'This action cannot be undone. This video will be permanently deleted.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteVideo.isPending}>
              {t('common.no')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteVideo.isPending}>
              {deleteVideo.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {language === 'hindi' ? 'हटाया जा रहा है...' : 'Deleting...'}
                </>
              ) : (
                t('common.yes')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
