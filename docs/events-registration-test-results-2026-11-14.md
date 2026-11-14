# Event registration preview: end-to-end test results

Date: 2026-11-14 (America/Los_Angeles)

## Scope
Preview branch: `feature/events-registration-v2-1`; Vercel project: `ai-personality-test`.
Airtable: existing base (AI Personality Test Data), new table `Event Registrations`. The original `Users` table was not changed.

## Observed results
- Preview HTML entry page `/events.html`: **200 OK**.
- Corrected friendly route `/events` in commit `d00bd9750110937bccb854e2a3d9093a810ac8b3`: **200 OK**, expected title/form present.
- Server API GET `/api/event-register`: **405 Method Not Allowed** (expected POST-only).
- Valid test POST from Vercel sandbox to preview: **201 Created**, server response indicates pending registration.
- Airtable record subsequently read: name, email, identity, topic, pending status, consent and timestamp matched test data.
- Repeated email POST: **200**, existing registration response; read-back showed still **one** test record.
- Invalid email POST: **400**.
- Missing consent POST: **400**.
- Test record deleted after validation; read-back showed **zero** records.

## Environmental setup
Created preview-only, branch-scoped `EVENT_AIRTABLE_BASE_ID` and `EVENT_AIRTABLE_TABLE_ID` variables in Vercel. Existing `AIRTABLE_API_KEY` variable was reused, never printed or copied to source control. Production variables were **not** created or changed.

## Not yet completed / do not release publicly
- No production deployment or main-branch merge.
- Manual organizer approval remains required. Automated confirmation/notifications have not been implemented.
- Capacity management, rate limiting/bot protection, information retention policy, contact/privacy content and accessibility/device checks need production readiness review.
- Duplicate-email prevention is sequential/advisory, not race-safe.
- Existing repository `api/test-env.js` exposes partial secret info and should be secured separately before public launch.
- This registration system is not itself evidence of a functioning community service for trademark purposes.

**Conclusion:** backend integration and API validation tests passed on preview; not yet approved for a public production launch.
