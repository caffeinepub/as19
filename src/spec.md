# Specification

## Summary
**Goal:** Add PIN-based folder access control with setup, verification, change, and forgot PIN functionality to secure Photos, Videos, Documents, and Memories sections.

**Planned changes:**
- Add PIN field to backend user profile with secure hashing
- Create PIN setup screen during account creation requiring 4-6 digit PIN with confirmation
- Implement PIN verification screen that blocks folder access until correct PIN entered
- Add backend PIN verification endpoint with rate limiting
- Create forgot PIN flow using identity re-verification
- Add Change PIN option in Profile settings requiring current PIN verification
- Implement session-based PIN authentication to avoid re-entry during active session
- Add English and Hindi translations for all PIN-related UI text

**User-visible outcome:** Users create a PIN during account setup and must enter it to access their folders (Photos, Videos, Documents, Memories). They can change their PIN in settings or reset it through re-authentication if forgotten. PIN remains valid for the session.
