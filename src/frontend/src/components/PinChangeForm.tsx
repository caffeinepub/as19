import { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useTranslations } from '../lib/translations';
import { useChangePin, useVerifyPin } from '../hooks/useQueries';
import { usePinSession } from '../hooks/usePinSession';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function PinChangeForm() {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const changePin = useChangePin();
  const verifyPin = useVerifyPin();
  const { clearSession } = usePinSession();
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const isPinValid = newPin.length >= 4 && newPin.length <= 6 && /^\d+$/.test(newPin);
  const pinsMatch = newPin === confirmNewPin && confirmNewPin.length > 0;
  const canSubmit = currentPin.length >= 4 && isPinValid && pinsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (currentPin.length < 4) {
      const error = t('pin.enterCurrentPinError');
      setErrorMessage(error);
      toast.error(error);
      return;
    }

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
      // First verify the current PIN
      setIsVerifying(true);
      const isCurrentPinValid = await verifyPin.mutateAsync(currentPin);
      setIsVerifying(false);

      if (!isCurrentPinValid) {
        const error = t('pin.currentPinIncorrect');
        setErrorMessage(error);
        toast.error(error);
        setCurrentPin('');
        return;
      }

      // If current PIN is valid, proceed with change
      await changePin.mutateAsync({ currentPin, newPin });
      toast.success(t('pin.changeSuccess'));
      clearSession();
      setCurrentPin('');
      setNewPin('');
      setConfirmNewPin('');
    } catch (error: any) {
      console.error('PIN change error:', error);
      let errorMsg = language === 'hindi'
        ? 'पिन बदलने में त्रुटि। कृपया पुनः प्रयास करें।'
        : 'Error changing PIN. Please try again.';
      
      if (error?.message?.includes('incorrect')) {
        errorMsg = t('pin.currentPinIncorrect');
      }
      
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  const isProcessing = isVerifying || changePin.isPending;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          {t('pin.changeTitle')}
        </CardTitle>
        <CardDescription>
          {t('pin.changeInstructions')}
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
            <Label htmlFor="currentPin" className="text-base font-semibold">
              {t('pin.currentPinLabel')}
            </Label>
            <Input
              id="currentPin"
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder={t('pin.currentPinPlaceholder')}
              value={currentPin}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 6) {
                  setCurrentPin(value);
                  if (errorMessage) setErrorMessage(null);
                }
              }}
              className="text-lg py-6 rounded-xl text-center tracking-widest"
              disabled={isProcessing}
              maxLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPin" className="text-base font-semibold">
              {t('pin.newPinLabel')}
            </Label>
            <Input
              id="newPin"
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder={t('pin.newPinPlaceholder')}
              value={newPin}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 6) {
                  setNewPin(value);
                  if (errorMessage) setErrorMessage(null);
                }
              }}
              className="text-lg py-6 rounded-xl text-center tracking-widest"
              disabled={isProcessing}
              maxLength={6}
            />
            {newPin.length > 0 && (
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
            <Label htmlFor="confirmNewPin" className="text-base font-semibold">
              {t('pin.confirmNewPinLabel')}
            </Label>
            <Input
              id="confirmNewPin"
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder={t('pin.confirmNewPinPlaceholder')}
              value={confirmNewPin}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 6) {
                  setConfirmNewPin(value);
                  if (errorMessage) setErrorMessage(null);
                }
              }}
              className="text-lg py-6 rounded-xl text-center tracking-widest"
              disabled={isProcessing}
              maxLength={6}
            />
            {confirmNewPin.length > 0 && (
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
            disabled={isProcessing || !canSubmit}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                {isVerifying ? t('pin.verifying') : t('pin.changing')}
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 mr-2" />
                {t('pin.changeButton')}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
