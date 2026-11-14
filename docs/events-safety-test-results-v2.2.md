# Event registration v2.2 — launch hardening test results

Tested: 2026-11-14, Preview only.

Changes:
- Added POST JSON, payload-length, Origin, and value-length validation to event-register API
- Improved website privacy description without asserting an unapproved retention schedule
- Removed `api/test-env.js` because it returned a Stripe key prefix
- Added Airtable administrative columns NotificationStatus, ContactedAt, AdminNotes
- Created manual capacity/notification/privacy operational checklist in docs

Validated on READY Vercel Preview for branch `feature/events-registration-v2-1`:
- `GET /events`: HTTP 200, registration form and updated privacy explanation present.
- Test `POST /api/event-register` with valid fake registration: HTTP **201**.
- Second POST for same email: HTTP **200**, duplicate message; verified only one corresponding Airtable record.
- Invalid email: **400**.
- consent=false: **400**.
- Origin from a different domain: **403**.
- Removed that sole test record; Airtable final count: **0**.
- Sandbox used for HTTP tests stopped after testing.

Not claimed as validated: concurrent submissions, rate limiting/robot defense, notification delivery, all mobile browsers, or preproduction regression of the payment/assessment flows.

Production gates not yet met: actual date/time/venue, approved headcount and staff reserves, privacy contact and retention policy, staff confirmation workflow, anti-spam safeguards and existing service regression. No production merge or deploy occurred.
