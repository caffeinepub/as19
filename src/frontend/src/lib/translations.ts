import { Language } from '../backend';

export type TranslationKey = 
  // Welcome Page
  | 'welcome.title'
  | 'welcome.subtitle'
  | 'welcome.description'
  | 'welcome.feature1.title'
  | 'welcome.feature1.desc'
  | 'welcome.feature2.title'
  | 'welcome.feature2.desc'
  | 'welcome.feature3.title'
  | 'welcome.feature3.desc'
  | 'welcome.loginButton'
  | 'welcome.loggingIn'
  | 'welcome.footer'
  // Language Selection
  | 'language.chooseLanguage'
  | 'language.selectPrompt'
  | 'language.english'
  | 'language.hindi'
  | 'language.continue'
  // Navigation
  | 'nav.memories'
  | 'nav.photos'
  | 'nav.videos'
  | 'nav.documents'
  | 'nav.profile'
  | 'nav.storage'
  | 'nav.greeting'
  | 'nav.logout'
  // Profile
  | 'profile.title'
  | 'profile.subtitle'
  | 'profile.personalInfo'
  | 'profile.personalInfoDesc'
  | 'profile.edit'
  | 'profile.cancel'
  | 'profile.save'
  | 'profile.name'
  | 'profile.email'
  | 'profile.emailOptional'
  | 'profile.language'
  | 'profile.languagePreference'
  | 'profile.notSet'
  | 'profile.emailNotSet'
  | 'profile.enterName'
  | 'profile.saveSuccess'
  | 'profile.saveError'
  | 'profile.profilePicture'
  | 'profile.profilePictureDesc'
  | 'profile.uploadPhoto'
  | 'profile.changePhoto'
  | 'profile.removePhoto'
  | 'profile.pictureFormats'
  | 'profile.pictureInvalidFormat'
  | 'profile.pictureTooLarge'
  | 'profile.pictureUploadSuccess'
  | 'profile.pictureUploadError'
  | 'profile.pictureRemoveSuccess'
  | 'profile.pictureRemoveError'
  // Profile Setup
  | 'profileSetup.welcome'
  | 'profileSetup.subtitle'
  | 'profileSetup.namePrompt'
  | 'profileSetup.namePlaceholder'
  | 'profileSetup.continue'
  | 'profileSetup.creating'
  | 'profileSetup.enterNameError'
  | 'profileSetup.successMessage'
  // PIN System
  | 'pin.setupTitle'
  | 'pin.setupInstructions'
  | 'pin.pinLabel'
  | 'pin.pinPlaceholder'
  | 'pin.confirmPinLabel'
  | 'pin.confirmPinPlaceholder'
  | 'pin.setupButton'
  | 'pin.setting'
  | 'pin.setupSuccess'
  | 'pin.lengthError'
  | 'pin.mismatchError'
  | 'pin.strengthGood'
  | 'pin.strengthWeak'
  | 'pin.pinsMatch'
  | 'pin.pinsNoMatch'
  | 'pin.verificationTitle'
  | 'pin.verificationInstructions'
  | 'pin.enterPinLabel'
  | 'pin.enterPinPlaceholder'
  | 'pin.verifyButton'
  | 'pin.verifying'
  | 'pin.invalidPinError'
  | 'pin.enterPinError'
  | 'pin.forgotPin'
  | 'pin.resetTitle'
  | 'pin.resetInstructions'
  | 'pin.reauthRequired'
  | 'pin.reauthButton'
  | 'pin.reauthenticating'
  | 'pin.reauthSuccess'
  | 'pin.reauthError'
  | 'pin.newPinLabel'
  | 'pin.newPinPlaceholder'
  | 'pin.confirmNewPinLabel'
  | 'pin.confirmNewPinPlaceholder'
  | 'pin.resetButton'
  | 'pin.resetting'
  | 'pin.resetSuccess'
  | 'pin.changeTitle'
  | 'pin.changeInstructions'
  | 'pin.currentPinLabel'
  | 'pin.currentPinPlaceholder'
  | 'pin.changeButton'
  | 'pin.changing'
  | 'pin.changeSuccess'
  | 'pin.currentPinIncorrect'
  | 'pin.enterCurrentPinError'
  | 'pin.foldersLocked'
  | 'pin.foldersUnlocked'
  | 'pin.sessionExpired'
  | 'pin.reenterPin'
  // Dashboard
  | 'dashboard.yourStories'
  | 'dashboard.createStory'
  | 'dashboard.searchPlaceholder'
  | 'dashboard.allTags'
  // Stories
  | 'stories.title'
  | 'stories.content'
  | 'stories.tags'
  | 'stories.addTag'
  | 'stories.edit'
  | 'stories.delete'
  | 'stories.save'
  | 'stories.cancel'
  | 'stories.creating'
  | 'stories.updating'
  | 'stories.noStories'
  | 'stories.noResults'
  | 'stories.createFirst'
  | 'stories.tryDifferent'
  // Storage
  | 'storage.title'
  | 'storage.used'
  | 'storage.of'
  | 'storage.photos'
  | 'storage.videos'
  | 'storage.documents'
  | 'storage.memories'
  | 'storage.total'
  | 'storage.warning'
  | 'storage.almostFull'
  // Photos
  | 'photos.title'
  | 'photos.upload'
  | 'photos.uploadMultiple'
  | 'photos.delete'
  | 'photos.download'
  | 'photos.downloadSelected'
  | 'photos.select'
  | 'photos.noPhotos'
  | 'photos.dragDrop'
  | 'photos.uploading'
  // Documents
  | 'documents.title'
  | 'documents.upload'
  | 'documents.delete'
  | 'documents.download'
  | 'documents.noDocuments'
  // Videos
  | 'videos.title'
  | 'videos.upload'
  | 'videos.delete'
  | 'videos.download'
  | 'videos.noVideos'
  // Common
  | 'common.loading'
  | 'common.error'
  | 'common.success'
  | 'common.close'
  | 'common.confirm'
  | 'common.yes'
  | 'common.no'
  | 'common.back';

