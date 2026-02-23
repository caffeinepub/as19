import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import List "mo:core/List";
import Storage "blob-storage/Storage";

module {
  type Language = {
    #english;
    #hindi;
  };

  type UserProfile = {
    name : Text;
    languagePreference : Language;
    profilePicture : ?Storage.ExternalBlob;
    pin : Text;
  };

  type PhotoMetadata = {
    id : Nat;
    filename : Text;
    uploadDate : Time.Time;
    fileSize : Nat;
    contentType : Text;
    storageReference : Storage.ExternalBlob;
    owner : Principal;
  };

  type DocumentMetadata = {
    id : Nat;
    filename : Text;
    uploadDate : Time.Time;
    fileSize : Nat;
    contentType : Text;
    storageReference : Storage.ExternalBlob;
    owner : Principal;
  };

  type VideoMetadata = {
    id : Nat;
    filename : Text;
    uploadDate : Time.Time;
    fileSize : Nat;
    contentType : Text;
    storageReference : Storage.ExternalBlob;
    thumbnailReference : ?Storage.ExternalBlob;
    duration : ?Nat;
    owner : Principal;
  };

  type OldActor = {
    nextPhotoId : Nat;
    nextDocumentId : Nat;
    nextVideoId : Nat;
    userProfiles : Map.Map<Principal, UserProfile>;
    photos : Map.Map<Nat, PhotoMetadata>;
    documents : Map.Map<Nat, DocumentMetadata>;
    videos : Map.Map<Nat, VideoMetadata>;
  };

  type NewActor = {
    nextPhotoId : Nat;
    nextDocumentId : Nat;
    nextVideoId : Nat;
    userProfiles : Map.Map<Principal, UserProfile>;
    photos : Map.Map<Nat, PhotoMetadata>;
    documents : Map.Map<Nat, DocumentMetadata>;
    videos : Map.Map<Nat, VideoMetadata>;
    _virtualCanisterCount : Nat;
  };

  let _migrationVirtualCanisterCount : Nat = 0;

  public func run(old : OldActor) : NewActor {
    {
      old with
      _virtualCanisterCount = _migrationVirtualCanisterCount;
    };
  };
};
