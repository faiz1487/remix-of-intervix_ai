# Google OAuth `redirect_uri_mismatch` — exact cause

## Answers to your two questions

**1. Which auth is used for Google Sign-In?**
Lovable Cloud Auth (the managed OAuth broker), not a direct Supabase `signInWithOAuth` call.
`src/pages/Login.tsx` calls `lovable.auth.signInWithOAuth("google", ...)` from
`src/integrations/lovable/index.ts`, which wraps `createLovableAuth()` from
`@lovable.dev/cloud-auth-js`. The broker runs the Google round-trip and only then hands
tokens to `supabase.auth.setSession()`. So the redirect URI Google sees is the **broker's**
callback path on your domain, not a Supabase URL.

**2. The exact `redirect_uri` sent to Google**
From the live test on `https://intervixa.online/login`, Google's error page reported:

```text
https://intervixa.online/~oauth/callback
```

Note the path: `/~oauth/callback` — one segment, tilde attached directly to `oauth`.

## The mismatch

The URIs you listed as registered are:

```text
https://intervixa.lovable.app/~/oauth/callback
https://intervixa.online/~/oauth/callback
https://www.intervixa.online/~/oauth/callback
```

These have an extra slash after the tilde (`/~/oauth/`). Google matches redirect URIs as
exact strings, so `/~/oauth/callback` never matches the `/~oauth/callback` that is actually
sent. That alone produces Error 400.

## Fix (Google Cloud Console only — no code change)

On the OAuth 2.0 Web client `173741036446-vd68f5n6rk1...`, replace the three tilde entries so
**Authorized redirect URIs** read exactly:

```text
https://oauth.lovable.app/callback
https://intervixa.lovable.app/~oauth/callback
https://intervixa.online/~oauth/callback
https://www.intervixa.online/~oauth/callback
https://ihyxemjksxwuovdabjxu.supabase.co/auth/v1/callback
```

Keep the JavaScript origins as they are. Save, wait a few minutes for Google to propagate.
Then in backend Auth settings → Sign In Methods → Google, confirm the same redirect URLs are
ticked and saved.

## Verification step I will run after approval

Re-run the live browser test against `https://intervixa.online/login`, click "Continue with
Google", and report whether it reaches the Google account chooser, what app name the consent
screen shows, and the exact `redirect_uri` in the request URL.
