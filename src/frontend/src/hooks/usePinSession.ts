import { useState, useCallback } from 'react';
import { useActor } from './useActor';
import { toast } from 'sonner';

export function usePinSession() {
  const { actor } = useActor();
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Check if PIN is verified in current session
  const isVerified = sessionStorage.getItem('pin_verified') === 'true';

  const verifyPin = useCallback(async (pin: string): Promise<boolean> => {
    if (!actor) {
      toast.error('Backend not available');
      return false;
    }

    setIsVerifying(true);
    try {
      const result = await actor.verifyPin(pin);
      if (result) {
        sessionStorage.setItem('pin_verified', 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error('PIN verification error:', error);
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [actor]);

  const clearSession = useCallback(() => {
    sessionStorage.removeItem('pin_verified');
  }, []);

  return {
    isVerified,
    verifyPin,
    clearSession,
    isVerifying,
  };
}
