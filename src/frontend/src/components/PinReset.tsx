import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useResetPin } from '../hooks/useQueries';
import { usePinSession } from '../hooks/usePinSession';
import { useLanguage } from '../hooks/useLanguage';
import { useTranslations } from '../lib/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Shield, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PinResetProps {
  onBack: () => void;
}

export default function PinReset({ onBack }: PinResetProps) {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const { login, loginStatus, identity } = useInternetIdentity();
  const resetPin = useResetPin();
  const { clearSession } = usePinSession();
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isReauthenticated, setIsReauthenticated] = useState(false);
  const [originalPrincipal, setOriginalPrincipal] = useState<string | null>(null);

  // Store the original principal when component mounts
  useEffect(() => {
    if (identity) {
      setOriginalPrincipal(identity.getPrincipal().toString());
    }
  }, []);

  const isPinValid = newPin.length >= 4 && newPin.length <= 6 && /^\d+$/.test(newPin);
  const pinsMatch = newPin === confirmNewPin && confirmNewPin.length > 0;
  const canSubmit = isPinValid && pinsMatch;

  const handleReauthenticate = async () => {
    try {
      await login();
      
      // After successful login, verify the principal matches
      if (identity) {
        const newPrincipal = identity.getPrincipal().toString();
        if (originalPrincipal && newPrincipal !== originalPrincipal) {
          const error = language === 'hindi'
            ? 'प्रिंसिपल मेल नहीं खाता - कृपया वही खाता उपयोग करें'
            : 'Principal mismatch - please use the same account';
          setErrorMessage(error);
          toast.error(error);
          return;
        }
        setIsReauthenticated(true);
        toast.success(t('pin.reauthSuccess'));
      }
    } catch (error: any) {
      console.error('Reauthentication error:', error);
      const errorMsg = language === 'hindi'
        ? 'प्रमाणीकरण विफल - कृपया पुनः प्रयास करें'
        : 'Authentication failed - please try again';
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

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

    if (!identity) {
      const error = language === 'hindi'
        ? 'पहचान उपलब्ध नहीं है'
        : 'Identity not available';
      setErrorMessage(error);
      toast.error(error);
      return;
    }

    try {
      const principalToUpdate = identity.getPrincipal();
      await resetPin.mutateAsync({ principalToUpdate, newPin });
      toast.success(t('pin.resetSuccess'));
      clearSession();
      onBack();
    } catch (error: any) {
      console.error('PIN reset error:', error);
      let errorMsg = language === 'hindi'
        ? 'पिन रीसेट में त्रुटि। कृपया पुनः प्रयास करें।'
        : 'Error resetting PIN. Please try again.';
      
      if (error?.message?.includes('Unauthorized')) {
        errorMsg = language === 'hindi'
          ? 'अनधिकृत - कृपया फिर से लॉगिन करें'
          : 'Unauthorized - please log in again';
      }
      
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 romantic-gradient">
      <Card className="w-full max-w-md shadow-2xl border-2 fade-in">
        <CardHeader className="text-center space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="absolute left-4 top-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <RefreshCw className="w-10 h-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gradient">{t('pin.resetTitle')}</CardTitle>
          <CardDescription className="text-base">
            {t('pin.resetInstructions')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isReauthenticated ? (
            <div className="space-y-6">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {t('pin.reauthRequired')}
                </AlertDescription>
              </Alert>

              {errorMessage && (
                <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {errorMessage}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleReauthenticate}
                className="w-full py-6 text-lg font-semibold rounded-xl"
                disabled={loginStatus === 'logging-in'}
              >
                {loginStatus === 'logging-in' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    {t('pin.reauthenticating')}
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    {t('pin.reauthButton')}
                  </>
                )}
              </Button>
            </div>
          ) : (
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
                  autoFocus
                  disabled={resetPin.isPending}
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
                  disabled={resetPin.isPending}
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
                disabled={resetPin.isPending || !canSubmit}
              >
                {resetPin.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    {t('pin.resetting')}
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2" />
                    {t('pin.resetButton')}
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
