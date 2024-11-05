/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_API_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_API_PROTECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_API_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_API_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FIREBASE_API_APPID,
}

// Initialize Firebase
initializeApp(firebaseConfig)

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
