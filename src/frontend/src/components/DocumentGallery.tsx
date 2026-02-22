import { useGetAllDocuments, useDeleteDocument } from '../hooks/useQueries';
import { useLanguage } from '../hooks/useLanguage';
import { useTranslations } from '../lib/translations';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { FileText, Download, Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface DocumentGalleryProps {
  isAdmin: boolean;
}

export default function DocumentGallery({ isAdmin }: DocumentGalleryProps) {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const { data: documents = [], isLoading } = useGetAllDocuments();
  const deleteDocument = useDeleteDocument();
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const handleDownload = (doc: any) => {
    try {
      const url = doc.storageReference.getDirectURL();
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(language === 'hindi' ? 'डाउनलोड शुरू हो गया' : 'Download started');
    } catch (error) {
      toast.error(language === 'hindi' ? 'डाउनलोड करने में त्रुटि' : 'Error downloading document');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await deleteDocument.mutateAsync(deletingId);
      toast.success(language === 'hindi' ? 'डॉक्युमेंट हटाया गया' : 'Document deleted successfully');
      setDeletingId(null);
    } catch (error: any) {
      toast.error(error.message || (language === 'hindi' ? 'हटाने में त्रुटि' : 'Error deleting document'));
    }
  };

  const formatSize = (bytes: bigint) => {
    const num = Number(bytes);
    const mb = num / (1024 * 1024);
    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    }
    return `${(num / 1024).toFixed(2)} KB`;
  };

  const getFileIcon = (contentType: string) => {
    if (contentType.includes('pdf')) return '📄';
    if (contentType.includes('word')) return '📝';
    if (contentType.includes('excel') || contentType.includes('spreadsheet')) return '📊';
    if (contentType.includes('text')) return '📃';
    return '📁';
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

  if (documents.length === 0) {
    return (
      <Card className="glass-effect dark:glass-effect-dark">
        <CardContent className="py-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">{t('documents.noDocuments')}</h3>
          <p className="text-muted-foreground">
            {language === 'hindi' ? 'अभी तक कोई डॉक्युमेंट अपलोड नहीं किया गया' : 'No documents uploaded yet'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <Card key={doc.id.toString()} className="glass-effect dark:glass-effect-dark hover:shadow-lg transition-smooth">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="text-4xl shrink-0">{getFileIcon(doc.contentType)}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate mb-1">{doc.filename}</h3>
                  <p className="text-xs text-muted-foreground">{formatSize(doc.fileSize)}</p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(doc)}
                      className="flex-1"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      {language === 'hindi' ? 'डाउनलोड' : 'Download'}
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingId(doc.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'hindi' ? 'डॉक्युमेंट हटाएं?' : 'Delete Document?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'hindi' 
                ? 'यह क्रिया पूर्ववत नहीं की जा सकती। यह डॉक्युमेंट स्थायी रूप से हटा दिया जाएगा।'
                : 'This action cannot be undone. This document will be permanently deleted.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteDocument.isPending}>
              {t('common.no')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteDocument.isPending}>
              {deleteDocument.isPending ? (
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
