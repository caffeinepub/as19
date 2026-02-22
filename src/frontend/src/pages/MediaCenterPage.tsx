import { useLanguage } from '../hooks/useLanguage';
import CreatedByBanner from '../components/CreatedByBanner';
import PhotoUpload from '../components/PhotoUpload';
import VideoUpload from '../components/VideoUpload';
import DocumentUpload from '../components/DocumentUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image, Video, FileText, Heart, Upload, Eye } from 'lucide-react';

interface MediaCenterPageProps {
  onLogout: () => void;
  isAdmin: boolean;
}

export default function MediaCenterPage({ onLogout, isAdmin }: MediaCenterPageProps) {
  const { language } = useLanguage();

  const categories = [
    {
      id: 'photos',
      name: language === 'hindi' ? 'फ़ोटो' : 'Photos',
      icon: Image,
      color: 'from-blue-500 to-cyan-500',
      description: language === 'hindi' 
        ? 'अपनी यादों को मूल गुणवत्ता में संग्रहीत करें'
        : 'Store your memories in original quality',
    },
    {
      id: 'videos',
      name: language === 'hindi' ? 'वीडियो' : 'Videos',
      icon: Video,
      color: 'from-rose-500 to-pink-500',
      description: language === 'hindi'
        ? 'अपने वीडियो को सुरक्षित रूप से अपलोड करें'
        : 'Upload your videos securely',
    },
    {
      id: 'documents',
      name: language === 'hindi' ? 'डॉक्युमेंट' : 'Documents',
      icon: FileText,
      color: 'from-green-500 to-emerald-500',
      description: language === 'hindi'
        ? 'महत्वपूर्ण दस्तावेज़ों को व्यवस्थित करें'
        : 'Organize important documents',
    },
    {
      id: 'memories',
      name: language === 'hindi' ? 'मेमोरीज़' : 'Memories',
      icon: Heart,
      color: 'from-purple-500 to-pink-500',
      description: language === 'hindi'
        ? 'विशेष पलों को शब्दों में कैद करें'
        : 'Capture special moments in words',
    },
  ];

  return (
    <div className="min-h-screen bg-background w-full max-w-full overflow-x-hidden">
      <CreatedByBanner />
      
      <div className="fixed inset-0 atmospheric-bg opacity-10 pointer-events-none z-0 w-full h-full" />

      <header className="sticky top-14 z-10 border-b glass-effect dark:glass-effect-dark w-full">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 max-w-full">
          <div className="flex items-center justify-between gap-2 sm:gap-3 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <img 
                src="/assets/generated/as19-logo-transparent.dim_200x200.png" 
                alt="AS19" 
                className="w-8 h-8 sm:w-10 sm:h-10 shrink-0"
              />
              <h1 className="text-base sm:text-xl font-bold text-gradient truncate">
                {language === 'hindi' ? 'मीडिया सेंटर' : 'Media Center'}
              </h1>
            </div>
            <button
              onClick={onLogout}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors text-xs sm:text-sm font-medium shrink-0"
            >
              {language === 'hindi' ? 'लॉगआउट' : 'Logout'}
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 max-w-7xl w-full">
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center space-y-2 sm:space-y-3">
            <img 
              src="/assets/generated/media-center-modern@800x400.png" 
              alt="Media Center" 
              className="w-full max-w-2xl mx-auto rounded-2xl shadow-2xl mb-4 sm:mb-6"
            />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient">
              {language === 'hindi' ? 'अपने मीडिया को प्रबंधित करें' : 'Manage Your Media'}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              {language === 'hindi'
                ? 'अपनी फ़ोटो, वीडियो, डॉक्युमेंट और मेमोरीज़ को एक सुरक्षित स्थान पर संग्रहीत करें'
                : 'Store your photos, videos, documents, and memories in one secure place'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.id} className="glass-effect dark:glass-effect-dark hover:shadow-xl transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`p-3 sm:p-4 rounded-2xl bg-gradient-to-br ${category.color}`}>
                        <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-lg sm:text-xl truncate">{category.name}</CardTitle>
                        <CardDescription className="text-xs sm:text-sm line-clamp-2">
                          {category.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1 text-xs sm:text-sm"
                      onClick={() => {
                        const section = category.id;
                        window.dispatchEvent(new CustomEvent('navigate', { detail: section }));
                      }}
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      {language === 'hindi' ? 'देखें' : 'View'}
                    </Button>
                    {isAdmin && (
                      <Button 
                        className={`flex-1 bg-gradient-to-r ${category.color} text-white hover:opacity-90 text-xs sm:text-sm`}
                        onClick={() => {
                          const section = category.id;
                          window.dispatchEvent(new CustomEvent('navigate', { detail: section }));
                        }}
                      >
                        <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        {language === 'hindi' ? 'अपलोड' : 'Upload'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {isAdmin && (
            <div className="space-y-6 sm:space-y-8">
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-gradient mb-2">
                  {language === 'hindi' ? 'त्वरित अपलोड' : 'Quick Upload'}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {language === 'hindi' 
                    ? 'यहाँ से सीधे अपलोड करें'
                    : 'Upload directly from here'}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:gap-8">
                {/* Photo Upload */}
                <PhotoUpload isAdmin={isAdmin} />

                {/* Video Upload */}
                <VideoUpload />

                {/* Document Upload */}
                <DocumentUpload />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
