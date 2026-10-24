# Helia — React Native Android hotel app

A complete local hotel-booking demo inspired by the supplied green-and-white Helia reference. Built with **React Native, Expo SDK 55, TypeScript, and React Navigation**. Includes a generated native `android/` project, bundled photography, local account and booking storage, tests, and Windows launch scripts.

**This ZIP contains source code, not a prebuilt APK.** Follow the APK instructions below to build an installable Android app with your own Expo account. No backend, API key, or payment account is needed to run the demo.

## Start on your Android phone

1. Extract the entire ZIP into a normal folder such as `G:\major_projects\helia-android`. Do not run files from inside the ZIP viewer.
2. Install **Node.js 24 LTS** (Node 22.13+ is also supported).
3. Open a terminal in the folder containing `package.json`:

   ```sh
   npm ci
   npm start
   ```

4. Install **Expo Go for SDK 55** on Android. Choose SDK 55 at <https://expo.dev/go>; a newer Play Store client may not support this pinned SDK. A standalone APK built below does not need Expo Go.
5. Keep your phone and computer on the same Wi-Fi, then scan the QR code in Expo Go. Allow Node.js through the Windows firewall on your private network.
6. Tap **Get started → Skip → Explore demo**, or sign in with the demo credentials.

Windows shortcut: run **`setup-android.bat`** once, then **`start-expo.bat`**.

| Demo login | Value |
| --- | --- |
| Email | `demo@helia.app` |
| Password | `Helia@123` |
| Checkout promo | `HELIA10` — 10% off the room subtotal |

You can also create an independent local account. Saved hotels, bookings, and notifications are isolated per account. The demo account begins with a sample upcoming stay and two bookmarks.

## Build an installable APK

Cloud build, usable from Windows without Android Studio:

```sh
npm ci
npx eas-cli@latest login
npm run build:apk
```

On the first build, follow EAS prompts to create/link **your** Expo project and create Android signing credentials. EAS will add the project ID to your local config. The included `preview` profile explicitly sets `android.buildType` to `apk`. Download the APK from the build link EAS provides, copy it to your phone, and install it. Build duration and availability depend on your Expo account and plan.

Windows shortcut: **`build-apk.bat`**.

For a Play Store app bundle, `npm run build:aab` selects the `production` profile. Before publishing, use your own unique Android package ID, branding, production services, privacy policy, and signing credentials. See [Android setup](docs/ANDROID_SETUP.md).

**The `.easignore` file excludes generated native folders from cloud uploads**, so EAS regenerates Android from `app.json`. The native `android/` folder included in the ZIP is for local Android Studio builds. If you deliberately maintain manual native changes, remove that ignore rule and take ownership of the native build configuration.

## What works

- Welcome screen, three onboarding slides, skip navigation, and splash/icon assets.
- Local sign-up and sign-in, input validation, remember-me, profile completion, and logout.
- Demonstration password recovery with a visible, expiring local verification code and retry limit.
- Hotel discovery with recommended, popular, and trending categories.
- Search by hotel, city, or country; price, rating, destination, facility, and sort filters.
- List/grid views and persistent bookmarks with a removal confirmation sheet.
- Hotel details, gallery, sample reviews, facilities, and external destination map.
- A calendar range picker, room types, guest/room limits, and guest information.
- Checkout with per-room/per-night pricing, a 10% demo tax, promo discount, and payment-method choice.
- Duplicate-submit protection, booking confirmation, history, details, cancellation, and Android receipt sharing.
- Local in-app booking notifications, read status, and notification preference.
- Editable name, nickname, phone, country, avatar, plus light/dark mode.
- Help center, demo/privacy information, safe-area layout, and keyboard-aware forms.
- Data reset confirmation, storage error reporting, and account separation.

## Demo scope — read before extending

Hotels, addresses, ratings, prices, and availability are illustrative; photographs do not verify a property's identity. No availability API, reservation provider, payment processor, OAuth provider, email/SMS service, push-notification service, or backend is connected. Social sign-in buttons explain this and offer email/demo navigation.

The checkout stores a demo reservation only. It never collects card numbers or charges money. “Pay at hotel” is also a demo. The four-digit recovery code is displayed in the app; this is **not a production account-recovery mechanism**.

Profiles, favorites, bookings, settings, and notifications use device-local AsyncStorage. Native credentials use Expo SecureStore with salted PBKDF2-HMAC-SHA256 hashes (100,000 iterations). The web QA preview uses browser localStorage for its demo credential record. No server authentication, device-to-device sync, or production security claim is made. Avoid sensitive information.

Offline use is supported in the installed APK because sample photos and fonts are bundled. Initial development loading through Expo Go still needs Metro, and the external map link needs a connection. Native sharing requires a compatible installed share target.

The UI recreates the supplied reference's look and flow using original React Native code and new stock photography. It is not the original UI8 source or a pixel-exact extraction of the small reference montage.

## Commands

| Command | Purpose |
| --- | --- |
| `npm start` | Expo development server / QR code |
| `npm run android:go` | Open the SDK-compatible Expo Go client on an emulator |
| `npm run android:native` | Build and run the native debug app locally |
| `npm run prebuild:android` | Regenerate Android config/assets from Expo config |
| `npm run check` | TypeScript and 18 domain tests |
| `npm run export:android` | Validate Metro and Hermes Android bundle generation |
| `npm run web` | Optional browser preview of the same React Native app |
| `npm run export:web` | Export the browser QA build |
| `npm run build:apk` | EAS preview APK |
| `npm run build:aab` | EAS production AAB |

After changing native config or installing native packages, regenerate/rebuild Android. Do not run `npm audit fix --force`: upgrading React Native or Expo independently can break SDK compatibility. Use `npx expo install --check` to check package alignment.

## Project layout

```text
App.tsx                   App boundary, font loading, providers
src/components/           Shared controls, hotel cards, calendar
src/screens/              Auth, Explore, Hotel, Booking, Profile
src/navigation/           Native stack and five bottom tabs
src/state/store.tsx       Account-scoped state and queued persistence
src/lib/domain.ts         Search, pricing, date, and booking rules
src/lib/auth.ts           Local credential storage and password hashing
src/data/hotels.ts         Bundled sample catalog and photo references
assets/                   Icons, splash, hotel/travel photos, source URLs
android/                  Generated Kotlin/Gradle Android project
scripts/                  Node version validation
setup-android.bat          Windows setup
start-expo.bat             Windows phone demo launcher
start-native-android.bat   Windows native build launcher
build-apk.bat             Windows EAS APK launcher
tests/                    Domain regression tests
docs/                     Setup, architecture, validation, credits
```

Detailed documentation: [Android setup](docs/ANDROID_SETUP.md), [Architecture](docs/ARCHITECTURE.md), [Validation](docs/VALIDATION.md), [Credits](docs/ASSET_CREDITS.md).

Official build reference: <https://docs.expo.dev/build-reference/apk/>. SDK 55 release details: <https://expo.dev/changelog/sdk-55>.
