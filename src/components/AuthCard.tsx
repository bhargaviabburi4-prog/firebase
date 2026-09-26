import React, { useState, useEffect } from 'react';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ExternalLink,
  Shield,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatFirebaseAuthError, firebaseConfig } from '../firebase';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';

type AuthMode = 'signin' | 'register' | 'forgot-password';

export const AuthCard: React.FC = () => {
  const { loginWithEmail, registerWithEmail, loginWithGoogle, resetPassword } = useAuth();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [configHelpUrl, setConfigHelpUrl] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [copiedHost, setCopiedHost] = useState(false);

  const copyCurrentHost = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.hostname);
      setCopiedHost(true);
      setTimeout(() => setCopiedHost(false), 2000);
    }
  };

  // Load remembered email
  useEffect(() => {
    const savedEmail = localStorage.getItem('saved_auth_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const clearMessages = () => {
    setErrorMessage(null);
    setConfigHelpUrl(null);
    setSuccessNotice(null);
  };

  const handleTabChange = (newMode: AuthMode) => {
    setMode(newMode);
    clearMessages();
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!email.trim()) {
      setErrorMessage('Please enter an email address.');
      return;
    }

    if (mode === 'forgot-password') {
      try {
        setLoading(true);
        await resetPassword(email);
        setSuccessNotice(`A password reset link has been dispatched to ${email}. Please check your inbox or spam folder.`);
      } catch (err: any) {
        const formatted = formatFirebaseAuthError(err);
        setErrorMessage(formatted.message);
        if (formatted.actionUrl) setConfigHelpUrl(formatted.actionUrl);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (mode === 'register') {
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter your password.');
        return;
      }
      if (!agreeTerms) {
        setErrorMessage('Please agree to the Terms of Service and Privacy Policy to register.');
        return;
      }

      try {
        setLoading(true);
        await registerWithEmail(email, password, displayName);
        if (rememberMe) {
          localStorage.setItem('saved_auth_email', email.trim());
        }
      } catch (err: any) {
        const formatted = formatFirebaseAuthError(err);
        setErrorMessage(formatted.message);
        if (formatted.actionUrl) setConfigHelpUrl(formatted.actionUrl);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Sign in mode
    try {
      setLoading(true);
      await loginWithEmail(email, password);
      if (rememberMe) {
        localStorage.setItem('saved_auth_email', email.trim());
      } else {
        localStorage.removeItem('saved_auth_email');
      }
    } catch (err: any) {
      const formatted = formatFirebaseAuthError(err);
      setErrorMessage(formatted.message);
      if (formatted.actionUrl) setConfigHelpUrl(formatted.actionUrl);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    clearMessages();
    try {
      setGoogleLoading(true);
      await loginWithGoogle();
    } catch (err: any) {
      const formatted = formatFirebaseAuthError(err);
      setErrorMessage(formatted.message);
      if (formatted.actionUrl) setConfigHelpUrl(formatted.actionUrl);
    } finally {
      setGoogleLoading(false);
    }
  };

  const fillQuickTest = (role: 'alice' | 'bob') => {
    clearMessages();
    if (role === 'alice') {
      setEmail('alice.demo@example.com');
      setPassword('SecureDemo123!');
      setDisplayName('Alice Cooper');
      setConfirmPassword('SecureDemo123!');
    } else {
      setEmail('developer@example.com');
      setPassword('DevPassword99#');
      setDisplayName('Dev User');
      setConfirmPassword('DevPassword99#');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Container Card */}
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden transition-all duration-300">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 p-1.5 gap-1">
          <button
            type="button"
            onClick={() => handleTabChange('signin')}
            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signin'
                ? 'bg-white text-slate-900 shadow-sm shadow-slate-200/80 border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
            }`}
          >
            <span>Sign In</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleTabChange('register')}
            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-white text-slate-900 shadow-sm shadow-slate-200/80 border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Create Account</span>
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {mode === 'signin' && 'Welcome back'}
              {mode === 'register' && 'Register your account'}
              {mode === 'forgot-password' && 'Reset your password'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {mode === 'signin' && 'Enter your credentials to access your workspace'}
              {mode === 'register' && 'Join now with Firebase secure authentication'}
              {mode === 'forgot-password' && "We'll send you a secure link to reset your credentials"}
            </p>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/70 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1.5 flex-1">
                <p className="font-medium leading-relaxed">{errorMessage}</p>
                {configHelpUrl && (
                  <div className="pt-1 flex flex-wrap items-center gap-2">
                    <a
                      href={configHelpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-rose-900 underline hover:text-rose-950"
                    >
                      Open Firebase Console Settings <ExternalLink className="w-3 h-3" />
                    </a>
                    {errorMessage.includes('Authorized domains') && typeof window !== 'undefined' && (
                      <button
                        type="button"
                        onClick={copyCurrentHost}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold bg-rose-100 hover:bg-rose-200 text-rose-900 px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                      >
                        {copiedHost ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedHost ? 'Copied Hostname!' : `Copy: ${window.location.hostname}`}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Success Notice */}
          {successNotice && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="font-medium leading-relaxed">{successNotice}</p>
            </div>
          )}

          {/* Google Sign-in Button (Shown for Login & Register) */}
          {mode !== 'forgot-password' && (
            <div className="mb-6">
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={googleLoading || loading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border-2 border-slate-200/90 bg-white hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] text-slate-800 text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                {googleLoading ? (
                  <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                ) : (
                  <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </div>
                )}
                <span className="font-semibold text-slate-800">
                  {mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
                </span>
                <span className="hidden sm:inline-block text-[11px] text-slate-400 font-normal">
                  (One-Click)
                </span>
              </button>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider text-[11px]">
                    or continue with email
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            
            {/* Full Name (Registration only) */}
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Full Name / Display Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
                />
              </div>
            </div>

            {/* Password (Sign In & Register) */}
            {mode !== 'forgot-password' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => handleTabChange('forgot-password')}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'register' ? 'Create a strong password' : 'Enter your password'}
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter (Registration) */}
                {mode === 'register' && <PasswordStrengthMeter password={password} />}
              </div>
            )}

            {/* Confirm Password (Registration only) */}
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-[11px] text-rose-500 font-medium">Passwords do not match yet.</p>
                )}
                {confirmPassword && password === confirmPassword && (
                  <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match!
                  </p>
                )}
              </div>
            )}

            {/* Checkbox Options */}
            {mode === 'signin' && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <span>Remember my email</span>
                </label>
              </div>
            )}

            {mode === 'register' && (
              <div className="text-xs pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 mt-0.5 shrink-0"
                  />
                  <span className="text-[11px] leading-snug">
                    I agree to the <span className="text-indigo-600 font-medium hover:underline">Terms of Service</span> and acknowledge privacy protection.
                  </span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'signin' && 'Sign In to Account'}
                    {mode === 'register' && 'Register New Account'}
                    {mode === 'forgot-password' && 'Send Reset Email'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Test Pre-fill Assist */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-medium">Quick Test Autofill:</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">Development Aid</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillQuickTest('alice')}
                className="flex-1 text-[11px] py-1.5 px-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 rounded-lg text-slate-600 transition-colors font-medium truncate"
              >
                Test: Alice Cooper
              </button>
              <button
                type="button"
                onClick={() => fillQuickTest('bob')}
                className="flex-1 text-[11px] py-1.5 px-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 rounded-lg text-slate-600 transition-colors font-medium truncate"
              >
                Test: Dev User
              </button>
            </div>
          </div>

          {/* Mode Switch Footers */}
          <div className="mt-5 text-center text-xs text-slate-500">
            {mode === 'signin' && (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => handleTabChange('register')}
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Create one now
                </button>
              </p>
            )}

            {mode === 'register' && (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleTabChange('signin')}
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}

            {mode === 'forgot-password' && (
              <p>
                Remembered your password?{' '}
                <button
                  type="button"
                  onClick={() => handleTabChange('signin')}
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Return to Sign In
                </button>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
