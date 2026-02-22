import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { useLanguage } from '../hooks/useLanguage';
import { useTranslations } from '../lib/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ProfileSetup() {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      toast.error(t('profileSetup.enterNameError'));
      return;
    }

    try {
      await saveProfile.mutateAsync({ 
        name: name.trim(),
        languagePreference: language,
        pin: '', // Empty PIN for initial profile setup
      });
      toast.success(t('profileSetup.successMessage'));
    } catch (error: any) {
      console.error('Profile save error:', error);
      
      let errorMsg = language === 'hindi'
        ? 'आपकी प्रोफ़ाइल सहेजने में असमर्थ। कृपया पुनः प्रयास करें।'
        : 'Unable to save your profile. Please try again.';
      
      if (error?.message) {
        const msg = error.message.toLowerCase();
        
        if (msg.includes('unauthorized') || msg.includes('अनधिकृत')) {
          errorMsg = language === 'hindi'
            ? 'अनधिकृत: केवल प्रमाणित उपयोगकर्ता प्रोफ़ाइल सहेज सकते हैं।'
            : 'Unauthorized: Only authenticated users can save profiles.';
        } else if (msg.includes('actor not available')) {
          errorMsg = language === 'hindi'
            ? 'बैकएंड कनेक्शन उपलब्ध नहीं है। कृपया पृष्ठ को रीफ्रेश करें।'
            : 'Backend connection not available. Please refresh the page.';
        } else {
          errorMsg = error.message;
        }
      }
      
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 romantic-gradient">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Heart className="absolute top-20 left-10 text-primary/10 w-16 h-16 floating-hearts" style={{ animationDelay: '0s' }} />
        <Heart className="absolute bottom-20 right-10 text-accent/10 w-12 h-12 floating-hearts" style={{ animationDelay: '2s' }} />
        <Sparkles className="absolute top-1/3 right-1/4 text-primary/10 w-10 h-10 floating-hearts" style={{ animationDelay: '1s' }} />
      </div>

      <Card className="w-full max-w-md shadow-2xl border-2 fade-in">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <img
              src="/assets/generated/as19-logo-transparent.dim_200x200.png"
              alt="AS19"
              className="w-20 h-20 object-contain"
            />
          </div>
          <CardTitle className="text-3xl font-bold text-gradient">{t('profileSetup.welcome')}</CardTitle>
          <CardDescription className="text-base">
            {t('profileSetup.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-semibold">
                {t('profileSetup.namePrompt')}
              </Label>
              <Input
                id="name"
                type="text"
                placeholder={t('profileSetup.namePlaceholder')}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="text-lg py-6 rounded-xl"
                autoFocus
                disabled={saveProfile.isPending}
              />
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-lg font-semibold rounded-xl"
              disabled={saveProfile.isPending || !name.trim()}
            >
              {saveProfile.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                  {t('profileSetup.creating')}
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5 mr-2 fill-current" />
                  {t('profileSetup.continue')}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
