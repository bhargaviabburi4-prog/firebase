import React, { useState } from 'react';
import { ShieldCheck, ExternalLink, HelpCircle, ChevronDown, ChevronUp, Copy, Check, Sparkles } from 'lucide-react';
import { firebaseConfig } from '../firebase';

export const FirebaseStatusBanner: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(firebaseConfig, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto mb-6 bg-slate-900/5 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-3.5 transition-all text-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <div className="flex items-center gap-1.5 font-medium text-slate-800 text-xs sm:text-sm">
              <span>Connected to Firebase:</span>
              <span className="font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-xs">
                {firebaseConfig.projectId}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          {expanded ? 'Hide Info' : 'Config Details'}
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-200/60 space-y-2.5 text-xs text-slate-600">
          <div className="grid grid-cols-2 gap-2 bg-white/70 p-2.5 rounded-xl border border-slate-100">
            <div>
              <span className="text-[11px] text-slate-400 block">Auth Domain</span>
              <span className="font-mono text-[11px] text-slate-700 truncate block">{firebaseConfig.authDomain}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">App ID</span>
              <span className="font-mono text-[11px] text-slate-700 truncate block">{firebaseConfig.appId}</span>
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-2.5 text-amber-800 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[11px]">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Tip for new Firebase projects:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-700">
              In Firebase Console under <strong>Authentication &gt; Sign-in method</strong>, ensure <strong>Google</strong> and <strong>Email/Password</strong> providers are toggled to <strong>Enabled</strong>. Under <strong>Settings &gt; Authorized domains</strong>, make sure your hosting domain is listed.
            </p>
            <a
              href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/providers`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-900 underline hover:text-amber-950 mt-1"
            >
              Open Firebase Auth Console <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">Credentials loaded securely</span>
            <button
              onClick={copyConfig}
              className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied JSON' : 'Copy Config'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
