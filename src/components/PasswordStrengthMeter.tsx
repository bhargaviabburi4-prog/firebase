import React from 'react';
import { Check, X } from 'lucide-react';

interface Props {
  password: string;
}

export const PasswordStrengthMeter: React.FC<Props> = ({ password }) => {
  const hasLength = password.length >= 8;
  const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const score = [hasLength, hasMixedCase, hasNumbers, hasSpecial].filter(Boolean).length;

  const getStrengthMeta = () => {
    if (!password) return { label: 'Enter password', color: 'bg-slate-200 dark:bg-slate-700', text: 'text-slate-400', width: '0%' };
    if (score === 1) return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-500', width: '25%' };
    if (score === 2) return { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-500', width: '50%' };
    if (score === 3) return { label: 'Good', color: 'bg-blue-500', text: 'text-blue-500', width: '75%' };
    return { label: 'Strong & Secure', color: 'bg-emerald-500', text: 'text-emerald-500', width: '100%' };
  };

  const meta = getStrengthMeta();

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2 text-xs">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">Security strength:</span>
        <span className={`font-semibold ${meta.text}`}>{meta.label}</span>
      </div>

      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${meta.color}`}
          style={{ width: meta.width }}
        />
      </div>

      <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          {hasLength ? (
            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          ) : (
            <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          )}
          <span className={hasLength ? 'text-slate-700 font-medium' : ''}>8+ characters</span>
        </div>
        <div className="flex items-center gap-1.5">
          {hasMixedCase ? (
            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          ) : (
            <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          )}
          <span className={hasMixedCase ? 'text-slate-700 font-medium' : ''}>Upper & lower case</span>
        </div>
        <div className="flex items-center gap-1.5">
          {hasNumbers ? (
            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          ) : (
            <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          )}
          <span className={hasNumbers ? 'text-slate-700 font-medium' : ''}>At least one number</span>
        </div>
        <div className="flex items-center gap-1.5">
          {hasSpecial ? (
            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          ) : (
            <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          )}
          <span className={hasSpecial ? 'text-slate-700 font-medium' : ''}>Special symbol</span>
        </div>
      </div>
    </div>
  );
};
