import { useState, useRef } from 'react';
import { useUploadDocument } from '../hooks/useQueries';
import { useLanguage } from '../hooks/useLanguage';
import { useTranslations } from '../lib/translations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { FileText, Upload } from 'lucide-react';
import { ExternalBlob } from '../backend';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export default function DocumentUpload() {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadDocument = useUploadDocument();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(language === 'hindi' 
        ? 'अमान्य फ़ाइल प्रकार। कृपया PDF, DOCX, TXT, या Excel फ़ाइल अपलोड करें।'
        : 'Invalid file type. Please upload PDF, DOCX, TXT, or Excel files.');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error(language === 'hindi' 
        ? 'फ़ाइल का आकार 50 MB की सीमा से अधिक है'
        : 'File size exceeds 50 MB limit');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setProgress(percentage);
      });

      await uploadDocument.mutateAsync({
        filename: file.name,
        contentType: file.type,
        storageReference: blob,
        fileSize: BigInt(file.size),
      });

      toast.success(language === 'hindi' 
        ? 'डॉक्युमेंट सफलतापूर्वक अपलोड किया गया'
        : 'Document uploaded successfully');
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      toast.error(error.message || (language === 'hindi' 
        ? 'डॉक्युमेंट अपलोड करने में त्रुटि'
        : 'Error uploading document'));
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Card className="glass-effect dark:glass-effect-dark border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">{t('documents.upload')}</CardTitle>
            <CardDescription>
              {language === 'hindi' 
                ? 'PDF, DOCX, TXT, Excel (अधिकतम 50 MB)'
                : 'PDF, DOCX, TXT, Excel (Max 50 MB)'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
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
            {language === 'hindi' ? 'डॉक्युमेंट चुनें' : 'Select Document'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
