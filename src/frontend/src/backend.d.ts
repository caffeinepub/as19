import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface PhotoUploadRequest {
    storageReference: ExternalBlob;
    contentType: string;
    fileSize: bigint;
    filename: string;
}
export type Time = bigint;
export interface BulkVideoUploadResponse {
    errors: Array<string>;
    successCount: bigint;
    message: string;
    videoIds: Array<bigint>;
}
export interface PhotoMetadata {
    id: bigint;
    storageReference: ExternalBlob;
    contentType: string;
    owner: Principal;
    fileSize: bigint;
    filename: string;
    uploadDate: Time;
}
export interface BulkPhotoUploadRequest {
    photos: Array<PhotoUploadRequest>;
}
export interface VideoUploadResponse {
    message: string;
    videoId: bigint;
}
export interface VideoUploadRequest {
    storageReference: ExternalBlob;
    duration?: bigint;
    contentType: string;
    thumbnailReference?: ExternalBlob;
    fileSize: bigint;
    filename: string;
}
export interface VideoMetadata {
    id: bigint;
    storageReference: ExternalBlob;
    duration?: bigint;
    contentType: string;
    owner: Principal;
    thumbnailReference?: ExternalBlob;
    fileSize: bigint;
    filename: string;
    uploadDate: Time;
}
export interface UserProfile {
    pin: string;
    languagePreference: Language;
    name: string;
    profilePicture?: ExternalBlob;
}
export interface VideosResponse {
    message: string;
    videos: Array<VideoMetadata>;
}
export enum Language {
    hindi = "hindi",
    english = "english"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    changePin(currentPin: string, newPin: string): Promise<void>;
    deletePhoto(photoId: bigint): Promise<void>;
    deleteVideo(videoId: bigint): Promise<{
        message: string;
    }>;
    downloadVideo(_videoId: bigint): Promise<void>;
    getAllPhotos(): Promise<Array<PhotoMetadata>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPhotoMetadata(photoId: bigint): Promise<PhotoMetadata>;
    getPhotoStorageUsage(): Promise<bigint>;
    getUserLanguagePreference(): Promise<Language>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVideo(videoId: bigint): Promise<VideoMetadata>;
    getVideoStorageUsage(): Promise<bigint>;
    getVideos(): Promise<VideosResponse>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setUserLanguagePreference(language: Language): Promise<void>;
    updateProfilePicture(pictureReference: ExternalBlob | null): Promise<void>;
    uploadMultiplePhotos(request: BulkPhotoUploadRequest): Promise<Array<bigint>>;
    uploadMultipleVideos(request: {
        videos: Array<VideoUploadRequest>;
    }): Promise<BulkVideoUploadResponse>;
    uploadPhoto(request: PhotoUploadRequest): Promise<bigint>;
    uploadVideo(request: VideoUploadRequest): Promise<VideoUploadResponse>;
    verifyPin(pin: string): Promise<boolean>;
}
