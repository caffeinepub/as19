import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Text "mo:core/Text";
import AccessControl "authorization/access-control";
import List "mo:core/List";
import Storage "blob-storage/Storage";
import Iter "mo:core/Iter";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  // Role-based access control system as prefabricated component.
  let accessControlState = AccessControl.initState();

  public type Language = {
    #english;
    #hindi;
  };

  public type UserProfile = {
    name : Text;
    languagePreference : Language;
    profilePicture : ?Storage.ExternalBlob;
    pin : Text;
  };

  public type PhotoMetadata = {
    id : Nat;
    filename : Text;
    uploadDate : Time.Time;
    fileSize : Nat;
    contentType : Text;
    storageReference : Storage.ExternalBlob;
    owner : Principal;
  };

  public type DocumentMetadata = {
    id : Nat;
    filename : Text;
    uploadDate : Time.Time;
    fileSize : Nat;
    contentType : Text;
    storageReference : Storage.ExternalBlob;
    owner : Principal;
  };

  public type VideoMetadata = {
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

  public type MemoryMetadata = {
    id : Nat;
    title : Text;
    description : Text;
    createdDate : Time.Time;
    documentReference : ?Storage.ExternalBlob;
    owner : Principal;
  };

  public type MemoryUploadRequest = {
    title : Text;
    description : Text;
    documentReference : ?Storage.ExternalBlob;
  };

  public type EditMemoryRequest = {
    id : Nat;
    title : Text;
    description : Text;
    documentReference : ?Storage.ExternalBlob;
  };

  public type MemoriesResponse = {
    memories : [MemoryMetadata];
    message : Text;
  };

  public type PhotoUploadRequest = {
    filename : Text;
    contentType : Text;
    storageReference : Storage.ExternalBlob;
    fileSize : Nat;
  };

  public type BulkPhotoUploadRequest = {
    photos : [PhotoUploadRequest];
  };

  public type DocumentUploadRequest = {
    filename : Text;
    contentType : Text;
    storageReference : Storage.ExternalBlob;
    fileSize : Nat;
  };

  public type VideoUploadRequest = {
    filename : Text;
    contentType : Text;
    storageReference : Storage.ExternalBlob;
    fileSize : Nat;
    thumbnailReference : ?Storage.ExternalBlob;
    duration : ?Nat;
  };

  public type VideoUploadResponse = {
    videoId : Nat;
    message : Text;
  };

  public type BulkVideoUploadResponse = {
    successCount : Nat;
    videoIds : [Nat];
    errors : [Text];
    message : Text;
  };

  public type VideosResponse = {
    videos : [VideoMetadata];
    message : Text;
  };

  public type StorageSummary = {
    photosCount : Nat;
    photosSize : Nat;
    documentsCount : Nat;
    documentsSize : Nat;
    videosCount : Nat;
    videosSize : Nat;
    memoriesCount : Nat;
    memoriesSize : Nat;
  };

  public type AggregateStorageSummary = {
    totalPhotos : Nat;
    totalPhotosSize : Nat;
    totalDocuments : Nat;
    totalDocumentsSize : Nat;
    totalVideos : Nat;
    totalVideosSize : Nat;
    totalMemories : Nat;
    totalMemoriesSize : Nat;
  };

  var nextPhotoId = 0;
  var nextDocumentId = 0;
  var nextVideoId = 0;

  // 21.47 GB
  let multiCanisterTotalStorageLimit = 21_474_836_480;
  let photoStorageLimit = multiCanisterTotalStorageLimit / 100 * 30;
  let documentStorageLimit = multiCanisterTotalStorageLimit / 100 * 30;
  let videoStorageLimit = multiCanisterTotalStorageLimit / 100 * 30;

  let maxPhotoFileSize = 15_728_640; // 15 MB
  let maxDocumentFileSize = 52_428_800; // 50 MB
  let maxVideoFileSize = 104_857_600; // 100 MB
  let maxProfilePictureSize = 10_485_760; // 10 MB

  // Map initialization using explicit concrete types
  var userProfiles = Map.empty<Principal, UserProfile>();
  var photos = Map.empty<Nat, PhotoMetadata>();
  var documents = Map.empty<Nat, DocumentMetadata>();
  var videos = Map.empty<Nat, VideoMetadata>();

  // Mutable Variables to Track Counts
  var _virtualCanisterCount = 0; // To replace `virtualCanisterIdCounter`

  // Helper functions for access control
  func requireAuthentication(caller : Principal) {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Authentication required. Please log in.");
    };
  };

  func requireUser(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
  };

  func requireAdmin(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  // ADMIN-ONLY ANALYTICS METHODS
  public query ({ caller }) func getUniqueUserProfileCount() : async Nat {
    requireAdmin(caller);
    userProfiles.size();
  };

  // Method to get virtual canister count
  public query ({ caller }) func getVirtualCanisterCount() : async Nat {
    requireAdmin(caller);
    _virtualCanisterCount;
  };

  // Method to fetch storage summary for a specific user
  public query ({ caller }) func getUserStorageSummary(principal : Principal) : async StorageSummary {
    requireAdmin(caller);

    let photosCount = photos.values().toArray().filter(
      func(photo) {
        photo.owner == principal;
      }
    ).size();

    let photosSize = photos.values().toArray().filter(
      func(photo) { photo.owner == principal }
    ).foldLeft(
      0,
      func(acc, photo) { acc + photo.fileSize },
    );

    let documentsCount = documents.values().toArray().filter(
      func(document) { document.owner == principal }
    ).size();

    let documentsSize = documents.values().toArray().filter(
      func(document) { document.owner == principal }
    ).foldLeft(
      0,
      func(acc, document) { acc + document.fileSize },
    );

    let videosCount = videos.values().toArray().filter(
      func(video) { video.owner == principal }
    ).size();

    let videosSize = videos.values().toArray().filter(
      func(video) { video.owner == principal }
    ).foldLeft(
      0,
      func(acc, video) { acc + video.fileSize },
    );

    {
      photosCount;
      photosSize;
      documentsCount;
      documentsSize;
      videosCount;
      videosSize;
      memoriesCount = 0;
      memoriesSize = 0;
    };
  };

  // Aggregate Storage Summary for all files/books
  public query ({ caller }) func getAggregateStorageSummary() : async AggregateStorageSummary {
    requireAdmin(caller);

    let totalPhotos = photos.size();
    let totalPhotosSize = photos.values().toArray().foldLeft(
      0,
      func(acc, photo) { acc + photo.fileSize },
    );

    let totalDocuments = documents.size();
    let totalDocumentsSize = documents.values().toArray().foldLeft(
      0,
      func(acc, document) { acc + document.fileSize },
    );

    let totalVideos = videos.size();
    let totalVideosSize = videos.values().toArray().foldLeft(
      0,
      func(acc, video) { acc + video.fileSize },
    );

    {
      totalPhotos;
      totalPhotosSize;
      totalDocuments;
      totalDocumentsSize;
      totalVideos;
      totalVideosSize;
      totalMemories = 0;
      totalMemoriesSize = 0;
    };
  };

  // PUBLIC METHODS (rest of code unchanged)

  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    requireUser(caller);
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    requireUser(caller);
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    requireUser(caller);
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func updateProfilePicture(pictureReference : ?Storage.ExternalBlob) : async () {
    requireUser(caller);

    let existingProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile does not exist") };
      case (?p) { p };
    };

    let updatedProfile = {
      existingProfile with
      profilePicture = pictureReference;
    };

    userProfiles.add(caller, updatedProfile);
  };

  public shared ({ caller }) func verifyPin(pin : Text) : async Bool {
    requireUser(caller);

    switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) { profile.pin == pin };
    };
  };

  public shared ({ caller }) func changePin(currentPin : Text, newPin : Text) : async () {
    requireUser(caller);

    let currentProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("No user profile found. Please create a profile first.") };
      case (?profile) { profile };
    };

    if (currentProfile.pin != currentPin) {
      Runtime.trap("Current PIN is incorrect. Please try again.");
    };

    let updatedProfile = {
      currentProfile with
      pin = newPin;
    };
    userProfiles.add(caller, updatedProfile);
  };

  public shared ({ caller }) func resetPin(principalToUpdate : Principal, newPin : Text) : async () {
    requireUser(caller);

    if (caller != principalToUpdate) {
      Runtime.trap("Unauthorized: Cannot reset PIN for another user");
    };

    switch (userProfiles.get(principalToUpdate)) {
      case (null) { Runtime.trap("No profile found for the given principal") };
      case (?oldProfile) {
        let updatedProfile = {
          oldProfile with
          pin = newPin;
        };
        userProfiles.add(principalToUpdate, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getUserLanguagePreference() : async Language {
    requireUser(caller);
    switch (userProfiles.get(caller)) {
      case (?profile) { profile.languagePreference };
      case (null) { #hindi };
    };
  };

  public shared ({ caller }) func setUserLanguagePreference(language : Language) : async () {
    requireUser(caller);
    let existingProfile = switch (userProfiles.get(caller)) {
      case (null) {
        {
          name = "Default User";
          languagePreference = language;
          profilePicture = null;
          pin = "1234";
        };
      };
      case (?profile) {
        {
          profile with languagePreference = language;
        };
      };
    };
    userProfiles.add(caller, existingProfile);
  };

  public query ({ caller }) func getVideos() : async VideosResponse {
    requireUser(caller);

    let filteredVideos = videos.filter(
      func(_id, video) {
        Principal.equal(video.owner, caller);
      }
    );

    {
      videos = filteredVideos.values().toArray();
      message = "Videos retrieved successfully";
    };
  };

  public query ({ caller }) func getVideo(videoId : Nat) : async VideoMetadata {
    requireUser(caller);
    let video = switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?v) { v };
    };
    if (not Principal.equal(video.owner, caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: You can only access your own videos");
    };
    video;
  };

  public shared ({ caller }) func downloadVideo(_videoId : Nat) : async () {
    requireUser(caller);
  };

  public shared ({ caller }) func uploadVideo(request : VideoUploadRequest) : async VideoUploadResponse {
    requireAdmin(caller);

    if (request.fileSize > maxVideoFileSize) {
      Runtime.trap("File size exceeds 100 MB limit");
    };

    let newTotal = getTotalVideoSize() + request.fileSize;
    if (newTotal > videoStorageLimit) {
      Runtime.trap("Cannot upload video. Total size exceeds video storage limit");
    };

    let video : VideoMetadata = {
      id = nextVideoId;
      filename = request.filename;
      uploadDate = Time.now();
      fileSize = request.fileSize;
      contentType = request.contentType;
      storageReference = request.storageReference;
      thumbnailReference = request.thumbnailReference;
      duration = request.duration;
      owner = caller;
    };
    videos.add(nextVideoId, video);

    let videoId = nextVideoId;
    nextVideoId += 1;

    {
      videoId;
      message = "Video uploaded successfully";
    };
  };

  public shared ({ caller }) func uploadMultipleVideos(request : {
    videos : [VideoUploadRequest];
  }) : async BulkVideoUploadResponse {
    requireAdmin(caller);

    if (request.videos.isEmpty()) {
      Runtime.trap("No videos to be uploaded.");
    };

    var videoIdArray : [Nat] = [];

    for (video in request.videos.values()) {
      if (video.fileSize > maxVideoFileSize) {
        Runtime.trap("File size for " # video.filename # " exceeds 100 MB limit");
      };

      let newTotal = getTotalVideoSize() + video.fileSize;
      if (newTotal > videoStorageLimit) {
        Runtime.trap("Cannot upload " # video.filename # ". Total size exceeds video storage limit");
      };

      let videoMetadata : VideoMetadata = {
        id = nextVideoId;
        filename = video.filename;
        uploadDate = Time.now();
        fileSize = video.fileSize;
        contentType = video.contentType;
        storageReference = video.storageReference;
        thumbnailReference = video.thumbnailReference;
        duration = video.duration;
        owner = caller;
      };

      videos.add(nextVideoId, videoMetadata);
      videoIdArray := videoIdArray.concat([nextVideoId]);
      nextVideoId += 1;
    };

    {
      successCount = videoIdArray.size();
      videoIds = videoIdArray;
      errors = [];
      message = "All videos uploaded successfully";
    };
  };

  public shared ({ caller }) func deleteVideo(videoId : Nat) : async {
    message : Text;
  } {
    requireAdmin(caller);

    switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?_) {
        videos.remove(videoId);
        { message = "Video deleted successfully" };
      };
    };
  };

  public query ({ caller }) func getVideoStorageUsage() : async Nat {
    requireUser(caller);
    getTotalVideoSize();
  };

  func getTotalVideoSize() : Nat {
    var total = 0;
    for (entry in videos.entries()) {
      let video = entry.1;
      total += video.fileSize;
    };
    total;
  };

  public shared ({ caller }) func uploadPhoto(request : PhotoUploadRequest) : async Nat {
    requireUser(caller);

    if (request.fileSize > maxPhotoFileSize) {
      Runtime.trap("File size exceeds 15 MB limit");
    };

    let newTotal = getTotalPhotoSize() + request.fileSize;
    if (newTotal > photoStorageLimit) {
      Runtime.trap("Cannot upload photo. Total size exceeds photo storage limit");
    };

    let photo : PhotoMetadata = {
      id = nextPhotoId;
      filename = request.filename;
      uploadDate = Time.now();
      fileSize = request.fileSize;
      contentType = request.contentType;
      storageReference = request.storageReference;
      owner = caller;
    };
    photos.add(photo.id, photo);
    nextPhotoId += 1;
    photo.id;
  };

  public shared ({ caller }) func uploadMultiplePhotos(request : BulkPhotoUploadRequest) : async [Nat] {
    requireUser(caller);

    if (request.photos.isEmpty()) {
      Runtime.trap("No photos to be uploaded.");
    };

    var totalUploadSize = getTotalPhotoSize();
    var ids : [Nat] = [];

    for (photo in request.photos.values()) {
      if (photo.fileSize > maxPhotoFileSize) {
        Runtime.trap("File size for " # photo.filename # " exceeds 15MB limit");
      };

      if ((totalUploadSize + photo.fileSize) > photoStorageLimit) {
        Runtime.trap("Cannot upload " # photo.filename # ". Total size exceeds photo storage limit");
      };

      let photoMetadata : PhotoMetadata = {
        id = nextPhotoId;
        filename = photo.filename;
        uploadDate = Time.now();
        fileSize = photo.fileSize;
        contentType = photo.contentType;
        storageReference = photo.storageReference;
        owner = caller;
      };

      photos.add(nextPhotoId, photoMetadata);
      ids := ids.concat([nextPhotoId]);
      totalUploadSize += photo.fileSize;
      nextPhotoId += 1;
    };

    ids;
  };

  public query ({ caller }) func getPhotoMetadata(photoId : Nat) : async PhotoMetadata {
    requireUser(caller);
    let photo = switch (photos.get(photoId)) {
      case (null) { Runtime.trap("Photo not found") };
      case (?p) { p };
    };
    if (not Principal.equal(photo.owner, caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: You can only access your own photos");
    };
    photo;
  };

  public query ({ caller }) func getAllPhotos() : async [PhotoMetadata] {
    requireUser(caller);

    let filteredPhotos = photos.filter(
      func(_id, photo) {
        Principal.equal(photo.owner, caller);
      }
    );

    filteredPhotos.values().toArray();
  };

  public shared ({ caller }) func deletePhoto(photoId : Nat) : async () {
    requireUser(caller);

    let existingPhoto = switch (photos.get(photoId)) {
      case (null) { Runtime.trap("Photo not found") };
      case (?p) { p };
    };

    if (existingPhoto.owner != caller) {
      Runtime.trap("Unauthorized: You can only delete your own photos");
    };

    photos.remove(photoId);
  };

  public query ({ caller }) func getPhotoStorageUsage() : async Nat {
    requireUser(caller);
    getTotalPhotoSize();
  };

  func getTotalPhotoSize() : Nat {
    var total = 0;
    for (entry in photos.entries()) {
      let photo = entry.1;
      total += photo.fileSize;
    };
    total;
  };
};
