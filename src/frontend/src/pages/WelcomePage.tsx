import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useLanguage } from '../hooks/useLanguage';
import { useTranslations } from '../lib/translations';
import { Button } from '@/components/ui/button';
import { Heart, Lock, BookHeart, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import CreatedByBanner from '../components/CreatedByBanner';

export default function WelcomePage() {
  const { login, loginStatus } = useInternetIdentity();
  const { language } = useLanguage();
  const t = useTranslations(language);

  const handleLogin = async () => {
    try {
      await login();
      toast.success(language === 'hindi' ? 'स्वागत है! ✨' : 'Welcome! ✨');
    } catch (error: any) {
      let errorMessage = language === 'hindi' 
        ? 'लॉगिन विफल। कृपया पुनः प्रयास करें।'
        : 'Login failed. Please try again.';
      
      if (error?.message) {
        if (error.message.includes('User is already authenticated')) {
          errorMessage = language === 'hindi' ? 'आप पहले से लॉगिन हैं' : 'You are already logged in';
        } else if (error.message.includes('User interrupted')) {
          errorMessage = language === 'hindi' ? 'लॉगिन रद्द कर दिया गया' : 'Login cancelled';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
      console.error('Login error:', error);
    }
  };

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden relative">
      {/* Created By Banner */}
      <CreatedByBanner />

      {/* Modern elegant background */}
      <div className="absolute inset-0 z-0 w-full max-w-full">
        <div className="absolute inset-0 modern-bg opacity-30 w-full h-full" />
        <div className="absolute inset-0 modern-gradient w-full h-full" />
      </div>

      {/* Floating Elements Decoration - Hidden on mobile for performance */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden w-full max-w-full hidden sm:block">
        <Sparkles className="absolute top-20 left-10 text-primary/30 w-8 h-8 sm:w-12 sm:h-12 floating-element" style={{ animationDelay: '0s' }} />
        <Heart className="absolute top-40 right-20 text-accent/30 w-6 h-6 sm:w-8 sm:h-8 floating-element" style={{ animationDelay: '2s' }} />
        <Sparkles className="absolute bottom-32 left-1/4 text-primary/20 w-8 h-8 sm:w-10 sm:h-10 floating-element" style={{ animationDelay: '4s' }} />
        <Heart className="absolute bottom-20 right-1/3 text-accent/20 w-5 h-5 sm:w-6 sm:h-6 floating-element" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 w-full max-w-full">
        <div className="max-w-2xl w-full text-center space-y-6 sm:space-y-8 fade-in">
          {/* Logo */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <img
              src="/assets/generated/as19-logo-transparent.dim_200x200.png"
              alt="AS19 Logo"
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain drop-shadow-2xl elegant-glow"
            />
          </div>

          {/* Main Heading */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gradient tracking-tight px-2">
              {t('welcome.title')}
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground px-2">
              {t('welcome.subtitle')}
            </p>
          </div>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed px-4">
            {t('welcome.description')}
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 mb-8 sm:mb-12 w-full px-2">
            <div className="glass-effect dark:glass-effect-dark p-5 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-smooth hover:scale-102">
              <BookHeart className="w-8 h-8 sm:w-10 sm:h-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-base sm:text-lg mb-2">{t('welcome.feature1.title')}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{t('welcome.feature1.desc')}</p>
            </div>
            <div className="glass-effect dark:glass-effect-dark p-5 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-smooth hover:scale-102">
              <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-base sm:text-lg mb-2">{t('welcome.feature2.title')}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{t('welcome.feature2.desc')}</p>
            </div>
            <div className="glass-effect dark:glass-effect-dark p-5 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-smooth hover:scale-102 sm:col-span-2 md:col-span-1">
              <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-base sm:text-lg mb-2">{t('welcome.feature3.title')}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{t('welcome.feature3.desc')}</p>
            </div>
          </div>

          {/* Login Button */}
          <div className="pt-6 sm:pt-8 px-4">
            <Button
              onClick={handleLogin}
              size="lg"
              className="w-full sm:w-auto px-8 sm:px-12 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-full shadow-2xl hover:shadow-primary/50 transition-smooth hover:scale-105 elegant-glow"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                  {t('welcome.loggingIn')}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  {t('welcome.loginButton')}
                </>
              )}
            </Button>
          </div>

          {/* Footer */}
          <div className="pt-8 sm:pt-12 text-xs sm:text-sm text-muted-foreground px-4">
            <p>© 2025. {t('welcome.footer')} <Heart className="w-3 h-3 sm:w-4 sm:h-4 inline fill-primary text-primary" /> <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline">caffeine.ai</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
