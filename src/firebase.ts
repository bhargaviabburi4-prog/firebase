import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyBwnZvGOeFIST_DW7CCrtCPVP6TlweV4aA",
  authDomain: "bhargavi-fe4dd.firebaseapp.com",
  projectId: "bhargavi-fe4dd",
  storageBucket: "bhargavi-fe4dd.firebasestorage.app",
  messagingSenderId: "43134838323",
  appId: "1:43134838323:web:c443fce5b0dbb05aa06546"
};

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export interface UserProfileData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber?: string | null;
  bio?: string;
  organization?: string;
  role?: string;
  createdAt?: string | Timestamp | null;
  lastLoginAt?: string | Timestamp | null;
  emailVerified?: boolean;
  providerId?: string;
}

/**
 * Format human-readable Firebase Auth error messages
 */
export function formatFirebaseAuthError(error: any): { message: string; isConfigError: boolean; actionUrl?: string } {
  const code = error?.code || '';
  const rawMessage = error?.message || 'An unexpected authentication error occurred.';

  switch (code) {
    case 'auth/unauthorized-domain': {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'current host';
      return {
        message: `This web domain (${currentHost}) is not added to your Firebase Authorized Domains list. Please add "${currentHost}" under Firebase Console > Authentication > Settings > Authorized domains.`,
        isConfigError: true,
        actionUrl: `https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/settings`
      };
    }
    case 'auth/account-exists-with-different-credential':
      return {
        message: 'An account already exists with the same email address but different sign-in credentials. Please sign in using the original method.',
        isConfigError: false
      };
    case 'auth/operation-not-allowed':
      return {
        message: 'This sign-in method is currently disabled in your Firebase Console. Please enable "Google" and "Email/Password" in Authentication > Sign-in method.',
        isConfigError: true,
        actionUrl: `https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/providers`
      };
    case 'auth/configuration-not-found':
      return {
        message: 'Firebase Authentication is not configured for this project. Please set up the sign-in provider in your Firebase console.',
        isConfigError: true,
        actionUrl: `https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/providers`
      };
    case 'auth/email-already-in-use':
      return {
        message: 'An account with this email address already exists. Please log in instead or use another email.',
        isConfigError: false
      };
    case 'auth/invalid-email':
      return {
        message: 'The email address is invalid. Please check the spelling and format.',
        isConfigError: false
      };
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return {
        message: 'Invalid email or password. Please verify your credentials and try again.',
        isConfigError: false
      };
    case 'auth/weak-password':
      return {
        message: 'The password is too weak. Please use at least 6 characters with a combination of letters and numbers.',
        isConfigError: false
      };
    case 'auth/popup-closed-by-user':
      return {
        message: 'The Google Sign-In popup was closed before completing authentication. Please try again.',
        isConfigError: false
      };
    case 'auth/popup-blocked':
      return {
        message: 'The authentication popup was blocked by your browser. Please allow popups for this site.',
        isConfigError: false
      };
    case 'auth/too-many-requests':
      return {
        message: 'Access temporarily disabled due to many failed attempts. Please reset your password or try again later.',
        isConfigError: false
      };
    case 'auth/network-request-failed':
      return {
        message: 'Network connection failed. Please check your internet connection and try again.',
        isConfigError: false
      };
    case 'auth/user-disabled':
      return {
        message: 'This user account has been disabled by an administrator.',
        isConfigError: false
      };
    case 'auth/requires-recent-login':
      return {
        message: 'This action is sensitive and requires recent authentication. Please log in again.',
        isConfigError: false
      };
    default:
      return {
        message: rawMessage.replace('Firebase: ', ''),
        isConfigError: false
      };
  }
}
