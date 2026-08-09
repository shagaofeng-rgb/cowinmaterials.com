# Analytics implementation

The website has no GA4 or GTM identifier committed to source control. To enable GA4, set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in the Vercel production environment to the real measurement ID and redeploy. The layout loads no Google analytics script when that environment variable is absent.

Defined events:

- `form_submit`: enquiry API returned a successful response; includes `request_type`.
- `request_tds`: a user selected a TDS or technical-data request.
- `request_sample`: a user selected a sample request.
- `request_quote`: a user selected a quote request.
- `email_click`: a `mailto:` link was selected.
- `phone_click`: a `tel:` link was selected.
- `whatsapp_click`: reserved for a future verified WhatsApp contact link; not emitted until such a link exists.

The client also dispatches `cowin:analytics` browser events so a future consent-managed GTM implementation can consume the same names without changing business UI code. No tracking ID, API secret, or fabricated analytics result is included in this repository.
