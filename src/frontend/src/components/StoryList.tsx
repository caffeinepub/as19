import { useState } from 'react';
import { useGetAllMemories, useDeleteMemory, useUpdateMemory } from '../hooks/useQueries';
import { useLanguage } from '../hooks/useLanguage';
import { useTranslations } from '../lib/translations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Heart, Edit, Trash2, Loader2, Calendar } from 'lucide-react';
import type { MemoryMetadata } from '../types/frontend-types';

interface StoryListProps {
  isAdmin: boolean;
}

export default function StoryList({ isAdmin }: StoryListProps) {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const { data: memories = [], isLoading } = useGetAllMemories();
  const deleteMemory = useDeleteMemory();
  const updateMemory = useUpdateMemory();
  
  const [editingMemory, setEditingMemory] = useState<MemoryMetadata | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const handleEdit = (memory: MemoryMetadata) => {
    setEditingMemory(memory);
    setEditTitle(memory.title);
    setEditDescription(memory.description);
  };

  const handleUpdate = async () => {
    if (!editingMemory || !editTitle.trim() || !editDescription.trim()) {
      toast.error(language === 'hindi' ? 'कृपया शीर्षक और विवरण दर्ज करें' : 'Please enter title and description');
      return;
    }

    try {
      await updateMemory.mutateAsync({
        id: editingMemory.id,
        title: editTitle.trim(),
        description: editDescription.trim(),
        documentReference: editingMemory.documentReference,
      });
      
      toast.success(language === 'hindi' ? 'मेमोरी अपडेट की गई' : 'Memory updated successfully');
      setEditingMemory(null);
    } catch (error: any) {
      toast.error(error.message || (language === 'hindi' ? 'अपडेट करने में त्रुटि' : 'Error updating memory'));
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await deleteMemory.mutateAsync(deletingId);
      toast.success(language === 'hindi' ? 'मेमोरी हटाई गई' : 'Memory deleted successfully');
      setDeletingId(null);
    } catch (error: any) {
      toast.error(error.message || (language === 'hindi' ? 'हटाने में त्रुटि' : 'Error deleting memory'));
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString(language === 'hindi' ? 'hi-IN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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

  if (memories.length === 0) {
    return (
      <Card className="glass-effect dark:glass-effect-dark">
        <CardContent className="py-12 text-center">
          <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">{t('stories.noStories')}</h3>
          <p className="text-muted-foreground">{t('stories.createFirst')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {memories.map((memory) => (
          <Card key={memory.id.toString()} className="glass-effect dark:glass-effect-dark hover:shadow-lg transition-smooth">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{memory.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(memory.createdDate)}
                  </CardDescription>
                </div>
                {isAdmin && (
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(memory)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingId(memory.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-4">
                {memory.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingMemory} onOpenChange={(open) => !open && setEditingMemory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('stories.edit')}</DialogTitle>
            <DialogDescription>
              {language === 'hindi' ? 'अपनी मेमोरी को संपादित करें' : 'Edit your memory'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('stories.title')}</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder={language === 'hindi' ? 'शीर्षक' : 'Title'}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('stories.content')}</label>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder={language === 'hindi' ? 'विवरण' : 'Description'}
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingMemory(null)}>
              {t('stories.cancel')}
            </Button>
            <Button onClick={handleUpdate} disabled={updateMemory.isPending}>
              {updateMemory.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('stories.updating')}
                </>
              ) : (
                t('stories.save')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'hindi' ? 'मेमोरी हटाएं?' : 'Delete Memory?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'hindi' 
                ? 'यह क्रिया पूर्ववत नहीं की जा सकती। यह मेमोरी स्थायी रूप से हटा दी जाएगी।'
                : 'This action cannot be undone. This memory will be permanently deleted.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMemory.isPending}>
              {t('common.no')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteMemory.isPending}>
              {deleteMemory.isPending ? (
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
