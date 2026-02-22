import { useState } from 'react';
import { useCreateMemory } from '../hooks/useQueries';
import { useLanguage } from '../hooks/useLanguage';
import { useTranslations } from '../lib/translations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Heart, Loader2 } from 'lucide-react';

export default function StoryEditor() {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const createMemory = useCreateMemory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast.error(language === 'hindi' ? 'कृपया शीर्षक और विवरण दर्ज करें' : 'Please enter title and description');
      return;
    }

    try {
      await createMemory.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        documentReference: undefined,
      });
      
      toast.success(language === 'hindi' ? 'मेमोरी सफलतापूर्वक बनाई गई' : 'Memory created successfully');
      setTitle('');
      setDescription('');
    } catch (error: any) {
      toast.error(error.message || (language === 'hindi' ? 'मेमोरी बनाने में त्रुटि' : 'Error creating memory'));
    }
  };

  return (
    <Card className="glass-effect dark:glass-effect-dark border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">
              {language === 'hindi' ? 'नई मेमोरी बनाएं' : 'Create New Memory'}
            </CardTitle>
            <CardDescription>
              {language === 'hindi' ? 'अपनी यादों को संजोएं' : 'Preserve your precious moments'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('stories.title')}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={language === 'hindi' ? 'मेमोरी का शीर्षक' : 'Memory title'}
              disabled={createMemory.isPending}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">{t('stories.content')}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={language === 'hindi' ? 'अपनी यादें यहाँ लिखें...' : 'Write your memories here...'}
              rows={6}
              disabled={createMemory.isPending}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={createMemory.isPending}
          >
            {createMemory.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('stories.creating')}
              </>
            ) : (
              t('stories.save')
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
