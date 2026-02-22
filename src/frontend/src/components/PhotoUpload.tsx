import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Upload, X, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { useUploadMultiplePhotos } from '../hooks/useQueries';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB in bytes

interface FileWithProgress {
  file: File;
  preview: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

interface PhotoUploadProps {
  isAdmin: boolean;
}

export default function PhotoUpload({ isAdmin }: PhotoUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileWithProgress[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const uploadMutation = useUploadMultiplePhotos();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setError(null);
    const validFiles: FileWithProgress[] = [];

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name}: केवल इमेज फ़ाइलें स्वीकार की जाती हैं`);
        continue;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name}: फ़ाइल का साइज़ 15 MB से अधिक है (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
        continue;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFiles(prev => 
          prev.map(f => 
            f.file === file ? { ...f, preview: reader.result as string } : f
          )
        );
      };
      reader.readAsDataURL(file);

      validFiles.push({
        file,
        preview: '',
        progress: 0,
        status: 'pending',
      });
    }

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setError(null);

    try {
      // Prepare all files for upload
      const uploadRequests = await Promise.all(
        selectedFiles.map(async (fileWithProgress, index) => {
          const { file } = fileWithProgress;
          
          // Update status to uploading
          setSelectedFiles(prev => 
            prev.map((f, i) => i === index ? { ...f, status: 'uploading' as const } : f)
          );

          // Read file as bytes for lossless upload
          const arrayBuffer = await file.arrayBuffer();
          const bytes = new Uint8Array(arrayBuffer);

          // Create ExternalBlob with progress tracking
          const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
            setSelectedFiles(prev => 
              prev.map((f, i) => i === index ? { ...f, progress: percentage } : f)
            );
          });

          return {
            filename: file.name,
            contentType: file.type,
            fileSize: BigInt(file.size),
            storageReference: blob,
          };
        })
      );

      // Upload all photos in batch
      await uploadMutation.mutateAsync({ photos: uploadRequests });

      // Mark all as success
      setSelectedFiles(prev => 
        prev.map(f => ({ ...f, status: 'success' as const, progress: 100 }))
      );

      toast.success(`${selectedFiles.length} फ़ोटो मूल गुणवत्ता में सफलतापूर्वक अपलोड हो गईं!`);
      
      // Reset form after a short delay
      setTimeout(() => {
        setSelectedFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 2000);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'अपलोड करते समय त्रुटि हुई');
      
      // Mark all as error
      setSelectedFiles(prev => 
        prev.map(f => ({ ...f, status: 'error' as const, error: err.message }))
      );
      
      toast.error('अपलोड विफल रहा');
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    if (fileInputRef.current && selectedFiles.length === 1) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancel = () => {
    setSelectedFiles([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0 && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      files.forEach(file => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
      
      const changeEvent = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(changeEvent);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const isUploading = uploadMutation.isPending;
  const hasFiles = selectedFiles.length > 0;

  return (
    <Card className="w-full border-rose-200 dark:border-rose-800 bg-gradient-to-br from-white to-rose-50 dark:from-gray-950 dark:to-rose-950">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-rose-900 dark:text-rose-100">
          <ImageIcon className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          फ़ोटो अपलोड करें
        </CardTitle>
        <CardDescription className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
          <Badge variant="secondary" className="bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800">
            <img src="/assets/generated/quality-badge-transparent.dim_48x48.png" alt="" className="w-3 h-3 mr-1" />
            मूल गुणवत्ता में संग्रहण
          </Badge>
          <span>अधिकतम: 15 MB प्रति फ़ोटो | एक साथ कई फ़ोटो चुनें</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="border-rose-300 dark:border-rose-700">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!hasFiles ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-rose-300 dark:border-rose-700 rounded-lg p-8 text-center hover:border-rose-500 dark:hover:border-rose-500 transition-colors cursor-pointer bg-white/50 dark:bg-black/20"
            onClick={() => fileInputRef.current?.click()}
          >
            <img 
              src="/assets/generated/multi-upload-progress-rose-transparent.dim_128x64.png" 
              alt="" 
              className="w-16 h-8 mx-auto mb-4 opacity-60"
            />
            <p className="text-lg font-medium mb-2 text-rose-900 dark:text-rose-100">एक या अधिक फ़ोटो चुनने के लिए क्लिक करें</p>
            <p className="text-sm text-rose-600 dark:text-rose-400">या यहाँ ड्रैग और ड्रॉप करें</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {selectedFiles.map((fileWithProgress, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-rose-100 dark:bg-rose-900 rounded-lg border border-rose-200 dark:border-rose-800">
                    {fileWithProgress.preview && (
                      <img
                        src={fileWithProgress.preview}
                        alt={fileWithProgress.file.name}
                        className="w-16 h-16 object-cover rounded border border-rose-200 dark:border-rose-800"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-rose-900 dark:text-rose-100">{fileWithProgress.file.name}</p>
                      <p className="text-sm text-rose-700 dark:text-rose-300">
                        {(fileWithProgress.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      {fileWithProgress.status === 'success' && (
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm mt-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>अपलोड सफल</span>
                        </div>
                      )}
                      {fileWithProgress.status === 'error' && (
                        <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm mt-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>अपलोड विफल</span>
                        </div>
                      )}
                    </div>
                    {!isUploading && fileWithProgress.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFile(index)}
                        className="shrink-0 hover:bg-rose-200 dark:hover:bg-rose-800"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  {fileWithProgress.status === 'uploading' && fileWithProgress.progress > 0 && (
                    <div className="space-y-1 px-3">
                      <div className="flex items-center justify-between text-xs text-rose-700 dark:text-rose-300">
                        <span>अपलोड हो रहा है...</span>
                        <span className="font-semibold">{fileWithProgress.progress}%</span>
                      </div>
                      <Progress value={fileWithProgress.progress} className="h-1.5 bg-rose-200 dark:bg-rose-900" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {uploadMutation.isSuccess && (
              <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  सभी फ़ोटो मूल गुणवत्ता में सफलतापूर्वक अपलोड हो गईं!
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleUpload}
                disabled={isUploading || selectedFiles.some(f => f.status === 'success')}
                className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-md"
              >
                {isUploading ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-pulse" />
                    {selectedFiles.length} फ़ोटो अपलोड हो रही हैं...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    {selectedFiles.length} फ़ोटो मूल गुणवत्ता में अपलोड करें
                  </>
                )}
              </Button>
              {!isUploading && (
                <Button variant="outline" onClick={handleCancel} className="border-rose-300 dark:border-rose-700 hover:bg-rose-100 dark:hover:bg-rose-900">
                  रद्द करें
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
