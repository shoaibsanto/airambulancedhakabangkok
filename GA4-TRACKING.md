# GA4 Conversion Tracking

**Measurement ID:** `G-RD9N9KY692`
Set in Vercel as `NEXT_PUBLIC_GA_ID` (Production + Development). The base tag is
injected by [`components/Analytics.jsx`](components/Analytics.jsx); all custom
events fire from [`components/ClientScripts.jsx`](components/ClientScripts.jsx)
via the `track()` helper (also mirrors key events to Meta Pixel if configured).

## Events

| Event | Trigger | Parameters | Mark as Key event |
|---|---|---|---|
| `page_view` | every page load (gtag automatic) | — | — |
| `call_click` | click any `tel:` link (topbar, hero, hero card, estimator, FAB, mobile bar, CTA, footer, Bangla block) | `loc` | ✅ |
| `whatsapp_click` | click any WhatsApp link (FAB, mobile bar, hero, Bangla block) | `loc` | ✅ |
| `email_click` | click any `mailto:` link | `loc` | ✅ |
| `generate_lead` | hero/contact form submit (after POST to `/api/lead`) | `method`, `form`, `page` | ✅ |
| `estimator_quote_click` | click "Get my exact free quote" in the estimator | `loc` | ✅ |
| `estimator_use` | change the cost-estimator dropdown | `transfer_type` | optional |
| `form_start` | first focus/keystroke in an inquiry form | `form` | optional |
| `faq_open` | open a FAQ accordion item | `question` | optional |
| `scroll_depth` | reach 25 / 50 / 75 / 90% of the page | `percent` | optional |
| `outbound_click` | click an external link | `url` | optional |

`loc` values: `topbar`, `hero`, `herocard`, `estimator`, `mobilebar`, `bnblock`, `link` (default).

## One-time GA4 dashboard setup (do in the GA4 UI)

1. **Admin → Property settings:** Time zone = (GMT+06:00) Dhaka, Currency = BDT.
2. **Admin → Data display → Key events** → mark as Key events:
   `call_click`, `whatsapp_click`, `email_click`, `generate_lead`, `estimator_quote_click`.
   (If an event isn't listed yet, trigger it once on the live site, wait ~24h or use *Create event*.)
3. **Admin → Custom definitions → Create custom dimensions** (event-scoped) for
   `loc`, `transfer_type`, `method`, `form`, `percent`, `question`, `url` so they're reportable.
4. **Enhanced measurement:** keep ON.
5. (Optional) Link GA4 ↔ Google Ads and import the Key events as conversions.

## Verify

- Open https://airambulancedhakabangkok.com/?debug_mode=1 and watch **GA4 → Admin → DebugView**.
- Click each call / WhatsApp / email entry, submit the form, use the estimator, scroll, open a FAQ — confirm each event fires with the right params and appears in **Realtime**.
- Network tab should show `gtag/js?id=G-RD9N9KY692` loading.

## Notes
- Tracking is **env-gated**: remove `NEXT_PUBLIC_GA_ID` to disable everything.
- Events re-bind on every client route change (the component keys off `usePathname`).
- Adding a new CTA? Give its link a `data-loc="..."` and the global click handler tracks it automatically.
