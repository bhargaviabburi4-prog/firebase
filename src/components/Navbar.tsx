import React from 'react';
import { ShieldCheck, Database, ExternalLink, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { firebaseConfig } from '../firebase';

export const Navbar: React.FC = () => {
  const { user, profile, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-slate-200/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">
                AuthPortal
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {firebaseConfig.projectId}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block -mt-0.5">
              Firebase Authentication &amp; Firestore
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <a
            href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/users`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 px-3 py-1.5 rounded-xl transition-colors"
          >
            <span>Firebase Console</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-800 leading-tight">
                  {profile?.displayName || user.displayName || user.email?.split('@')[0]}
                </span>
                <span className="text-[10px] text-slate-400 leading-tight truncate max-w-[130px]">
                  {user.email}
                </span>
              </div>

              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs border border-indigo-200">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  (profile?.displayName || user.displayName || user.email || 'U')[0].toUpperCase()
                )}
              </div>

              <button
                onClick={logout}
                title="Sign out"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
