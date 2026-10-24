# Validation report

Validated on 24 October 2026 with Node.js 24.19.0 and npm 11.9.0 on Linux.

## Completed checks

| Check | Result |
| --- | --- |
| TypeScript strict type check | Passed |
| Domain regression tests | 18 passed, 0 failed |
| Expo dependency compatibility check | Dependencies aligned with SDK 55 |
| Expo Android prebuild | Native Android project generated successfully |
| Metro/Hermes Android export | Passed; native JS/Hermes bundle and assets generated |
| Metro web export | Passed |
| Browser interaction check of the same React Native app | Passed, no uncaught page errors |
| Phone-sized layout inspection | Inspected at 393×852 and 360×740, including dark mode |

The browser interaction check exercised: all onboarding slides; demo entry; adding a bookmark; bookmark-removal confirmation; destination search and clearing; facility filtering; hotel details; room-capacity validation; an invalid promo then HELIA10; a $57.42 demo booking; booking details and cancellation; persistence after reload; profile and avatar editing; dark mode; logout; a new local account and profile completion; account-specific empty bookings; incorrect-password handling; demo recovery; changing the password; and successful login with the changed password.

The domain tests cover strict dates, leap years, daylight-saving-safe night counts, room upgrades, integer-cent billing, discount/tax ordering, invalid quotes, stay limits, room/guest capacity, guest validation, combined search filters, sorting without mutation, history status, cancellation eligibility, receipts, and account input validation.

## Boundaries of verification

An Android bundle export validates JavaScript, Metro module resolution, bundled assets, and Hermes compilation. It is **not** an APK build or a device test. No Android SDK/emulator/device was available here, and no EAS account build was started. Gradle compilation, APK signing/installation, Windows execution, native keyboard behavior, SecureStore on a physical Android device, system back gestures, map app handoff, and the Android share sheet still require testing on the target device.

The native folder is Expo-generated and provided for local builds. The EAS configuration is included; a user-owned Expo account and signing setup are needed to generate the APK.

## First physical-device check

1. Launch through the SDK-compatible Expo Go client or build the preview APK.
2. Complete onboarding, explore the demo, and open each tab.
3. Open a hotel, try valid and invalid date ranges, change guests/rooms, and submit a demo booking.
4. Cancel a future booking and share its demo receipt through a locally installed share target.
5. Edit the profile, background/close the app, and reopen to check persistence.
6. Sign out; create a second local account and confirm separate bookings/bookmarks.
7. Check the keyboard, hardware/system back, safe areas, dark mode, and larger accessibility text.
8. Confirm that no real charge, email/SMS, or hotel reservation is expected from the demo.