const translations: Record<Language, Record<TranslationKey, string>> = {
  [Language.english]: {
    // Welcome Page
    'welcome.title': 'AS19',
    'welcome.subtitle': 'Built with Love',
    'welcome.description': 'A private space for your most precious memories, stories, and moments. Every word, every memory, preserved with love.',
    'welcome.feature1.title': 'Your Stories',
    'welcome.feature1.desc': 'Create and cherish beautiful memories',
    'welcome.feature2.title': 'Private & Secure',
    'welcome.feature2.desc': 'Your memories, securely encrypted',
    'welcome.feature3.title': 'Built with Love',
    'welcome.feature3.desc': 'Every detail crafted for you',
    'welcome.loginButton': 'Enter Your Space',
    'welcome.loggingIn': 'Logging in...',
    'welcome.footer': 'Built with love using',
    // Language Selection
    'language.chooseLanguage': 'Choose Your Language',
    'language.selectPrompt': 'Select your preferred language to continue',
    'language.english': 'English',
    'language.hindi': 'हिंदी',
    'language.continue': 'Continue',
    // Navigation
    'nav.memories': 'Memories',
    'nav.photos': 'Photos',
    'nav.videos': 'Videos',
    'nav.documents': 'Documents',
    'nav.profile': 'Profile',
    'nav.storage': 'Storage',
    'nav.greeting': 'Hello',
    'nav.logout': 'Logout',
    // Profile
    'profile.title': 'Your Profile',
    'profile.subtitle': 'Manage your personal information',
    'profile.personalInfo': 'Personal Information',
    'profile.personalInfoDesc': 'Update your name, email, and language preference',
    'profile.edit': 'Edit',
    'profile.cancel': 'Cancel',
    'profile.save': 'Save',
    'profile.name': 'Name',
    'profile.email': 'Email',
    'profile.emailOptional': 'Email (Optional)',
    'profile.language': 'Language',
    'profile.languagePreference': 'Language Preference',
    'profile.notSet': 'Not set',
    'profile.emailNotSet': 'Email not set',
    'profile.enterName': 'Enter your name',
    'profile.saveSuccess': 'Profile updated successfully',
    'profile.saveError': 'Error updating profile',
    'profile.profilePicture': 'Profile Picture',
    'profile.profilePictureDesc': 'Upload a photo to personalize your profile',
    'profile.uploadPhoto': 'Upload Photo',
    'profile.changePhoto': 'Change Photo',
    'profile.removePhoto': 'Remove Photo',
    'profile.pictureFormats': 'Supported formats: JPG, PNG, JPEG, WEBP (Max 10 MB)',
    'profile.pictureInvalidFormat': 'Invalid file format. Please upload JPG, PNG, JPEG, or WEBP.',
    'profile.pictureTooLarge': 'File size exceeds 10 MB limit.',
    'profile.pictureUploadSuccess': 'Profile picture uploaded successfully',
    'profile.pictureUploadError': 'Error uploading profile picture',
    'profile.pictureRemoveSuccess': 'Profile picture removed successfully',
    'profile.pictureRemoveError': 'Error removing profile picture',
    // Profile Setup
    'profileSetup.welcome': 'Welcome to AS19',
    'profileSetup.subtitle': "Let's personalize your private memory space",
    'profileSetup.namePrompt': 'What should we call you?',
    'profileSetup.namePlaceholder': 'Enter your name',
    'profileSetup.continue': 'Continue',
    'profileSetup.creating': 'Creating your space...',
    'profileSetup.enterNameError': 'Please enter your name',
    'profileSetup.successMessage': 'Welcome! Your space is ready.',
    // PIN System
    'pin.setupTitle': 'Secure Your Folders',
    'pin.setupInstructions': 'Create a 4-6 digit PIN to protect your private content',
    'pin.pinLabel': 'Create PIN',
    'pin.pinPlaceholder': 'Enter 4-6 digits',
    'pin.confirmPinLabel': 'Confirm PIN',
    'pin.confirmPinPlaceholder': 'Re-enter PIN',
    'pin.setupButton': 'Set PIN',
    'pin.setting': 'Setting PIN...',
    'pin.setupSuccess': 'PIN created successfully',
    'pin.lengthError': 'PIN must be 4-6 digits',
    'pin.mismatchError': 'PINs do not match',
    'pin.strengthGood': 'PIN is valid',
    'pin.strengthWeak': 'PIN must be 4-6 digits',
    'pin.pinsMatch': 'PINs match',
    'pin.pinsNoMatch': 'PINs do not match',
    'pin.verificationTitle': 'Enter PIN',
    'pin.verificationInstructions': 'Enter your PIN to access protected folders',
    'pin.enterPinLabel': 'Enter PIN',
    'pin.enterPinPlaceholder': 'Enter your PIN',
    'pin.verifyButton': 'Unlock',
    'pin.verifying': 'Verifying...',
    'pin.invalidPinError': 'Incorrect PIN. Please try again.',
    'pin.enterPinError': 'Please enter your PIN',
    'pin.forgotPin': 'Forgot PIN?',
    'pin.resetTitle': 'Reset PIN',
    'pin.resetInstructions': 'Verify your identity to reset your PIN',
    'pin.reauthRequired': 'For security, please re-authenticate to reset your PIN',
    'pin.reauthButton': 'Re-authenticate',
    'pin.reauthenticating': 'Authenticating...',
    'pin.reauthSuccess': 'Authentication successful',
    'pin.reauthError': 'Authentication failed',
    'pin.newPinLabel': 'New PIN',
    'pin.newPinPlaceholder': 'Enter new PIN',
    'pin.confirmNewPinLabel': 'Confirm New PIN',
    'pin.confirmNewPinPlaceholder': 'Re-enter new PIN',
    'pin.resetButton': 'Reset PIN',
    'pin.resetting': 'Resetting...',
    'pin.resetSuccess': 'PIN reset successfully',
    'pin.changeTitle': 'Change PIN',
    'pin.changeInstructions': 'Update your PIN to keep your folders secure',
    'pin.currentPinLabel': 'Current PIN',
    'pin.currentPinPlaceholder': 'Enter current PIN',
    'pin.changeButton': 'Change PIN',
    'pin.changing': 'Changing...',
    'pin.changeSuccess': 'PIN changed successfully',
    'pin.currentPinIncorrect': 'Current PIN is incorrect',
    'pin.enterCurrentPinError': 'Please enter your current PIN',
    'pin.foldersLocked': 'Folders Locked',
    'pin.foldersUnlocked': 'Folders Unlocked',
    'pin.sessionExpired': 'Session expired',
    'pin.reenterPin': 'Please re-enter PIN',
    // Dashboard
    'dashboard.yourStories': 'Your Stories',
    'dashboard.createStory': 'Create New Story',
    'dashboard.searchPlaceholder': 'Search stories...',
    'dashboard.allTags': 'All Tags',
    // Stories
    'stories.title': 'Title',
    'stories.content': 'Content',
    'stories.tags': 'Tags',
    'stories.addTag': 'Add Tag',
    'stories.edit': 'Edit',
    'stories.delete': 'Delete',
    'stories.save': 'Save',
    'stories.cancel': 'Cancel',
    'stories.creating': 'Creating...',
    'stories.updating': 'Updating...',
    'stories.noStories': 'No stories yet',
    'stories.noResults': 'No stories found',
    'stories.createFirst': 'Create your first memory',
    'stories.tryDifferent': 'Try a different search or tag',
    // Storage
    'storage.title': 'Storage Dashboard',
    'storage.used': 'Used',
    'storage.of': 'of',
    'storage.photos': 'Photos',
    'storage.videos': 'Videos',
    'storage.documents': 'Documents',
    'storage.memories': 'Memories',
    'storage.total': 'Total Storage',
    'storage.warning': 'Warning',
    'storage.almostFull': 'Storage almost full',
    // Photos
    'photos.title': 'Photos',
    'photos.upload': 'Upload Photo',
    'photos.uploadMultiple': 'Upload Multiple',
    'photos.delete': 'Delete',
    'photos.download': 'Download',
    'photos.downloadSelected': 'Download Selected',
    'photos.select': 'Select',
    'photos.noPhotos': 'No photos yet',
    'photos.dragDrop': 'Drag and drop or click to upload',
    'photos.uploading': 'Uploading...',
    // Documents
    'documents.title': 'Documents',
    'documents.upload': 'Upload Document',
    'documents.delete': 'Delete',
    'documents.download': 'Download',
    'documents.noDocuments': 'No documents yet',
    // Videos
    'videos.title': 'Videos',
    'videos.upload': 'Upload Video',
    'videos.delete': 'Delete',
    'videos.download': 'Download',
    'videos.noVideos': 'No videos yet',
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.close': 'Close',
    'common.confirm': 'Confirm',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.back': 'Back',
  },
  [Language.hindi]: {
    // Welcome Page
    'welcome.title': 'AS19',
    'welcome.subtitle': 'प्यार से बनाया गया',
    'welcome.description': 'आपकी सबसे कीमती यादों, कहानियों और पलों के लिए एक निजी स्थान। हर शब्द, हर याद, प्यार से संरक्षित।',
    'welcome.feature1.title': 'आपकी कहानियाँ',
    'welcome.feature1.desc': 'सुंदर यादें बनाएं और संजोएं',
    'welcome.feature2.title': 'निजी और सुरक्षित',
    'welcome.feature2.desc': 'आपकी यादें, सुरक्षित रूप से एन्क्रिप्टेड',
    'welcome.feature3.title': 'प्यार से बनाया गया',
    'welcome.feature3.desc': 'हर विवरण आपके लिए तैयार किया गया',
    'welcome.loginButton': 'अपने स्थान में प्रवेश करें',
    'welcome.loggingIn': 'लॉगिन हो रहा है...',
    'welcome.footer': 'प्यार से बनाया गया',
    // Language Selection
    'language.chooseLanguage': 'अपनी भाषा चुनें',
    'language.selectPrompt': 'जारी रखने के लिए अपनी पसंदीदा भाषा चुनें',
    'language.english': 'English',
    'language.hindi': 'हिंदी',
    'language.continue': 'जारी रखें',
    // Navigation
    'nav.memories': 'यादें',
    'nav.photos': 'फ़ोटो',
    'nav.videos': 'वीडियो',
    'nav.documents': 'दस्तावेज़',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.storage': 'स्टोरेज',
    'nav.greeting': 'नमस्ते',
    'nav.logout': 'लॉगआउट',
    // Profile
    'profile.title': 'आपकी प्रोफ़ाइल',
    'profile.subtitle': 'अपनी व्यक्तिगत जानकारी प्रबंधित करें',
    'profile.personalInfo': 'व्यक्तिगत जानकारी',
    'profile.personalInfoDesc': 'अपना नाम, ईमेल और भाषा प्राथमिकता अपडेट करें',
    'profile.edit': 'संपादित करें',
    'profile.cancel': 'रद्द करें',
    'profile.save': 'सहेजें',
    'profile.name': 'नाम',
    'profile.email': 'ईमेल',
    'profile.emailOptional': 'ईमेल (वैकल्पिक)',
    'profile.language': 'भाषा',
    'profile.languagePreference': 'भाषा प्राथमिकता',
    'profile.notSet': 'सेट नहीं है',
    'profile.emailNotSet': 'ईमेल सेट नहीं है',
    'profile.enterName': 'अपना नाम दर्ज करें',
    'profile.saveSuccess': 'प्रोफ़ाइल सफलतापूर्वक अपडेट की गई',
    'profile.saveError': 'प्रोफ़ाइल अपडेट करने में त्रुटि',
    'profile.profilePicture': 'प्रोफ़ाइल चित्र',
    'profile.profilePictureDesc': 'अपनी प्रोफ़ाइल को व्यक्तिगत बनाने के लिए एक फ़ोटो अपलोड करें',
    'profile.uploadPhoto': 'फ़ोटो अपलोड करें',
    'profile.changePhoto': 'फ़ोटो बदलें',
    'profile.removePhoto': 'फ़ोटो हटाएं',
    'profile.pictureFormats': 'समर्थित प्रारूप: JPG, PNG, JPEG, WEBP (अधिकतम 10 MB)',
    'profile.pictureInvalidFormat': 'अमान्य फ़ाइल प्रारूप। कृपया JPG, PNG, JPEG, या WEBP अपलोड करें।',
    'profile.pictureTooLarge': 'फ़ाइल का आकार 10 MB की सीमा से अधिक है।',
    'profile.pictureUploadSuccess': 'प्रोफ़ाइल चित्र सफलतापूर्वक अपलोड किया गया',
    'profile.pictureUploadError': 'प्रोफ़ाइल चित्र अपलोड करने में त्रुटि',
    'profile.pictureRemoveSuccess': 'प्रोफ़ाइल चित्र सफलतापूर्वक हटाया गया',
    'profile.pictureRemoveError': 'प्रोफ़ाइल चित्र हटाने में त्रुटि',
    // Profile Setup
    'profileSetup.welcome': 'AS19 में आपका स्वागत है',
    'profileSetup.subtitle': 'आइए अपने निजी स्मृति स्थान को व्यक्तिगत बनाएं',
    'profileSetup.namePrompt': 'हम आपको क्या कहें?',
    'profileSetup.namePlaceholder': 'अपना नाम दर्ज करें',
    'profileSetup.continue': 'जारी रखें',
    'profileSetup.creating': 'आपका स्थान बनाया जा रहा है...',
    'profileSetup.enterNameError': 'कृपया अपना नाम दर्ज करें',
    'profileSetup.successMessage': 'स्वागत है! आपका स्थान तैयार है।',
    // PIN System
    'pin.setupTitle': 'अपने फ़ोल्डर सुरक्षित करें',
    'pin.setupInstructions': 'अपनी निजी सामग्री की सुरक्षा के लिए 4-6 अंकों का पिन बनाएं',
    'pin.pinLabel': 'पिन बनाएं',
    'pin.pinPlaceholder': '4-6 अंक दर्ज करें',
    'pin.confirmPinLabel': 'पिन की पुष्टि करें',
    'pin.confirmPinPlaceholder': 'पिन फिर से दर्ज करें',
    'pin.setupButton': 'पिन सेट करें',
    'pin.setting': 'पिन सेट हो रहा है...',
    'pin.setupSuccess': 'पिन सफलतापूर्वक बनाया गया',
    'pin.lengthError': 'पिन 4-6 अंकों का होना चाहिए',
    'pin.mismatchError': 'पिन मेल नहीं खाते',
    'pin.strengthGood': 'पिन मान्य है',
    'pin.strengthWeak': 'पिन 4-6 अंकों का होना चाहिए',
    'pin.pinsMatch': 'पिन मेल खाते हैं',
    'pin.pinsNoMatch': 'पिन मेल नहीं खाते',
    'pin.verificationTitle': 'पिन दर्ज करें',
    'pin.verificationInstructions': 'सुरक्षित फ़ोल्डर तक पहुंचने के लिए अपना पिन दर्ज करें',
    'pin.enterPinLabel': 'पिन दर्ज करें',
    'pin.enterPinPlaceholder': 'अपना पिन दर्ज करें',
    'pin.verifyButton': 'अनलॉक करें',
    'pin.verifying': 'सत्यापित हो रहा है...',
    'pin.invalidPinError': 'गलत पिन। कृपया पुनः प्रयास करें।',
    'pin.enterPinError': 'कृपया अपना पिन दर्ज करें',
    'pin.forgotPin': 'पिन भूल गए?',
    'pin.resetTitle': 'पिन रीसेट करें',
    'pin.resetInstructions': 'अपना पिन रीसेट करने के लिए अपनी पहचान सत्यापित करें',
    'pin.reauthRequired': 'सुरक्षा के लिए, कृपया अपना पिन रीसेट करने के लिए पुनः प्रमाणित करें',
    'pin.reauthButton': 'पुनः प्रमाणित करें',
    'pin.reauthenticating': 'प्रमाणित हो रहा है...',
    'pin.reauthSuccess': 'प्रमाणीकरण सफल',
    'pin.reauthError': 'प्रमाणीकरण विफल',
    'pin.newPinLabel': 'नया पिन',
    'pin.newPinPlaceholder': 'नया पिन दर्ज करें',
    'pin.confirmNewPinLabel': 'नए पिन की पुष्टि करें',
    'pin.confirmNewPinPlaceholder': 'नया पिन फिर से दर्ज करें',
    'pin.resetButton': 'पिन रीसेट करें',
    'pin.resetting': 'रीसेट हो रहा है...',
    'pin.resetSuccess': 'पिन सफलतापूर्वक रीसेट किया गया',
    'pin.changeTitle': 'पिन बदलें',
    'pin.changeInstructions': 'अपने फ़ोल्डर को सुरक्षित रखने के लिए अपना पिन अपडेट करें',
    'pin.currentPinLabel': 'वर्तमान पिन',
    'pin.currentPinPlaceholder': 'वर्तमान पिन दर्ज करें',
    'pin.changeButton': 'पिन बदलें',
    'pin.changing': 'बदला जा रहा है...',
    'pin.changeSuccess': 'पिन सफलतापूर्वक बदला गया',
    'pin.currentPinIncorrect': 'वर्तमान पिन गलत है',
    'pin.enterCurrentPinError': 'कृपया अपना वर्तमान पिन दर्ज करें',
    'pin.foldersLocked': 'फ़ोल्डर लॉक हैं',
    'pin.foldersUnlocked': 'फ़ोल्डर अनलॉक हैं',
    'pin.sessionExpired': 'सत्र समाप्त हो गया',
    'pin.reenterPin': 'कृपया पिन फिर से दर्ज करें',
    // Dashboard
    'dashboard.yourStories': 'आपकी कहानियाँ',
    'dashboard.createStory': 'नई कहानी बनाएं',
    'dashboard.searchPlaceholder': 'कहानियाँ खोजें...',
    'dashboard.allTags': 'सभी टैग',
    // Stories
    'stories.title': 'शीर्षक',
    'stories.content': 'सामग्री',
    'stories.tags': 'टैग',
    'stories.addTag': 'टैग जोड़ें',
    'stories.edit': 'संपादित करें',
    'stories.delete': 'हटाएं',
    'stories.save': 'सहेजें',
    'stories.cancel': 'रद्द करें',
    'stories.creating': 'बनाया जा रहा है...',
    'stories.updating': 'अपडेट हो रहा है...',
    'stories.noStories': 'अभी तक कोई कहानी नहीं',
    'stories.noResults': 'कोई कहानी नहीं मिली',
    'stories.createFirst': 'अपनी पहली याद बनाएं',
    'stories.tryDifferent': 'एक अलग खोज या टैग आज़माएं',
    // Storage
    'storage.title': 'स्टोरेज डैशबोर्ड',
    'storage.used': 'उपयोग किया गया',
    'storage.of': 'का',
    'storage.photos': 'फ़ोटो',
    'storage.videos': 'वीडियो',
    'storage.documents': 'दस्तावेज़',
    'storage.memories': 'यादें',
    'storage.total': 'कुल स्टोरेज',
    'storage.warning': 'चेतावनी',
    'storage.almostFull': 'स्टोरेज लगभग भर गया है',
    // Photos
    'photos.title': 'फ़ोटो',
    'photos.upload': 'फ़ोटो अपलोड करें',
    'photos.uploadMultiple': 'एकाधिक अपलोड करें',
    'photos.delete': 'हटाएं',
    'photos.download': 'डाउनलोड करें',
    'photos.downloadSelected': 'चयनित डाउनलोड करें',
    'photos.select': 'चुनें',
    'photos.noPhotos': 'अभी तक कोई फ़ोटो नहीं',
    'photos.dragDrop': 'अपलोड करने के लिए खींचें और छोड़ें या क्लिक करें',
    'photos.uploading': 'अपलोड हो रहा है...',
    // Documents
    'documents.title': 'दस्तावेज़',
    'documents.upload': 'दस्तावेज़ अपलोड करें',
    'documents.delete': 'हटाएं',
    'documents.download': 'डाउनलोड करें',
    'documents.noDocuments': 'अभी तक कोई दस्तावेज़ नहीं',
    // Videos
    'videos.title': 'वीडियो',
    'videos.upload': 'वीडियो अपलोड करें',
    'videos.delete': 'हटाएं',
    'videos.download': 'डाउनलोड करें',
    'videos.noVideos': 'अभी तक कोई वीडियो नहीं',
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.close': 'बंद करें',
    'common.confirm': 'पुष्टि करें',
    'common.yes': 'हाँ',
    'common.no': 'नहीं',
    'common.back': 'वापस',
  },
};

export function useTranslations(language: Language) {
  return (key: TranslationKey): string => {
    return translations[language][key] || key;
  };
}
