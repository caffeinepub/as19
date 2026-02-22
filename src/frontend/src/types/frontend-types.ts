import type { Principal } from "@icp-sdk/core/principal";
import { ExternalBlob } from '../backend';

export type Time = bigint;

// Frontend-only types for Documents (backend not yet implemented)
export interface DocumentMetadata {
    id: bigint;
    filename: string;
    uploadDate: Time;
    fileSize: bigint;
    contentType: string;
    storageReference: ExternalBlob;
    owner: Principal;
}

export interface DocumentUploadRequest {
    filename: string;
    contentType: string;
    storageReference: ExternalBlob;
    fileSize: bigint;
}

// Frontend-only types for Memories (backend not yet implemented)
export interface MemoryMetadata {
    id: bigint;
    title: string;
    description: string;
    createdDate: Time;
    documentReference?: ExternalBlob;
    owner: Principal;
}

export interface MemoryUploadRequest {
    title: string;
    description: string;
    documentReference?: ExternalBlob;
}

export interface EditMemoryRequest {
    id: bigint;
    title: string;
    description: string;
    documentReference?: ExternalBlob;
}
