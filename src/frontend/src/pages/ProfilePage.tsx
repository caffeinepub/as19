import { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useTranslations } from '../lib/translations';
import { useSaveCallerUserProfile, useUpdateProfilePicture } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Globe, Upload, X, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { Language, UserProfile, ExternalBlob } from '../backend';
import CreatedByBanner from '../components/CreatedByBanner';
import PinChangeForm from '../components/PinChangeForm';

interface ProfilePageProps {
  userProfile: UserProfile | null;
  onLogout: () => void;
}

export default function ProfilePage({ userProfile, onLogout }: ProfilePageProps) {
  const { language, setLanguage } = useLanguage();
  const t = useTranslations(language);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile?.name || '');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const saveProfile = useSaveCallerUserProfile();
  const updatePicture = useUpdateProfilePicture();

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error(t('profile.enterName'));
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        languagePreference: selectedLanguage,
        pin: userProfile?.pin || '',
      });
      setLanguage(selectedLanguage);
      setIsEditing(false);
      toast.success(t('profile.saveSuccess'));
    } catch (error) {
      console.error('Profile save error:', error);
      toast.error(t('profile.saveError'));
    }
  };

  const handleCancel = () => {
    setName(userProfile?.name || '');
    setSelectedLanguage(language);
    setIsEditing(false);
  };

  const handlePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error(t('profile.pictureInvalidFormat'));
      return;
    }

    // Validate file size (10 MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(t('profile.pictureTooLarge'));
      return;
    }

    setIsUploadingPicture(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array);

      await updatePicture.mutateAsync(blob);
      toast.success(t('profile.pictureUploadSuccess'));
    } catch (error) {
      console.error('Picture upload error:', error);
      toast.error(t('profile.pictureUploadError'));
    } finally {
      setIsUploadingPicture(false);
    }
  };

  const handlePictureRemove = async () => {
    try {
      await updatePicture.mutateAsync(null);
      toast.success(t('profile.pictureRemoveSuccess'));
    } catch (error) {
      console.error('Picture remove error:', error);
      toast.error(t('profile.pictureRemoveError'));
    }
  };

  const profilePictureUrl = userProfile?.profilePicture?.getDirectURL();

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <CreatedByBanner />

      <div className="fixed inset-0 rose-petal-bg opacity-5 pointer-events-none z-0 w-full h-full" />

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-4xl w-full">
        <div className="space-y-8 w-full">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-gradient">{t('profile.title')}</h1>
            <p className="text-muted-foreground">{t('profile.subtitle')}</p>
          </div>

          {/* Profile Picture Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                {t('profile.profilePicture')}
              </CardTitle>
              <CardDescription>{t('profile.profilePictureDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profilePictureUrl} alt={userProfile?.name} />
                  <AvatarFallback className="text-2xl">
                    {userProfile?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="picture-upload" className="cursor-pointer">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isUploadingPicture}
                      asChild
                    >
                      <span>
                        {isUploadingPicture ? (
                          <>
                            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2" />
                            {t('common.loading')}
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            {profilePictureUrl ? t('profile.changePhoto') : t('profile.uploadPhoto')}
                          </>
                        )}
                      </span>
                    </Button>
                  </Label>
                  <input
                    id="picture-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handlePictureUpload}
                    className="hidden"
                    disabled={isUploadingPicture}
                  />

                  {profilePictureUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handlePictureRemove}
                      disabled={updatePicture.isPending}
                    >
                      <X className="w-4 h-4 mr-2" />
                      {t('profile.removePhoto')}
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{t('profile.pictureFormats')}</p>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {t('profile.personalInfo')}
              </CardTitle>
              <CardDescription>{t('profile.personalInfoDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">{t('profile.name')}</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('profile.enterName')}
                  />
                ) : (
                  <p className="text-lg font-medium">{userProfile?.name || t('profile.notSet')}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="language" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  {t('profile.languagePreference')}
                </Label>
                {isEditing ? (
                  <Select
                    value={selectedLanguage}
                    onValueChange={(value) => setSelectedLanguage(value as Language)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Language.english}>{t('language.english')}</SelectItem>
                      <SelectItem value={Language.hindi}>{t('language.hindi')}</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-lg font-medium">
                    {language === Language.english ? t('language.english') : t('language.hindi')}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} disabled={saveProfile.isPending}>
                      {saveProfile.isPending ? t('common.loading') : t('profile.save')}
                    </Button>
                    <Button variant="outline" onClick={handleCancel} disabled={saveProfile.isPending}>
                      {t('profile.cancel')}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>{t('profile.edit')}</Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* PIN Change Section */}
          <PinChangeForm />
        </div>
      </main>
    </div>
  );
}
