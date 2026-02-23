import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile, PhotoMetadata, PhotoUploadRequest, BulkPhotoUploadRequest, VideoMetadata, VideoUploadRequest, Language, AggregateStorageSummary, StorageSummary } from '../backend';
import type { DocumentMetadata, DocumentUploadRequest, MemoryMetadata, MemoryUploadRequest, EditMemoryRequest } from '../types/frontend-types';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';
import { Principal } from '@icp-sdk/core/principal';

// Sync configuration
const SYNC_INTERVALS = {
  active: 10000,      // 10 seconds when user is active
  idle: 30000,        // 30 seconds when user is idle
  background: 60000,  // 60 seconds for background sync
  admin: 30000,       // 30 seconds for admin dashboard
};

// Storage limits (in bytes)
const STORAGE_LIMITS = {
  photos: 6_442_450_944,      // ~6 GB
  videos: 6_442_450_944,      // ~6 GB
  documents: 6_442_450_944,   // ~6 GB
  memories: 2_147_483_648,    // ~2 GB
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

// Admin Analytics Queries
export function useGetUniqueUserProfileCount() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<bigint>({
    queryKey: ['adminUserCount'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return await actor.getUniqueUserProfileCount();
    },
    enabled: !!actor && !actorFetching && !!identity,
    refetchInterval: SYNC_INTERVALS.admin,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useGetVirtualCanisterCount() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<bigint>({
    queryKey: ['adminCanisterCount'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return await actor.getVirtualCanisterCount();
    },
    enabled: !!actor && !actorFetching && !!identity,
    refetchInterval: SYNC_INTERVALS.admin,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useGetAggregateStorageSummary() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<AggregateStorageSummary>({
    queryKey: ['adminAggregateStorage'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return await actor.getAggregateStorageSummary();
    },
    enabled: !!actor && !actorFetching && !!identity,
    refetchInterval: SYNC_INTERVALS.admin,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useGetUserStorageSummary(principal: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<StorageSummary>({
    queryKey: ['adminUserStorage', principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) throw new Error('Actor or principal not available');
      return await actor.getUserStorageSummary(principal);
    },
    enabled: !!actor && !actorFetching && !!identity && !!principal,
    refetchInterval: SYNC_INTERVALS.admin,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

// Storage Metrics Query (for compatibility with existing components)
export function useGetStorageMetrics() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ['storageMetrics'],
    queryFn: async () => {
      if (!actor) {
        return {
          photos: {
            used: BigInt(0),
            limit: BigInt(STORAGE_LIMITS.photos),
            percentage: 0,
          },
          videos: {
            used: BigInt(0),
            limit: BigInt(STORAGE_LIMITS.videos),
            percentage: 0,
          },
          documents: {
            used: BigInt(0),
            limit: BigInt(STORAGE_LIMITS.documents),
            percentage: 0,
          },
          memories: {
            used: BigInt(0),
            limit: BigInt(STORAGE_LIMITS.memories),
            percentage: 0,
          },
          totalUsed: BigInt(0),
        };
      }
      
      const [photosUsed, videosUsed] = await Promise.all([
        actor.getPhotoStorageUsage(),
        actor.getVideoStorageUsage(),
      ]);

      const documentsUsed = BigInt(0);
      const memoriesUsed = BigInt(0);
      const totalUsed = photosUsed + videosUsed + documentsUsed + memoriesUsed;

      const photosPercentage = Number(photosUsed) / STORAGE_LIMITS.photos * 100;
      const videosPercentage = Number(videosUsed) / STORAGE_LIMITS.videos * 100;
      const documentsPercentage = Number(documentsUsed) / STORAGE_LIMITS.documents * 100;
      const memoriesPercentage = Number(memoriesUsed) / STORAGE_LIMITS.memories * 100;

      return {
        photos: {
          used: photosUsed,
          limit: BigInt(STORAGE_LIMITS.photos),
          percentage: photosPercentage,
        },
        videos: {
          used: videosUsed,
          limit: BigInt(STORAGE_LIMITS.videos),
          percentage: videosPercentage,
        },
        documents: {
          used: documentsUsed,
          limit: BigInt(STORAGE_LIMITS.documents),
          percentage: documentsPercentage,
        },
        memories: {
          used: memoriesUsed,
          limit: BigInt(STORAGE_LIMITS.memories),
          percentage: memoriesPercentage,
        },
        totalUsed,
      };
    },
    enabled: !!actor && !actorFetching && !!identity,
    refetchInterval: SYNC_INTERVALS.active,
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ currentPin, newPin }: { currentPin: string; newPin: string }) => {
      if (!actor) throw new Error('Actor not available');
      return await actor.changePin(currentPin, newPin);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useResetPin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ principalToUpdate, newPin }: { principalToUpdate: Principal; newPin: string }) => {
      if (!actor) throw new Error('Actor not available');
      return await actor.resetPin(principalToUpdate, newPin);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
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
      queryClient.invalidateQueries({ queryKey: ['adminAggregateStorage'] });
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
      queryClient.invalidateQueries({ queryKey: ['adminAggregateStorage'] });
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
      queryClient.invalidateQueries({ queryKey: ['adminAggregateStorage'] });
    },
    onError: (error: any) => {
      if (error.message?.includes('Unauthorized') || error.message?.includes('can only delete your own')) {
        toast.error('आप केवल अपनी फ़ोटो हटा सकते हैं');
      }
      if (error.message?.includes('Authentication required')) {
        toast.error('कृपया फिर से लॉगिन करें');
        queryClient.clear();
      }
    },
  });
}

export function useGetPhotoStorageUsage() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<bigint>({
    queryKey: ['photoStorageUsage'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return await actor.getPhotoStorageUsage();
    },
    enabled: !!actor && !actorFetching && !!identity,
    refetchInterval: SYNC_INTERVALS.active,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

// Video Queries
export function useGetVideos() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<VideoMetadata[]>({
    queryKey: ['videos', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];
      const response = await actor.getVideos();
      return response.videos;
    },
    enabled: !!actor && !actorFetching && !!identity,
    refetchInterval: SYNC_INTERVALS.active,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

// Alias for compatibility
export const useGetAllVideos = useGetVideos;

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
      queryClient.invalidateQueries({ queryKey: ['adminAggregateStorage'] });
    },
  });
}

export function useUploadMultipleVideos() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (videos: VideoUploadRequest[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadMultipleVideos({ videos });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos', identity?.getPrincipal().toString()] });
      queryClient.invalidateQueries({ queryKey: ['storageMetrics'] });
      queryClient.invalidateQueries({ queryKey: ['adminAggregateStorage'] });
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
      queryClient.invalidateQueries({ queryKey: ['adminAggregateStorage'] });
    },
  });
}

