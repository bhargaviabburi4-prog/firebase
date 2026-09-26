import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { AuthCard } from './components/AuthCard';
import { Dashboard } from './components/Dashboard';
import { FirebaseStatusBanner } from './components/FirebaseStatusBanner';
import { ShieldCheck, Lock, Users, Zap, Loader2, Sparkles, ExternalLink } from 'lucide-react';
import { firebaseConfig } from './firebase';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 p-4">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 mx-auto animate-bounce">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">Initializing Firebase Session</h2>
            <p className="text-xs text-slate-500 mt-0.5">Connecting to {firebaseConfig.projectId}...</p>
          </div>
          <Loader2 className="w-5 h-5 text-indigo-600 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50/40 text-slate-800 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        {user ? (
          <Dashboard />
        ) : (
          <div className="w-full space-y-8">
            {/* Top Project Badge */}
            <FirebaseStatusBanner />

            {/* Auth Form Card */}
            <AuthCard />

            {/* Feature Highlights Grid */}
            <div className="w-full max-w-3xl mx-auto pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-white/70 backdrop-blur-sm border border-slate-200/70 p-4 rounded-2xl flex items-start gap-3 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Secure Authentication</h4>
                  <p className="text-slate-500 mt-0.5 leading-relaxed">
                    Client-side token exchange and salted hash verification via Firebase Auth.
                  </p>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm border border-slate-200/70 p-4 rounded-2xl flex items-start gap-3 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">User Profile Store</h4>
                  <p className="text-slate-500 mt-0.5 leading-relaxed">
                    User records and metadata automatically synced to Firestore under the authenticated UID.
                  </p>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm border border-slate-200/70 p-4 rounded-2xl flex items-start gap-3 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Instant Integration</h4>
                  <p className="text-slate-500 mt-0.5 leading-relaxed">
                    Configured for project <code className="text-slate-700 font-mono text-[10px]">{firebaseConfig.projectId}</code> with Email, Password &amp; Google OAuth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/70 py-6 text-center text-xs text-slate-400 bg-white/40">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            Firebase Authentication &bull; Project ID:{' '}
            <span className="font-mono text-slate-600">{firebaseConfig.projectId}</span>
          </p>
          <div className="flex items-center gap-4">
            <a
              href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600 transition-colors inline-flex items-center gap-1"
            >
              <span>Firebase Console</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>&bull;</span>
            <span>Production Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
