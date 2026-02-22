import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile, PhotoMetadata, PhotoUploadRequest, BulkPhotoUploadRequest, VideoMetadata, VideoUploadRequest, Language } from '../backend';
import type { DocumentMetadata, DocumentUploadRequest, MemoryMetadata, MemoryUploadRequest, EditMemoryRequest } from '../types/frontend-types';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';

// Sync configuration
const SYNC_INTERVALS = {
  active: 10000,      // 10 seconds when user is active
  idle: 30000,        // 30 seconds when user is idle
  background: 60000,  // 60 seconds for background sync
};

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return await actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
    refetchInterval: SYNC_INTERVALS.background,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['userLanguagePreference'] });
    },
  });
}

export function useUpdateProfilePicture() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pictureReference: ExternalBlob | null) => {
      if (!actor) throw new Error('Actor not available');
      return await actor.updateProfilePicture(pictureReference);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetUserLanguagePreference() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Language>({
    queryKey: ['userLanguagePreference'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return await actor.getUserLanguagePreference();
    },
    enabled: !!actor && !actorFetching && !!identity,
    refetchInterval: SYNC_INTERVALS.background,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useSetUserLanguagePreference() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (language: Language) => {
      if (!actor) throw new Error('Actor not available');
      return await actor.setUserLanguagePreference(language);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userLanguagePreference'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return await actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching && !!identity,
    refetchInterval: SYNC_INTERVALS.background,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

// PIN Management Queries
export function useVerifyPin() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (pin: string) => {
      if (!actor) throw new Error('Actor not available');
      return await actor.verifyPin(pin);
    },
  });
}

export function useChangePin() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ currentPin, newPin }: { currentPin: string; newPin: string }) => {
      if (!actor) throw new Error('Actor not available');
      return await actor.changePin(currentPin, newPin);
    },
  });
}

// Photo Queries with Real-Time Sync and Authorization Error Handling
export function useGetAllPhotos() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useQuery<PhotoMetadata[]>({
    queryKey: ['photos', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllPhotos();
      } catch (error: any) {
        // Handle authorization errors gracefully
        if (error.message?.includes('Unauthorized') || error.message?.includes('Authentication required')) {
          toast.error('कृपया फिर से लॉगिन करें');
          queryClient.clear();
          return [];
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching && !!identity,
    refetchInterval: SYNC_INTERVALS.active,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 5000,
  });
}

export function useGetPhotoMetadata(photoId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useQuery<PhotoMetadata | null>({
    queryKey: ['photo', photoId?.toString(), identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !photoId) return null;
      try {
        return await actor.getPhotoMetadata(photoId);
      } catch (error: any) {
        // Handle authorization errors gracefully
        if (error.message?.includes('Unauthorized') || error.message?.includes('can only access your own')) {
          toast.error('आप केवल अपनी फ़ोटो देख सकते हैं');
          return null;
        }
        if (error.message?.includes('Authentication required')) {
          toast.error('कृपया फिर से लॉगिन करें');
          queryClient.clear();
          return null;
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching && photoId !== null && !!identity,
    refetchInterval: SYNC_INTERVALS.active,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

// Photo Mutations
export function useUploadPhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (request: PhotoUploadRequest) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadPhoto(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos', identity?.getPrincipal().toString()] });
      queryClient.invalidateQueries({ queryKey: ['storageMetrics'] });
    },
    onError: (error: any) => {
      if (error.message?.includes('Unauthorized') || error.message?.includes('Authentication required')) {
        toast.error('कृपया फिर से लॉगिन करें');
        queryClient.clear();
      }
    },
  });
}

export function useUploadMultiplePhotos() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (request: BulkPhotoUploadRequest) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadMultiplePhotos(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos', identity?.getPrincipal().toString()] });
      queryClient.invalidateQueries({ queryKey: ['storageMetrics'] });
    },
    onError: (error: any) => {
      if (error.message?.includes('Unauthorized') || error.message?.includes('Authentication required')) {
        toast.error('कृपया फिर से लॉगिन करें');
        queryClient.clear();
      }
    },
  });
}

export function useDeletePhoto() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (photoId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deletePhoto(photoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos', identity?.getPrincipal().toString()] });
      queryClient.invalidateQueries({ queryKey: ['storageMetrics'] });
    },
    onError: (error: any) => {
      if (error.message?.includes('Unauthorized') || error.message?.includes('can only delete your own')) {
        toast.error('आप केवल अपनी फ़ोटो डिलीट कर सकते हैं');
      } else if (error.message?.includes('Authentication required')) {
        toast.error('कृपया फिर से लॉगिन करें');
        queryClient.clear();
      }
    },
  });
}

