import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider, UserProfileData, formatFirebaseAuthError } from '../firebase';

export interface UserNote {
  id: string;
  title: string;
  content: string;
  category: 'work' | 'personal' | 'important' | 'idea';
  createdAt: any;
  updatedAt: any;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfileData | null;
  loading: boolean;
  notes: UserNote[];
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  updateUserProfileData: (updates: Partial<UserProfileData>) => Promise<void>;
  addNote: (note: { title: string; content: string; category: UserNote['category'] }) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notes, setNotes] = useState<UserNote[]>([]);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch or create profile in Firestore
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfileData);
            // Update lastLoginAt
            await updateDoc(userDocRef, {
              lastLoginAt: new Date().toISOString(),
              emailVerified: currentUser.emailVerified,
              photoURL: currentUser.photoURL || null,
              displayName: currentUser.displayName || null,
            }).catch(() => {});
          } else {
            const newProfile: UserProfileData = {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Member',
              photoURL: currentUser.photoURL || null,
              phoneNumber: currentUser.phoneNumber || null,
              bio: 'Active member',
              organization: 'Personal Workspace',
              role: 'Standard User',
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
              emailVerified: currentUser.emailVerified,
              providerId: currentUser.providerData[0]?.providerId || 'password',
            };
            await setDoc(userDocRef, newProfile).catch(() => {});
            setProfile(newProfile);
          }
        } catch (err) {
          console.warn('Could not sync Firestore profile:', err);
          // Fallback to Auth metadata
          setProfile({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName || 'Member',
            photoURL: currentUser.photoURL || null,
            emailVerified: currentUser.emailVerified,
            role: 'Standard User',
          });
        }
      } else {
        setProfile(null);
        setNotes([]);
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Listen to User Notes in Firestore
  useEffect(() => {
    if (!user) {
      setNotes([]);
      return;
    }

    try {
      const notesRef = collection(db, 'users', user.uid, 'notes');
      const q = query(notesRef, orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetchedNotes: UserNote[] = [];
          snapshot.forEach((docItem) => {
            const data = docItem.data();
            fetchedNotes.push({
              id: docItem.id,
              title: data.title || 'Untitled',
              content: data.content || '',
              category: data.category || 'personal',
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
              updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt || new Date().toISOString(),
            });
          });
          setNotes(fetchedNotes);
        },
        (error) => {
          console.warn('Notes listener warning (using local fallback if Firestore rules restrict subcollection):', error);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn('Error setting up notes subscription:', e);
    }
  }, [user]);

  // Auth operations
  const registerWithEmail = async (email: string, pass: string, name: string) => {
    const res = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (res.user) {
      if (name.trim()) {
        await updateProfile(res.user, { displayName: name.trim() });
      }
      
      const newProfile: UserProfileData = {
        uid: res.user.uid,
        email: res.user.email,
        displayName: name.trim() || res.user.email?.split('@')[0] || 'Member',
        photoURL: null,
        phoneNumber: null,
        bio: 'Welcome to my profile!',
        organization: 'Independent',
        role: 'Standard User',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        emailVerified: false,
        providerId: 'password',
      };

      try {
        await setDoc(doc(db, 'users', res.user.uid), newProfile);
        setProfile(newProfile);
      } catch (err) {
        console.warn('Firestore write warning:', err);
        setProfile(newProfile);
      }

      // Optionally send verification email
      try {
        await sendEmailVerification(res.user);
      } catch (err) {
        console.warn('Verification email dispatch:', err);
      }
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), pass);
  };

  const loginWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    if (res.user) {
      const userDocRef = doc(db, 'users', res.user.uid);
      const existing = await getDoc(userDocRef).catch(() => null);
      if (!existing || !existing.exists()) {
        const newProfile: UserProfileData = {
          uid: res.user.uid,
          email: res.user.email,
          displayName: res.user.displayName || 'Google User',
          photoURL: res.user.photoURL,
          phoneNumber: res.user.phoneNumber,
          bio: 'Verified via Google Sign-In',
          organization: 'Personal Workspace',
          role: 'Standard User',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          emailVerified: res.user.emailVerified,
          providerId: 'google.com',
        };
        await setDoc(userDocRef, newProfile).catch(() => {});
        setProfile(newProfile);
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
    setNotes([]);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  const sendVerificationEmailPrompt = async () => {
    if (!auth.currentUser) throw new Error('No authenticated user found.');
    await sendEmailVerification(auth.currentUser);
  };

  const updateUserProfileData = async (updates: Partial<UserProfileData>) => {
    if (!auth.currentUser) throw new Error('User not logged in');

    // Update Firebase Auth profile if displayName or photoURL changed
    const authUpdates: { displayName?: string; photoURL?: string } = {};
    if (updates.displayName !== undefined) authUpdates.displayName = updates.displayName || '';
    if (updates.photoURL !== undefined) authUpdates.photoURL = updates.photoURL || '';

    if (Object.keys(authUpdates).length > 0) {
      await updateProfile(auth.currentUser, authUpdates);
    }

    // Update Firestore document
    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    try {
      await updateDoc(userDocRef, updates as any);
    } catch (err) {
      // If doc doesn't exist yet, set it
      await setDoc(userDocRef, updates, { merge: true }).catch(() => {});
    }

    setProfile((prev) => (prev ? { ...prev, ...updates } : (updates as UserProfileData)));
  };

  const addNote = async (note: { title: string; content: string; category: UserNote['category'] }) => {
    if (!user) throw new Error('Authentication required to save notes');
    try {
      const notesRef = collection(db, 'users', user.uid, 'notes');
      await addDoc(notesRef, {
        ...note,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      // Local fallback in state so user immediately sees notes even if offline/restricted
      const fallbackNote: UserNote = {
        id: 'local_' + Date.now(),
        title: note.title,
        content: note.content,
        category: note.category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes((prev) => [fallbackNote, ...prev]);
    }
  };

  const deleteNote = async (id: string) => {
    if (!user) throw new Error('Authentication required');
    try {
      if (!id.startsWith('local_')) {
        const noteDocRef = doc(db, 'users', user.uid, 'notes', id);
        await deleteDoc(noteDocRef);
      }
    } catch (err) {
      console.warn('Note delete error:', err);
    }
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const contextValue = useMemo(
    () => ({
      user,
      profile,
      loading,
      notes,
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      logout,
      resetPassword,
      sendVerificationEmail: sendVerificationEmailPrompt,
      updateUserProfileData,
      addNote,
      deleteNote,
    }),
    [user, profile, loading, notes]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