export function useGetVideoStorageUsage() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<bigint>({
    queryKey: ['videoStorageUsage'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return await actor.getVideoStorageUsage();
    },
    enabled: !!actor && !actorFetching && !!identity,
    refetchInterval: SYNC_INTERVALS.active,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

// Document Queries (Frontend-only placeholders)
export function useGetDocuments() {
  return useQuery<DocumentMetadata[]>({
    queryKey: ['documents'],
    queryFn: async () => [],
    enabled: false,
  });
}

// Alias for compatibility
export const useGetAllDocuments = useGetDocuments;

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_request: DocumentUploadRequest) => {
      throw new Error('Document upload not yet implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_documentId: bigint) => {
      throw new Error('Document deletion not yet implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

// Memory Queries (Frontend-only placeholders)
export function useGetMemories() {
  return useQuery<MemoryMetadata[]>({
    queryKey: ['memories'],
    queryFn: async () => [],
    enabled: false,
  });
}

// Alias for compatibility
export const useGetAllMemories = useGetMemories;

export function useCreateMemory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_request: MemoryUploadRequest) => {
      throw new Error('Memory creation not yet implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
    },
  });
}

export function useEditMemory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_request: EditMemoryRequest) => {
      throw new Error('Memory editing not yet implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
    },
  });
}

// Alias for compatibility
export const useUpdateMemory = useEditMemory;

export function useDeleteMemory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_memoryId: bigint) => {
      throw new Error('Memory deletion not yet implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
    },
  });
}