// Video Queries with Real-Time Sync and Authorization Error Handling
export function useGetAllVideos() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useQuery<VideoMetadata[]>({
    queryKey: ['videos', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const response = await actor.getVideos();
        return response.videos;
      } catch (error: any) {
        // Handle authorization errors gracefully
        if (error.message?.includes('Unauthorized') || error.message?.includes('Authentication required')) {
          toast.error('कृपया फिर से लॉगिन करें');
          queryClient.clear();
          return [];
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching && !!identity,
    refetchInterval: SYNC_INTERVALS.active,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 5000,
  });
}

export function useGetVideoMetadata(videoId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useQuery<VideoMetadata | null>({
    queryKey: ['video', videoId?.toString(), identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !videoId) return null;
      try {
        return await actor.getVideo(videoId);
      } catch (error: any) {
        // Handle authorization errors gracefully
        if (error.message?.includes('Unauthorized') || error.message?.includes('can only access your own')) {
          toast.error('आप केवल अपने वीडियो देख सकते हैं');
          return null;
        }
        if (error.message?.includes('Authentication required')) {
          toast.error('कृपया फिर से लॉगिन करें');
          queryClient.clear();
          return null;
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching && videoId !== null && !!identity,
    refetchInterval: SYNC_INTERVALS.active,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

// Video Mutations
export function useUploadVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (request: VideoUploadRequest) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadVideo(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos', identity?.getPrincipal().toString()] });
      queryClient.invalidateQueries({ queryKey: ['storageMetrics'] });
    },
    onError: (error: any) => {
      if (error.message?.includes('Unauthorized') || error.message?.includes('Admin access required')) {
        toast.error('केवल एडमिन वीडियो अपलोड कर सकते हैं');
      } else if (error.message?.includes('Authentication required')) {
        toast.error('कृपया फिर से लॉगिन करें');
        queryClient.clear();
      }
    },
  });
}

export function useDeleteVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (videoId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteVideo(videoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos', identity?.getPrincipal().toString()] });
      queryClient.invalidateQueries({ queryKey: ['storageMetrics'] });
    },
    onError: (error: any) => {
      if (error.message?.includes('Unauthorized') || error.message?.includes('Admin access required')) {
        toast.error('केवल एडमिन वीडियो डिलीट कर सकते हैं');
      } else if (error.message?.includes('Authentication required')) {
        toast.error('कृपया फिर से लॉगिन करें');
        queryClient.clear();
      }
    },
  });
}

// Document Queries (placeholder - backend not implemented yet)
export function useGetAllDocuments() {
  const { identity } = useInternetIdentity();

  return useQuery<DocumentMetadata[]>({
    queryKey: ['documents'],
    queryFn: async () => {
      // Backend not implemented yet
      return [];
    },
    enabled: !!identity,
  });
}

// Document Mutations (placeholder - backend not implemented yet)
export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: DocumentUploadRequest) => {
      throw new Error('Document upload not yet implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['storageMetrics'] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: bigint) => {
      throw new Error('Document deletion not yet implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['storageMetrics'] });
    },
  });
}

// Memory Queries (placeholder - backend not implemented yet)
export function useGetAllMemories() {
  const { identity } = useInternetIdentity();

  return useQuery<MemoryMetadata[]>({
    queryKey: ['memories'],
    queryFn: async () => {
      // Backend not implemented yet
      return [];
    },
    enabled: !!identity,
  });
}

// Memory Mutations (placeholder - backend not implemented yet)
export function useCreateMemory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: MemoryUploadRequest) => {
      throw new Error('Memory creation not yet implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
      queryClient.invalidateQueries({ queryKey: ['storageMetrics'] });
    },
  });
}

export function useUpdateMemory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: EditMemoryRequest) => {
      throw new Error('Memory update not yet implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
    },
  });
}

export function useDeleteMemory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memoryId: bigint) => {
      throw new Error('Memory deletion not yet implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
      queryClient.invalidateQueries({ queryKey: ['storageMetrics'] });
    },
  });
}

// Storage Metrics Query with Real-Time Sync
export function useGetStorageMetrics() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ['storageMetrics'],
    queryFn: async () => {
      if (!actor) return null;
      
      // Calculate storage metrics from photos and videos (documents and memories not yet implemented)
      const photoUsage = await actor.getPhotoStorageUsage();
      const videoUsage = await actor.getVideoStorageUsage();
      
      // Storage allocations (in bytes) - 30% each for 4 categories = ~6.44 GB each
      const categoryLimit = BigInt(Math.floor(21474836480 * 0.30)); // 30% of 21.47 GB
      
      return {
        photos: {
          used: photoUsage,
          limit: categoryLimit,
          percentage: Number(photoUsage) / Number(categoryLimit) * 100,
        },
        videos: {
          used: videoUsage,
          limit: categoryLimit,
          percentage: Number(videoUsage) / Number(categoryLimit) * 100,
        },
        documents: {
          used: BigInt(0),
          limit: categoryLimit,
          percentage: 0,
        },
        memories: {
          used: BigInt(0),
          limit: categoryLimit,
          percentage: 0,
        },
      };
    },
    enabled: !!actor && !actorFetching && !!identity,
    refetchInterval: SYNC_INTERVALS.idle,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 10000,
  });
}
