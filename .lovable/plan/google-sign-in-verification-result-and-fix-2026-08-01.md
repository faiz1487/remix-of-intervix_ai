# Google Sign-In Verification — Result and Fix

## What the browser test found

Real browser test on the live site `https://intervixa.online/login`:

1. Login page loads, "Continue with Google" button works.
2. Click redirects to Google, but Google returns an error page:
   **`redirect_uri_mismatch`** for `redirect_uri = https://intervixa.online/~oauth/callback`.

So Google sign-in is currently **broken on the custom domain**. The provider itself is enabled and the auth chain is wired correctly — the only failure is that this exact redirect URI is not registered on the Google OAuth client being used (`173741036446-...apps.googleusercontent.com`).

Local preview (`localhost:8080`) also 404s on `/~oauth/initiate`, but that is expected: only the hosted Lovable proxy handles that path. It is not a bug.

## Fix (no code change needed — Google Cloud Console configuration)

In Google Cloud Console → APIs & Services → Credentials → the OAuth 2.0 Web client used by this app, add ALL of these under **Authorized redirect URIs**:

```text
https://oauth.lovable.app/callback
https://intervixa.online/~oauth/callback
https://www.intervixa.online/~oauth/callback
https://intervixa.lovable.app/~oauth/callback
https://ihyxemjksxwuovdabjxu.supabase.co/auth/v1/callback
```

Also under **Authorized JavaScript origins**:

```text
https://intervixa.online
https://www.intervixa.online
https://intervixa.lovable.app
```

Save, then wait a few minutes for Google to propagate.

Then in the app's backend Auth settings → Sign In Methods → Google, make sure the same redirect URLs are ticked/enabled and saved.

## Verification after the change

I will re-run the same live browser test against `https://intervixa.online/login` and confirm the click lands on the Google account chooser (not the error page), and report what app name the consent screen shows.

## Optional follow-up

The consent screen still uses the shared/managed client branding. If you want it to say "Intervixa AI", the OAuth consent screen app name and logo must be set on your own Google Cloud project for this same client ID.
