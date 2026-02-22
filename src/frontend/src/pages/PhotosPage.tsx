import PhotoUpload from '../components/PhotoUpload';
import PhotoGallery from '../components/PhotoGallery';
import CreatedByBanner from '../components/CreatedByBanner';
import PinVerification from '../components/PinVerification';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { usePinSession } from '../hooks/usePinSession';

export default function PhotosPage() {
  const { data: isAdmin = false } = useIsCallerAdmin();
  const { isVerified } = usePinSession();

  if (!isVerified) {
    return <PinVerification />;
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {/* Created By Banner */}
      <CreatedByBanner />

      {/* Subtle rose petal background pattern overlay */}
      <div className="fixed inset-0 rose-petal-bg opacity-5 pointer-events-none z-0 w-full h-full" />

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-7xl w-full">
        <div className="space-y-8 w-full">
          {/* Photo Upload - Only visible to authenticated users */}
          <PhotoUpload isAdmin={isAdmin} />

          {/* Photo Gallery - Shows only user's own photos */}
          <PhotoGallery isAdmin={isAdmin} />
        </div>
      </main>
    </div>
  );
}
