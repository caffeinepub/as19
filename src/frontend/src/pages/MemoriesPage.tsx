import StoryEditor from '../components/StoryEditor';
import StoryList from '../components/StoryList';
import MemoriesStorageMonitor from '../components/MemoriesStorageMonitor';
import CreatedByBanner from '../components/CreatedByBanner';
import PinVerification from '../components/PinVerification';
import { usePinSession } from '../hooks/usePinSession';

interface MemoriesPageProps {
  isAdmin: boolean;
}

export default function MemoriesPage({ isAdmin }: MemoriesPageProps) {
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
          {/* Story Editor - Admin only */}
          {isAdmin && <StoryEditor />}

          {/* Story List - All authenticated users */}
          <StoryList isAdmin={isAdmin} />

          {/* Storage Monitor */}
          <MemoriesStorageMonitor />
        </div>
      </main>
    </div>
  );
}
