# Specification

## Summary
**Goal:** Add a Master Admin Dashboard with real-time analytics and privacy-first monitoring for the AS19 MultiDrive platform.

**Planned changes:**
- Create backend methods to track and return user count, virtual canister count, storage metadata per user token, and cycle balance
- Implement principal-based access control restricting all admin methods to the founder's Master Principal ID
- Build a dark-themed Command Center Admin Dashboard displaying user analytics, canister inventory, storage insights with per-category breakdown, and network health metrics
- Add React Query hooks to fetch and display real-time admin analytics
- Display storage usage per token in table format with GB/TB formatting
- Add Admin Dashboard navigation link visible only to the Master Principal ID
- Ensure all admin methods expose only metadata (size, timestamp, token ID) without file content access

**User-visible outcome:** The founder can authenticate via Internet Identity and access a protected Admin Dashboard showing real-time platform analytics including total users, virtual canisters, aggregated storage distribution, individual user storage breakdowns, and cycle balance monitoring—all without accessing actual user file content.
