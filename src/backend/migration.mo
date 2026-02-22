import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type OldUserProfile = {
    name : Text;
    languagePreference : {
      #english;
      #hindi;
    };
    profilePicture : ?Storage.ExternalBlob;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  type NewUserProfile = {
    name : Text;
    languagePreference : {
      #english;
      #hindi;
    };
    profilePicture : ?Storage.ExternalBlob;
    pin : Text; // New PIN field
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_principal, oldUserProfile) {
        {
          oldUserProfile with
          pin = ""; // Set to empty PIN for existing users
        };
      }
    );
    { userProfiles = newUserProfiles };
  };
};
