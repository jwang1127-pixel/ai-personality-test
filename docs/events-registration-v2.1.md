# AI时代，我的路在何方？— 网站报名 MVP v2.1

This is an **unreleased implementation**, on a feature branch. It must not be merged or advertised until storage, deployment, privacy, and real-user testing are verified.

## Files
- `public/events.html`: mobile-friendly event information and self-contained registration form; no membership requirement.
- `api/event-register.js`: POST-only serverless validation, Airtable lookup and write.
- `vercel.json`: /events -> /public/events.html.
- `public/index.html`: link to /events.

## Airtable configuration (separate event table)
In a separate event registration table, configure these **exact case-sensitive fields**:
- `Name` — single-line text
- `Email` — email (or single-line text)
- `WeChat` — single-line text
- `Identity` — single-line text
- `Grade` — single-line text
- `Topics` — long text
- `Question` — long text
- `Status` — single-line text (or a select containing Pending, Confirmed, Waitlisted, Cancelled)
- `Consent` — single-line text
- `Source` — single-line text
- `SubmittedAt` — date/time (allow ISO date/time), or single-line text

Set Vercel environment variables (never place token values in git):
- `AIRTABLE_API_KEY`: existing Airtable personal access token with necessary read/write permissions for new base/table (prefer a scoped token)
- `EVENT_AIRTABLE_BASE_ID`
- `EVENT_AIRTABLE_TABLE_ID`

The current assessment's `AIRTABLE_BASE_ID` and `AIRTABLE_TABLE_ID` are **not used** by event registrations.

Airtable's view is the **temporary administrator interface**: sort by SubmittedAt, filter by Status, mark Confirmed/Waitlisted, and export authorized registrations there. There is no public listing endpoint.

## Important limitations before production launch
1. This version records a **pending application**, not an assigned seat. The organizer must confirm with attendees manually. No automatic email is implemented.
2. Duplicate email lookup is advisory and not atomic; concurrent requests can create duplicates. Resolve duplicates in the Airtable admin view.
3. Serverless rate limiting / bot defense, data retention policy, eligibility for minors, capacity controls, event date and venue, and an accessible privacy-contact method require review before accepting broad public registration.
4. API returns service-unavailable until all event Airtable env variables and table fields are set; this prevents misleading success when storage is unavailable.
5. Deploy to a preview first. Test valid form submission, duplicate email, missing required fields, Airtable write failures, mobile display, accessibility, and existing assessment/payment behavior.
6. Existing `api/test-env.js` reveals a secret-key prefix and should be removed or locked down before any unrelated production security review. No change was made to that endpoint in this branch.

## Trademark-use evidence boundaries
Event registration and event publicity are **not substitutes** for actual SaaS or interactive community use. Preserve dated URLs/screenshots of real functioning services and genuine use. Confirm the exact mark/service wording and legal requirements independently before submitting a Statement of Use. Do not present this future community feature as already launched.

## Suggested smoke test
1. Open Vercel preview `/events` and confirm its content.
2. Submit a test registration with valid consent.
3. Verify a new Airtable row, Status=Pending, and timestamp.
4. Re-submit same email and verify no new row is created (sequential case).
5. Test invalid email and absent consent, and verify no rows.
6. Confirm that home page links to `/events`; open the original assessment.
7. Approve and merge only after checking actual deployment routes and legitimate privacy/contact copy.
