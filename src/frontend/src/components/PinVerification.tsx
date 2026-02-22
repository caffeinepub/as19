import { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useTranslations } from '../lib/translations';
import { usePinSession } from '../hooks/usePinSession';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Unlock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PinReset from './PinReset';

export default function PinVerification() {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const { verifyPin, isVerifying } = usePinSession();
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showReset, setShowReset] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (pin.length < 4) {
      const error = t('pin.enterPinError');
      setErrorMessage(error);
      return;
    }

    const success = await verifyPin(pin);
    if (!success) {
      const error = t('pin.invalidPinError');
      setErrorMessage(error);
      setPin('');
    }
  };

  if (showReset) {
    return <PinReset onBack={() => setShowReset(false)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 romantic-gradient">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Lock className="absolute top-20 left-10 text-primary/10 w-16 h-16 floating-hearts" style={{ animationDelay: '0s' }} />
        <Unlock className="absolute bottom-20 right-10 text-accent/10 w-12 h-12 floating-hearts" style={{ animationDelay: '2s' }} />
      </div>

      <Card className="w-full max-w-md shadow-2xl border-2 fade-in">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-10 h-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gradient">{t('pin.verificationTitle')}</CardTitle>
          <CardDescription className="text-base">
            {t('pin.verificationInstructions')}
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
                {t('pin.enterPinLabel')}
              </Label>
              <Input
                id="pin"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={t('pin.enterPinPlaceholder')}
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
                disabled={isVerifying}
                maxLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-lg font-semibold rounded-xl"
              disabled={isVerifying || pin.length < 4}
            >
              {isVerifying ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                  {t('pin.verifying')}
                </>
              ) : (
                <>
                  <Unlock className="w-5 h-5 mr-2" />
                  {t('pin.verifyButton')}
                </>
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowReset(true)}
                className="text-sm text-primary hover:underline"
                disabled={isVerifying}
              >
                {t('pin.forgotPin')}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
