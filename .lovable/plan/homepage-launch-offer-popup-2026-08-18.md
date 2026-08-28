# Homepage Launch Offer Popup

## Goal
Show a premium launch-offer popup card on the Intervixa AI homepage (`/`) for new/anonymous visitors. Clicking the **“Claim This Offer”** CTA redirects them to `/login`. The popup should match the uploaded card reference and uses the existing Intervixa dark theme.

## Requirements
- **Visibility**: Show only for logged-out / anonymous users. Signed-in users never see it.
- **Frequency**: Show on every visit for logged-out users (no localStorage suppression).
- **Dismiss**: Only close via the dedicated X button (no outside-click or ESC close).
- **CTA**: “Claim This Offer” → navigates to `/login` with a `?next=/chat` or similar return path.
- **Design**: Reuse the card design language from `LaunchOfferSection.tsx` (badges, feature list, ₹499 → FREE, 1 Year Premium, Claim button, teal/cyan gradient).
- **Accessibility**: Dialog wrapper with `aria-modal`, focus lock, close label, role attributes.

## Implementation Plan

1. **Create a new popup component** `src/components/LaunchOfferPopup.tsx`
   - Use the existing `Dialog` primitives (`Dialog`, `DialogContent`, `DialogTitle`, `DialogDescription`) from `src/components/ui/dialog.tsx`.
   - Render it as an uncontrolled dialog that opens automatically on mount for anonymous users.
   - Copy the card content from `LaunchOfferSection.tsx`:
     - “Exclusive Launch Offer” + “Limited Time Offer” badges.
     - 5 feature bullets (`CARD_FEATURES`).
     - Strikethrough ₹499 + FREE price block.
     - “1 Year Premium Access” / “First 1,000 Users Only”.
     - “Claim This Offer” gradient button with arrow.
   - Hide the default close button from `DialogContent` and add a custom `X` button in the card header.
   - Prevent closing on overlay click / ESC via Radix props (`onPointerDownOutside={(e) => e.preventDefault()}`, `onEscapeKeyDown={(e) => e.preventDefault()}`).

2. **Update `src/pages/Index.tsx`**
   - Import `<LaunchOfferPopup />` and place it inside the page wrapper.
   - The popup itself will check the current auth session and only render/open for signed-out users.

3. **Auth check inside the popup**
   - On mount, call `supabase.auth.getSession()` and `supabase.auth.onAuthStateChange()`.
   - If a session exists (user is logged in), keep the dialog closed / unmounted.
   - If no session, open the dialog after a short mount delay (e.g., 500 ms) so it animates in.

4. **CTA behavior**
   - Wrap the button in a React Router `<Link to="/login?next=/chat">` or use `useNavigate` on click.
   - Close the popup before navigation (optional, as page changes anyway).

5. **Visual polish**
   - Use `bg-card`, `border-border/60`, `rounded-3xl`, `shadow-card`, `backdrop-blur`.
   - Keep the dialog width constrained (`max-w-md`) so it feels like a card, not a full-screen modal.
   - Add a subtle entrance animation with `framer-motion` or rely on the existing Radix `animate-in` classes.

6. **Verification**
   - Open the homepage in an incognito window and confirm the popup appears.
   - Click “Claim This Offer” and verify it lands on `/login`.
   - Sign in, return to `/`, and confirm the popup does not show.
   - Test that clicking the X closes the popup and the page remains usable.

## Files to modify
- `src/components/LaunchOfferPopup.tsx` (new)
- `src/pages/Index.tsx` (add the popup)

## No backend changes required
This is a frontend-only feature; no database, Edge Function, or auth config changes are needed.
