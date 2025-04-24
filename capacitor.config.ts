import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.example.app",
  appName: "My App",
  webDir: "dist",
  server: {
    androidScheme: "https",
    cleartext: true,
  },
  plugins: {
    SpeechRecognition: {
      androidRecognizerShowPopup: false,
      androidRecognizerSingleResult: false,
      androidRecognizerPartialResults: true,
      androidRecognizerShowPartial: true,
    },
  },
  cordova: {
    accessOrigins: ['']
  }
}

export default config
