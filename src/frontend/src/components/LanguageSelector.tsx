import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Globe, Sparkles } from 'lucide-react';
import { Language } from '../backend';
import { useLanguage } from '../hooks/useLanguage';

export default function LanguageSelector() {
  const { setLanguage, markLanguageSelected } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<Language | null>(null);

  const handleLanguageSelect = (lang: Language) => {
    setSelectedLang(lang);
  };

  const handleContinue = () => {
    if (selectedLang) {
      setLanguage(selectedLang);
      markLanguageSelected();
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden relative">
      {/* Modern elegant background */}
      <div className="absolute inset-0 z-0 w-full max-w-full">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(/assets/generated/language-selection-modern@800x600.png)' }}
        />
        <div className="absolute inset-0 modern-gradient w-full h-full" />
      </div>

      {/* Floating Elements Decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden w-full max-w-full">
        <Sparkles className="absolute top-20 left-10 text-primary/30 w-12 h-12 floating-element" style={{ animationDelay: '0s' }} />
        <Heart className="absolute top-40 right-20 text-accent/30 w-8 h-8 floating-element" style={{ animationDelay: '2s' }} />
        <Sparkles className="absolute bottom-32 left-1/4 text-primary/20 w-10 h-10 floating-element" style={{ animationDelay: '4s' }} />
        <Globe className="absolute bottom-20 right-1/3 text-accent/20 w-8 h-8 floating-element" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 w-full max-w-full">
        <Card className="w-full max-w-2xl shadow-2xl border-2 fade-in glass-effect dark:glass-effect-dark">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <img
                src="/assets/generated/as19-logo-transparent.dim_200x200.png"
                alt="AS19 Logo"
                className="w-24 h-24 object-contain drop-shadow-2xl elegant-glow"
              />
            </div>
            <CardTitle className="text-4xl font-bold text-gradient flex items-center justify-center gap-3">
              <Globe className="w-10 h-10 text-primary" />
              Choose Your Language
            </CardTitle>
            <CardTitle className="text-3xl font-bold text-gradient">
              अपनी भाषा चुनें
            </CardTitle>
            <CardDescription className="text-lg">
              Select your preferred language to continue
              <br />
              जारी रखने के लिए अपनी पसंदीदा भाषा चुनें
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 p-8">
            {/* Language Options */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* English Button */}
              <button
                onClick={() => handleLanguageSelect(Language.english)}
                className={`
                  group relative p-8 rounded-2xl border-2 transition-smooth
                  ${selectedLang === Language.english
                    ? 'border-primary glass-effect dark:glass-effect-dark shadow-xl scale-105'
                    : 'border-border hover:border-primary/50 hover:bg-accent/10 hover:scale-102'
                  }
                `}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className={`
                    w-20 h-20 rounded-full flex items-center justify-center transition-smooth
                    ${selectedLang === Language.english
                      ? 'bg-gradient-to-br from-primary to-accent shadow-lg'
                      : 'bg-muted group-hover:bg-muted/80'
                    }
                  `}>
                    <img
                      src="/assets/generated/english-language-button.dim_120x60.png"
                      alt="English"
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className={`text-2xl font-bold transition-colors ${
                      selectedLang === Language.english ? 'text-primary' : 'text-foreground'
                    }`}>
                      English
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Continue in English
                    </p>
                  </div>
                </div>
                {selectedLang === Language.english && (
                  <div className="absolute top-4 right-4">
                    <Heart className="w-6 h-6 text-primary fill-primary animate-pulse" />
                  </div>
                )}
              </button>

              {/* Hindi Button */}
              <button
                onClick={() => handleLanguageSelect(Language.hindi)}
                className={`
                  group relative p-8 rounded-2xl border-2 transition-smooth
                  ${selectedLang === Language.hindi
                    ? 'border-primary glass-effect dark:glass-effect-dark shadow-xl scale-105'
                    : 'border-border hover:border-primary/50 hover:bg-accent/10 hover:scale-102'
                  }
                `}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className={`
                    w-20 h-20 rounded-full flex items-center justify-center transition-smooth
                    ${selectedLang === Language.hindi
                      ? 'bg-gradient-to-br from-primary to-accent shadow-lg'
                      : 'bg-muted group-hover:bg-muted/80'
                    }
                  `}>
                    <img
                      src="/assets/generated/hindi-language-button.dim_120x60.png"
                      alt="Hindi"
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className={`text-2xl font-bold transition-colors ${
                      selectedLang === Language.hindi ? 'text-primary' : 'text-foreground'
                    }`}>
                      हिंदी
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      हिंदी में जारी रखें
                    </p>
                  </div>
                </div>
                {selectedLang === Language.hindi && (
                  <div className="absolute top-4 right-4">
                    <Heart className="w-6 h-6 text-primary fill-primary animate-pulse" />
                  </div>
                )}
              </button>
            </div>

            {/* Continue Button */}
            <div className="pt-4">
              <Button
                onClick={handleContinue}
                disabled={!selectedLang}
                size="lg"
                className="w-full py-6 text-lg font-semibold rounded-full shadow-xl hover:shadow-primary/50 transition-smooth hover:scale-105 elegant-glow"
              >
                <Heart className="w-5 h-5 mr-2 fill-current" />
                {selectedLang === Language.hindi ? 'जारी रखें' : 'Continue'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
