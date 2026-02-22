import { useState, useEffect } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin, useGetUserLanguagePreference, useSetUserLanguagePreference } from './hooks/useQueries';
import { useLanguage } from './hooks/useLanguage';
import { usePinSession } from './hooks/usePinSession';
import WelcomePage from './pages/WelcomePage';
import PhotosPage from './pages/PhotosPage';
import VideosPage from './pages/VideosPage';
import DocumentsPage from './pages/DocumentsPage';
import MemoriesPage from './pages/MemoriesPage';
import MediaCenterPage from './pages/MediaCenterPage';
import StorageDashboardPage from './pages/StorageDashboardPage';
import ProfilePage from './pages/ProfilePage';
import ProfileSetup from './components/ProfileSetup';
import PinSetup from './components/PinSetup';
import LanguageSelector from './components/LanguageSelector';
import Navigation from './components/Navigation';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { Language } from './backend';

export default function App() {
  const { identity, clear } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const { data: backendLanguage } = useGetUserLanguagePreference();
  const setBackendLanguage = useSetUserLanguagePreference();
  const { language, setLanguage, hasSelectedLanguage } = useLanguage();
  const { clearSession } = usePinSession();
  const [activeSection, setActiveSection] = useState('media');

  const isAuthenticated = !!identity;

  // Sync language preference from backend to local state after login
  useEffect(() => {
    if (isAuthenticated && backendLanguage && backendLanguage !== language) {
      setLanguage(backendLanguage);
    }
  }, [isAuthenticated, backendLanguage, language, setLanguage]);

  // Sync language preference from local state to backend when it changes
  useEffect(() => {
    if (isAuthenticated && hasSelectedLanguage && userProfile) {
      const currentBackendLang = userProfile.languagePreference;
      if (currentBackendLang !== language) {
        setBackendLanguage.mutate(language);
      }
    }
  }, [isAuthenticated, hasSelectedLanguage, language, userProfile]);

  const handleLogout = async () => {
    clearSession(); // Clear PIN session
    await clear();
    window.location.reload();
  };

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;
  const showPinSetup = isAuthenticated && !profileLoading && isFetched && userProfile !== null && userProfile !== undefined && (!userProfile.pin || userProfile.pin === '');

  // Ensure userProfile is never undefined when passed to components
  const safeUserProfile = userProfile === undefined ? null : userProfile;

  // Show language selector if user hasn't selected a language yet
  if (!hasSelectedLanguage) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <LanguageSelector />
        <Toaster />
      </ThemeProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <WelcomePage />
        <Toaster />
      </ThemeProvider>
    );
  }

  if (showProfileSetup) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ProfileSetup />
        <Toaster />
      </ThemeProvider>
    );
  }

  if (showPinSetup) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <PinSetup />
        <Toaster />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        <Navigation 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
          userProfile={safeUserProfile}
          onLogout={handleLogout}
          isAdmin={isAdmin}
        />

        <main className="w-full">
          {activeSection === 'media' && (
            <MediaCenterPage onLogout={handleLogout} isAdmin={isAdmin} />
          )}
          {activeSection === 'photos' && (
            <PhotosPage />
          )}
          {activeSection === 'videos' && (
            <VideosPage isAdmin={isAdmin} />
          )}
          {activeSection === 'documents' && (
            <DocumentsPage isAdmin={isAdmin} />
          )}
          {activeSection === 'memories' && (
            <MemoriesPage isAdmin={isAdmin} />
          )}
          {activeSection === 'storage' && (
            <StorageDashboardPage onLogout={handleLogout} />
          )}
          {activeSection === 'profile' && (
            <ProfilePage userProfile={safeUserProfile} onLogout={handleLogout} />
          )}
        </main>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
