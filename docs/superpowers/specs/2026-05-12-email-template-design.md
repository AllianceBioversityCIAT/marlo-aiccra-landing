# Email Template — Demo Booking Notification

**Date:** 2026-05-12  
**Status:** Approved

## Overview

When a user submits the contact/booking form, the MARLO team receives an HTML email notification. The template uses the visual identity of the MARLO AICCRA landing page and replaces the current plain-text message.

## Visual Style

- **Layout:** Minimal accent bar (style B) — white background throughout with a 4px blue top bar
- **Colors:** `#2563eb` (accent bar), `#0f2a47` (headings / CTA button), `#6b7280` (labels), `#111827` (values), `#f8f9fa` (card header bg), `#e5e7eb` (borders)
- **Typography:** Inter (Arial fallback) — compatible with all major email clients
- **Logo:** `marlo-logo.png` embedded as Base64 inline in `<img>` — no external URL dependency

## Structure

```
[4px blue accent bar]
[Header] logo + "MARLO AICCRA Platform" + "Demo Request" badge
[Hero]   "New demo request received" + intro sentence with name & org
[Card]   Contact Details table: Name / Organization / Email / Role / Message
[CTA]    "Reply to [name] →" button — mailto: link with requester email pre-filled
[Footer] "© 2025 CGIAR AICCRA · All rights reserved"
```

## Data Bindings

| Element | Value |
|---|---|
| Intro sentence | `{name}` from `{organization}` |
| Name row | `{name}` |
| Organization row | `{organization}` |
| Email row | `{email}` (linked) |
| Role row | `{role}` — row hidden if empty |
| Message row | `{message}` — row hidden if empty |
| CTA href | `mailto:{email}?subject=Re: MARLO Demo Request` |
| CTA text | `Reply to {name} →` |

## Implementation

The template is an HTML string generated in `src/pages/api/contact.ts`. It is Base64-encoded and sent as `data.emailBody.message.socketFile` to the notification microservice (RabbitMQ). The existing plain-text `message.text` is kept as fallback for email clients that don't render HTML.

### Files to modify

- `src/pages/api/contact.ts` — add `buildEmailHtml(fields)` helper function + pass `socketFile` in payload

### Logo handling

`marlo-logo.png` is read from disk at build/runtime using `fs.readFileSync` and Base64-encoded inline into the `<img src="data:image/png;base64,...">` tag. This avoids any dependency on the deployed site URL.

## Constraints

- No external CSS files or Google Fonts — inline styles only (email client compatibility)
- No JavaScript in the template
- Max width 600px — standard email safe width
- All colors hardcoded (not CSS variables) for Outlook/Gmail compatibility
