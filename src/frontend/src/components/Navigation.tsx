import { useLanguage } from '../hooks/useLanguage';
import { useTranslations } from '../lib/translations';
import { usePinSession } from '../hooks/usePinSession';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Image, 
  Video, 
  FileText, 
  Heart, 
  Database, 
  User, 
  LogOut,
  Lock,
  Unlock,
  Grid3x3
} from 'lucide-react';
import { UserProfile } from '../backend';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  isAdmin: boolean;
}

export default function Navigation({ 
  activeSection, 
  onSectionChange, 
  userProfile,
  onLogout,
  isAdmin 
}: NavigationProps) {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const { isVerified } = usePinSession();

  const navItems = [
    { id: 'media', label: 'Media Center', icon: Grid3x3 },
    { id: 'photos', label: t('nav.photos'), icon: Image },
    { id: 'videos', label: t('nav.videos'), icon: Video },
    { id: 'documents', label: t('nav.documents'), icon: FileText },
    { id: 'memories', label: t('nav.memories'), icon: Heart },
    { id: 'storage', label: t('nav.storage'), icon: Database },
    { id: 'profile', label: t('nav.profile'), icon: User },
  ];

  const profilePictureUrl = userProfile?.profilePicture?.getDirectURL();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <img
              src="/assets/generated/as19-logo-transparent.dim_200x200.png"
              alt="AS19"
              className="w-10 h-10 object-contain"
            />
            <span className="text-xl font-bold text-gradient hidden sm:inline">AS19</span>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1 mx-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onSectionChange(item.id)}
                  className="shrink-0 gap-2"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Button>
              );
            })}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-3 shrink-0">
            {/* PIN Status Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-muted">
              {isVerified ? (
                <>
                  <Unlock className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-muted-foreground">
                    {language === 'hindi' ? 'अनलॉक' : 'Unlocked'}
                  </span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-500" />
                  <span className="text-xs text-muted-foreground">
                    {language === 'hindi' ? 'लॉक' : 'Locked'}
                  </span>
                </>
              )}
            </div>

            {/* User Avatar */}
            <Avatar className="w-8 h-8">
              <AvatarImage src={profilePictureUrl} alt={userProfile?.name} />
              <AvatarFallback>
                {userProfile?.name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="shrink-0"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">{t('nav.logout')}</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
