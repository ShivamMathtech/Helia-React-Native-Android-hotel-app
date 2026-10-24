# Android setup and troubleshooting

## Option A: Expo Go on a physical phone

Use Node.js 24 LTS, `npm ci`, and `npm start`. This repository pins Expo 55.0.32, React Native 0.83.10, and React 19.2.0. Install the SDK 55 Android client from <https://expo.dev/go>. The latest Play Store Expo Go client may target a different SDK; do not change `sdkVersion` or upgrade only one dependency to bypass a mismatch.

If the QR code will not load:

- Keep both devices on the same private Wi-Fi; disable VPNs that block local networking.
- Allow Node.js through Windows Firewall on private networks.
- Run `npx expo start --clear --lan` and scan the new QR.
- Networks with client isolation can block phone-to-PC access. Use a personal hotspot or the standalone APK instead. Expo's tunnel option is an alternative that needs additional network access and its tunnel dependency: `npx expo start --tunnel`.

## Option B: Local Android Studio build

1. Install Android Studio, JDK 17, Android SDK Platform 36, Build Tools 36.0.0, platform-tools, and the emulator. The generated project requests NDK 27.1.12297006; install it through SDK Manager if Gradle cannot fetch it.
2. Set `ANDROID_HOME` to your SDK location, usually `%LOCALAPPDATA%\Android\Sdk`, and include `%ANDROID_HOME%\platform-tools` in PATH. Set `JAVA_HOME` to JDK 17.
3. Run `npm ci` at the project root.
4. Start an Android emulator, or enable Developer options → USB debugging on a phone, connect it, and accept its debugging authorization prompt. Verify `adb devices` lists an authorized device.
5. Run `npm run android:native`, or open the included `android/` folder in Android Studio and let Gradle sync. Initial Gradle/Maven downloads require internet.

The checked dependency catalog requests compile/target SDK 36 and a minimum Android API 24. Hardware runtime behavior has not been verified in the generation environment.

Use `npm run prebuild:android` to synchronize changes in `app.json` into the generated native project. This can overwrite generated resources. Keep deliberate manual native changes under version control before regenerating.

A native debug build normally uses Metro and is not the same as an offline release APK. The bundled Android template's `debug.keystore` is a public development key. Never treat it as a private production signing key. Use EAS-managed release credentials, or configure your own release signing before publishing a manually built release.

## Option C: EAS APK (recommended for sharing)

```sh
npm ci
npx eas-cli@latest login
npm run build:apk
```

Use your own Expo account. Accept project linking and Android credential setup prompts. A new EAS project ID is intentionally not prefilled. The preview profile produces an APK; production produces an AAB. Build plans and queue availability are controlled by Expo.

The cloud upload excludes `android/` via `.easignore`, and EAS runs Expo prebuild from `app.json`. This avoids shipping machine-local SDK paths and ensures icon, splash, secure-storage, and font configuration is applied. Local changes only inside `android/` will not enter that cloud build unless you change this intentional ignore rule.

Before release, change `android.package` in `app.json` to your own unique ID and regenerate the native project. Increment version/versionCode for subsequent store releases.

## Common problems

| Symptom | Action |
| --- | --- |
| `expo` or `react-native` not recognized | Use `npm ci`, then project scripts; avoid the deprecated global `expo-cli`. |
| SDK mismatch in Expo Go | Install the SDK 55 client or use your standalone APK. |
| Blank screen after changing packages | Run `npx expo start --clear`; rebuild native if a native dependency changed. |
| `EBADENGINE` | Install Node 24 LTS and reopen the terminal. |
| Gradle cannot find SDK | Set ANDROID_HOME or let Android Studio create `android/local.properties`. |
| Device unauthorized | Accept the USB-debug prompt; inspect `adb devices`. |
| Windows installation issues | Extract outside OneDrive/network folders; avoid nesting under a very long path; rerun `npm ci`. |
| EAS project/account prompt | Log into your Expo account and link/create your own project. |
| Login fails | Use `demo@helia.app` / `Helia@123`, unless you changed its local password. Demo recovery can reset it. |
| No local account after reinstall | There is no cloud sync; create a new local account. |
| Need to restore demo data | Settings → Reset all demo data → confirm. This removes all local accounts. |

Official references: <https://docs.expo.dev/get-started/set-up-your-environment/>, <https://docs.expo.dev/build-reference/apk/>, <https://docs.expo.dev/build/eas-json/>.
