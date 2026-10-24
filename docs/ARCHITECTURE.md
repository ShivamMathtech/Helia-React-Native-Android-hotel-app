# Architecture and extension guide

## Application boundary

Expo SDK 55 with React Native 0.83 and the New Architecture. React Navigation provides a native stack and five bottom tabs. The navigator switches between onboarding, unauthenticated screens, profile completion, and the signed-in app. Android system back navigation is handled by the native stack.

UI components use Urbanist, Ionicons, SafeAreaProvider, native Pressable/TextInput/ScrollView, and a shared light/dark color hook. Photos are static Metro assets. Fonts are loaded before rendering the navigator. There is no remote photo dependency at runtime.

## State and data

`StoreProvider` owns the versioned local state (`helia.state.v1`). Each account contains its profile, saved hotel IDs, bookings, and in-app notifications. The active account selects the data shown; another local account's bookings are never selected by the booking details screen. Mutations update a synchronous reference before React renders, then enqueue serialized AsyncStorage writes to preserve ordering. Failed persistence is surfaced in the UI.

Remember-me controls whether the active account ID is written to storage. A non-remembered session remains active in memory until the app process closes. Clearing all data restores the initial demo state.

Credentials are stored separately from profiles. Native builds use SecureStore; browser previews use localStorage. Passwords use a random 16-byte salt and PBKDF2-HMAC-SHA256 with 100,000 iterations and a 32-byte derived key. The preseeded demo password is intentionally public. Local recovery is an in-memory, five-minute, five-attempt challenge with a visible code; it is a UI demo, not an authentication trust boundary.

## Booking rules

- Local calendar dates use YYYY-MM-DD, with strict calendar validation.
- Night counts compare UTC calendar components to avoid daylight-saving errors.
- Check-in is today or later and within a year. Stays last 1–30 nights.
- Rooms: 1–4. Guests: 1–8. Deluxe/Suite capacity: 2 guests per room; Family: 4.
- Room upgrades: Suite +$20 and Family +$35 per room per night.
- Integer-cent calculations determine subtotal, HELIA10 discount, then 10% demo tax.
- Checkout computes a fresh quote from the catalog instead of trusting a displayed total.
- A request ID in each booking draft prevents duplicate reservations from repeated submission.
- Cancellation is permitted only before the check-in date. Past stays become Completed when check-out is today or earlier. A stay currently in progress remains in Upcoming until checkout.
- Cancelled bookings remain visible in history. No refund is issued because nothing was charged.

## Production integration points

Replace local authentication with server-verified sessions and secure refresh-token storage; implement real email verification and recovery, OAuth redirects, rate limits, and access control. Keep account isolation and server ownership checks on every endpoint.

Replace the sample hotel catalog with a property/availability API. Quotes, inventories, promotions, cancellation rules, and reservation idempotency must be enforced server-side. Use a payment provider's native SDK and server verification/webhooks instead of the demo card selector. Store only provider tokens, never raw card data.

Add backend persistence and synchronization before supporting multiple devices. Push delivery requires a native notifications setup and server registration; current notifications are local application records only. Review privacy, accessibility, localization, large-catalog virtualization, observability, backups, and Android device tests before release.
