import { useState, useRef } from 'react';
import { useUploadVideo } from '../hooks/useQueries';
import { useLanguage } from '../hooks/useLanguage';
import { useTranslations } from '../lib/translations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Video, Upload } from 'lucide-react';
import { ExternalBlob } from '../backend';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

export default function VideoUpload() {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadVideo = useUploadVideo();

  const generateThumbnail = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;

      video.onloadedmetadata = () => {
        video.currentTime = Math.min(1, video.duration / 2);
      };

      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to generate thumbnail'));
            }
          }, 'image/jpeg', 0.8);
        } else {
          reject(new Error('Failed to get canvas context'));
        }
      };

      video.onerror = () => reject(new Error('Failed to load video'));
      video.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error(language === 'hindi' 
        ? 'फ़ाइल का आकार 100 MB की सीमा से अधिक है'
        : 'File size exceeds 100 MB limit');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const videoBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setProgress(percentage);
      });

      let thumbnailBlob: ExternalBlob | undefined;
      try {
        const thumbnail = await generateThumbnail(file);
        const thumbnailBuffer = await thumbnail.arrayBuffer();
        thumbnailBlob = ExternalBlob.fromBytes(new Uint8Array(thumbnailBuffer));
      } catch (error) {
        console.warn('Failed to generate thumbnail:', error);
      }

      await uploadVideo.mutateAsync({
        filename: file.name,
        contentType: file.type,
        storageReference: videoBlob,
        fileSize: BigInt(file.size),
        thumbnailReference: thumbnailBlob,
        duration: undefined,
      });

      toast.success(language === 'hindi' 
        ? 'वीडियो सफलतापूर्वक अपलोड किया गया'
        : 'Video uploaded successfully');
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      toast.error(error.message || (language === 'hindi' 
        ? 'वीडियो अपलोड करने में त्रुटि'
        : 'Error uploading video'));
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Card className="glass-effect dark:glass-effect-dark border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
            <Video className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">{t('videos.upload')}</CardTitle>
            <CardDescription>
              {language === 'hindi' 
                ? 'MP4, WebM, MOV (अधिकतम 100 MB)'
                : 'MP4, WebM, MOV (Max 100 MB)'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
        />
        
        {uploading ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {language === 'hindi' ? 'अपलोड हो रहा है...' : 'Uploading...'}
              </span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        ) : (
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
            disabled={uploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            {language === 'hindi' ? 'वीडियो चुनें' : 'Select Video'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
