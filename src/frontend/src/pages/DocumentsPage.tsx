import DocumentUpload from '../components/DocumentUpload';
import DocumentGallery from '../components/DocumentGallery';
import CreatedByBanner from '../components/CreatedByBanner';
import PinVerification from '../components/PinVerification';
import { usePinSession } from '../hooks/usePinSession';

interface DocumentsPageProps {
  isAdmin: boolean;
}

export default function DocumentsPage({ isAdmin }: DocumentsPageProps) {
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
          {/* Document Upload - Admin only */}
          {isAdmin && <DocumentUpload />}

          {/* Document Gallery - All authenticated users */}
          <DocumentGallery isAdmin={isAdmin} />
        </div>
      </main>
    </div>
  );
}
