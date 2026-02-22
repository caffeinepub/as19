import { useState } from 'react';
import { useSaveCallerUserProfile, useGetCallerUserProfile } from '../hooks/useQueries';
import { useLanguage } from '../hooks/useLanguage';
import { useTranslations } from '../lib/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function PinSetup() {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const saveProfile = useSaveCallerUserProfile();
  const { data: userProfile } = useGetCallerUserProfile();

  const isPinValid = pin.length >= 4 && pin.length <= 6 && /^\d+$/.test(pin);
  const pinsMatch = pin === confirmPin && confirmPin.length > 0;
  const canSubmit = isPinValid && pinsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isPinValid) {
      const error = t('pin.lengthError');
      setErrorMessage(error);
      toast.error(error);
      return;
    }

    if (!pinsMatch) {
      const error = t('pin.mismatchError');
      setErrorMessage(error);
      toast.error(error);
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: userProfile?.name || 'User',
        languagePreference: language,
        pin: pin,
      });
      toast.success(t('pin.setupSuccess'));
    } catch (error: any) {
      console.error('PIN setup error:', error);
      const errorMsg = language === 'hindi'
        ? 'पिन सेटअप में त्रुटि। कृपया पुनः प्रयास करें।'
        : 'Error setting up PIN. Please try again.';
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 romantic-gradient">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Lock className="absolute top-20 left-10 text-primary/10 w-16 h-16 floating-hearts" style={{ animationDelay: '0s' }} />
        <Shield className="absolute bottom-20 right-10 text-accent/10 w-12 h-12 floating-hearts" style={{ animationDelay: '2s' }} />
      </div>

      <Card className="w-full max-w-md shadow-2xl border-2 fade-in">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-10 h-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gradient">{t('pin.setupTitle')}</CardTitle>
          <CardDescription className="text-base">
            {t('pin.setupInstructions')}
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
              <Label htmlFor="pin" className="text-base font-semibold">
                {t('pin.pinLabel')}
              </Label>
              <Input
                id="pin"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={t('pin.pinPlaceholder')}
                value={pin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 6) {
                    setPin(value);
                    if (errorMessage) setErrorMessage(null);
                  }
                }}
                className="text-lg py-6 rounded-xl text-center tracking-widest"
                autoFocus
                disabled={saveProfile.isPending}
                maxLength={6}
              />
              {pin.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  {isPinValid ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 dark:text-green-400">{t('pin.strengthGood')}</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      <span className="text-amber-600 dark:text-amber-400">{t('pin.strengthWeak')}</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPin" className="text-base font-semibold">
                {t('pin.confirmPinLabel')}
              </Label>
              <Input
                id="confirmPin"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={t('pin.confirmPinPlaceholder')}
                value={confirmPin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 6) {
                    setConfirmPin(value);
                    if (errorMessage) setErrorMessage(null);
                  }
                }}
                className="text-lg py-6 rounded-xl text-center tracking-widest"
                disabled={saveProfile.isPending}
                maxLength={6}
              />
              {confirmPin.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  {pinsMatch ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 dark:text-green-400">{t('pin.pinsMatch')}</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-red-600 dark:text-red-400">{t('pin.pinsNoMatch')}</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-lg font-semibold rounded-xl"
              disabled={saveProfile.isPending || !canSubmit}
            >
              {saveProfile.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                  {t('pin.setting')}
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  {t('pin.setupButton')}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
