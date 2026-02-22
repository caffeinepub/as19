import { useState, useEffect } from 'react';
import { useGetAllPhotos, useDeletePhoto } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Image as ImageIcon, Trash2, Calendar, FileImage, X, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import type { PhotoMetadata } from '../backend';

interface PhotoGalleryProps {
  isAdmin: boolean;
}

export default function PhotoGallery({ isAdmin }: PhotoGalleryProps) {
  const { data: photos = [], isLoading, isFetching } = useGetAllPhotos();
  const deleteMutation = useDeletePhoto();
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMetadata | null>(null);
  const [photoToDelete, setPhotoToDelete] = useState<PhotoMetadata | null>(null);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<Set<string>>(new Set());
  const [isDownloading, setIsDownloading] = useState(false);
  const [previousCount, setPreviousCount] = useState(0);

  // Detect new photos and show notification
  useEffect(() => {
    if (photos.length > previousCount && previousCount > 0) {
      const newCount = photos.length - previousCount;
      toast.success(`${newCount} नई फ़ोटो${newCount > 1 ? 'एँ' : ''} जोड़ी गई`, {
        duration: 3000,
      });
    }
    setPreviousCount(photos.length);
  }, [photos.length]);

  const handleDelete = async () => {
    if (!photoToDelete) return;

    try {
      await deleteMutation.mutateAsync(photoToDelete.id);
      toast.success('फ़ोटो डिलीट हो गई');
      setPhotoToDelete(null);
      if (selectedPhoto?.id === photoToDelete.id) {
        setSelectedPhoto(null);
      }
      setSelectedPhotoIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(photoToDelete.id.toString());
        return newSet;
      });
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error('डिलीट करते समय त्रुटि हुई');
    }
  };

  const handleDownload = async (photo: PhotoMetadata) => {
    try {
      const bytes = await photo.storageReference.getBytes();
      const blob = new Blob([bytes], { type: photo.contentType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = photo.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('फ़ोटो डाउनलोड हो रही है');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('डाउनलोड करते समय त्रुटि हुई');
    }
  };

  const handleDownloadSelected = async () => {
    if (selectedPhotoIds.size === 0) return;

    setIsDownloading(true);
    try {
      const selectedPhotos = photos.filter(p => selectedPhotoIds.has(p.id.toString()));
      
      for (const photo of selectedPhotos) {
        const bytes = await photo.storageReference.getBytes();
        const blob = new Blob([bytes], { type: photo.contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = photo.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      toast.success(`${selectedPhotoIds.size} फ़ोटो डाउनलोड हो रही हैं`);
      setSelectedPhotoIds(new Set());
    } catch (error) {
      console.error('Download error:', error);
      toast.error('डाउनलोड करते समय त्रुटि हुई');
    } finally {
      setIsDownloading(false);
    }
  };

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotoIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedPhotoIds.size === photos.length) {
      setSelectedPhotoIds(new Set());
    } else {
      setSelectedPhotoIds(new Set(photos.map(p => p.id.toString())));
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleDateString('hi-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatFileSize = (bytes: bigint) => {
    const mb = Number(bytes) / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="w-full aspect-square" />
            <CardContent className="p-2 sm:p-3">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 px-4">
        <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg sm:text-xl font-semibold mb-2">कोई फ़ोटो नहीं</h3>
        <p className="text-sm sm:text-base text-muted-foreground">
          {isAdmin ? 'अपनी पहली फ़ोटो अपलोड करें' : 'अभी तक कोई फ़ोटो अपलोड नहीं की गई है'}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Selection Controls with Sync Indicator */}
      {photos.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 p-3 sm:p-4 bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-900 dark:to-pink-900 rounded-lg border border-rose-200 dark:border-rose-800">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={selectedPhotoIds.size === photos.length}
              onCheckedChange={toggleSelectAll}
              className="border-rose-400 data-[state=checked]:bg-rose-600 data-[state=checked]:border-rose-600"
            />
            <span className="text-xs sm:text-sm font-medium text-rose-900 dark:text-rose-100">
              {selectedPhotoIds.size > 0 
                ? `${selectedPhotoIds.size} फ़ोटो चयनित` 
                : 'सभी चुनें'}
            </span>
            {isFetching && !isLoading && (
              <Badge variant="outline" className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-800 flex items-center gap-1.5">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span className="text-xs">अपडेट</span>
              </Badge>
            )}
          </div>
          {selectedPhotoIds.size > 0 && (
            <Button
              onClick={handleDownloadSelected}
              disabled={isDownloading}
              size="sm"
              className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-md text-xs sm:text-sm"
            >
              <img src="/assets/generated/download-selected-rose-icon-transparent.dim_64x64.png" alt="" className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              {isDownloading ? 'डाउनलोड हो रहा है...' : `${selectedPhotoIds.size} फ़ोटो डाउनलोड करें`}
            </Button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {photos.map((photo) => {
          const photoId = photo.id.toString();
          const isSelected = selectedPhotoIds.has(photoId);
          
          return (
            <Card
              key={photoId}
              className={`overflow-hidden hover:shadow-lg transition-all cursor-pointer group relative ${
                isSelected ? 'ring-2 ring-rose-500 shadow-lg' : ''
              }`}
            >
              <div className="relative aspect-square bg-muted">
                <div 
                  className="absolute top-2 left-2 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePhotoSelection(photoId);
                  }}
                >
                  <div className="bg-white dark:bg-gray-900 rounded p-1 shadow-md">
                    <Checkbox
                      checked={isSelected}
                      className="border-rose-400 data-[state=checked]:bg-rose-600 data-[state=checked]:border-rose-600 h-4 w-4"
                    />
                  </div>
                </div>

                <img
                  src={photo.storageReference.getDirectURL()}
                  alt={photo.filename}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onClick={() => setSelectedPhoto(photo)}
                />
                
                <div className="absolute bottom-2 left-2">
                  <Badge variant="secondary" className="bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800 flex items-center gap-1 text-xs px-2 py-0.5">
                    <img src="/assets/generated/quality-badge-transparent.dim_48x48.png" alt="" className="w-2 h-2 sm:w-3 sm:h-3" />
                    <span className="hidden sm:inline">मूल गुणवत्ता</span>
                  </Badge>
                </div>
                
                {isAdmin && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 sm:h-8 sm:w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhotoToDelete(photo);
                    }}
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                )}
              </div>
              <CardContent className="p-2 sm:p-3" onClick={() => setSelectedPhoto(photo)}>
                <p className="font-medium truncate text-xs sm:text-sm">{photo.filename}</p>
                <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground mt-1">
                  <Calendar className="w-2 h-2 sm:w-3 sm:h-3" />
                  <span className="truncate">{formatDate(photo.uploadDate)}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Photo Detail Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 dark:from-rose-950 dark:via-pink-950 dark:to-rose-900 border-rose-200 dark:border-rose-800">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between pr-8">
              <span className="truncate text-sm sm:text-base text-rose-900 dark:text-rose-100">{selectedPhoto?.filename}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedPhoto(null)}
                className="shrink-0 hover:bg-rose-200 dark:hover:bg-rose-800 h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="space-y-3 sm:space-y-4">
              <div className="rounded-lg overflow-hidden border-2 border-rose-200 dark:border-rose-800 shadow-lg relative">
                <img
                  src={selectedPhoto.storageReference.getDirectURL()}
                  alt={selectedPhoto.filename}
                  className="w-full h-auto"
                />
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                  <Badge variant="secondary" className="bg-white/90 dark:bg-black/90 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800 flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm">
                    <img src="/assets/generated/quality-badge-transparent.dim_48x48.png" alt="" className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-medium">मूल गुणवत्ता में संग्रहीत</span>
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm bg-white/50 dark:bg-black/20 p-3 sm:p-4 rounded-lg border border-rose-200 dark:border-rose-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-rose-700 dark:text-rose-300 font-medium">अपलोड तिथि</p>
                    <p className="font-semibold text-rose-900 dark:text-rose-100 truncate">{formatDate(selectedPhoto.uploadDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileImage className="w-3 h-3 sm:w-4 sm:h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-rose-700 dark:text-rose-300 font-medium">फ़ाइल साइज़</p>
                    <p className="font-semibold text-rose-900 dark:text-rose-100 truncate">{formatFileSize(selectedPhoto.fileSize)}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  onClick={() => handleDownload(selectedPhoto)}
                  className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-md text-xs sm:text-sm"
                >
                  <img src="/assets/generated/download-rose-icon-transparent.dim_64x64.png" alt="" className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  मूल गुणवत्ता में डाउनलोड करें
                </Button>
                {isAdmin && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setPhotoToDelete(selectedPhoto);
                      setSelectedPhoto(null);
                    }}
                    className="bg-rose-600 hover:bg-rose-700 text-xs sm:text-sm"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    डिलीट करें
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!photoToDelete} onOpenChange={() => setPhotoToDelete(null)}>
        <AlertDialogContent className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950 dark:to-pink-950 border-rose-200 dark:border-rose-800 max-w-[90vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-rose-900 dark:text-rose-100 text-sm sm:text-base">क्या आप निश्चित हैं?</AlertDialogTitle>
            <AlertDialogDescription className="text-rose-700 dark:text-rose-300 text-xs sm:text-sm">
              यह फ़ोटो स्थायी रूप से डिलीट हो जाएगी। इस क्रिया को पूर्ववत नहीं किया जा सकता।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="border-rose-300 dark:border-rose-700 hover:bg-rose-100 dark:hover:bg-rose-900 text-xs sm:text-sm m-0">रद्द करें</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-rose-600 text-white hover:bg-rose-700 text-xs sm:text-sm m-0"
            >
              डिलीट करें
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
