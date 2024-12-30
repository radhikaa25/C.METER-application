import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCaZM4T0gSmFC_RLXtCLjnJelHCqy-9m8Q",
  authDomain: "code-master-a0ab4.firebaseapp.com",
  projectId: "code-master-a0ab4",
  storageBucket: "code-master-a0ab4.firebasestorage.app",
  messagingSenderId: "522687720511",
  appId: "1:522687720511:web:9e978c4fef84b0b7c59c8a",
  measurementId: "G-8VCY8VQJVL"
};


export const app = initializeApp(firebaseConfig);

export const initializeAnalytics = async () => {
  if (typeof window !== 'undefined' && await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

export const logEvent = async (eventName: string, eventParams?: Record<string, any>) => {
  const analytics = await initializeAnalytics();
  if (analytics) {
    const { logEvent } = await import('firebase/analytics');
    logEvent(analytics, eventName, eventParams);
  }
};
