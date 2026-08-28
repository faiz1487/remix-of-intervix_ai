# Google Sign-In — Verification Result (re-tested)

## Test just now

Live browser test on `https://intervixa.online/login`:

1. Page loads, "Continue with Google" button works.
2. Click goes to Google, and Google returns:
   **Error 400: `redirect_uri_mismatch`** for `redirect_uri = https://intervixa.online/~oauth/callback`
   on client `173741036446-vd68f5n6rk1fqap31vnq9ib84u029t23.apps.googleusercontent.com`.

So Google sign-in is still **broken**, and for the same reason as before: that redirect URI is not registered on this Google OAuth client. Nothing in the app code needs to change.

## Fix (Google Cloud Console)

Open the OAuth 2.0 Web client with ID starting `173741036446-vd68f5n6rk1...` and add ALL of these under **Authorized redirect URIs**:

```text
https://oauth.lovable.app/callback
https://intervixa.online/~oauth/callback
https://www.intervixa.online/~oauth/callback
https://intervixa.lovable.app/~oauth/callback
https://ihyxemjksxwuovdabjxu.supabase.co/auth/v1/callback
```

Under **Authorized JavaScript origins**:

```text
https://intervixa.online
https://www.intervixa.online
https://intervixa.lovable.app
```

Save. Google can take a few minutes to propagate.

Then in the app's backend Auth settings → Sign In Methods → Google: tick the same redirect URLs and Save.

## Re-verification

Once you confirm the URIs are saved, I will re-run the same live browser test and report whether the click reaches the Google account chooser and what app name the consent screen shows.
