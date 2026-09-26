import React, { useState } from 'react';
import {
  User,
  LogOut,
  Mail,
  Shield,
  CheckCircle,
  AlertTriangle,
  Copy,
  Check,
  Calendar,
  Building,
  Phone,
  FileText,
  Plus,
  Trash2,
  ExternalLink,
  Save,
  Key,
  Database,
  Search,
  Tag,
  Clock,
  Sparkles,
  Loader2,
  Settings,
  Lock,
} from 'lucide-react';
import { useAuth, UserNote } from '../context/AuthContext';
import { firebaseConfig } from '../firebase';

export const Dashboard: React.FC = () => {
  const {
    user,
    profile,
    notes,
    logout,
    sendVerificationEmail,
    updateUserProfileData,
    addNote,
    deleteNote,
    resetPassword,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'workspace' | 'profile' | 'firebase'>('workspace');
  const [copiedUid, setCopiedUid] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Profile Edit State
  const [displayName, setDisplayName] = useState(profile?.displayName || user?.displayName || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [organization, setOrganization] = useState(profile?.organization || '');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // New Note State
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState<UserNote['category']>('personal');
  const [addingNote, setAddingNote] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Password reset inside profile
  const [sendingReset, setSendingReset] = useState(false);

  const copyUid = () => {
    if (user?.uid) {
      navigator.clipboard.writeText(user.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  const handleSendVerification = async () => {
    try {
      setVerifyingEmail(true);
      await sendVerificationEmail();
      setVerificationSent(true);
      setStatusMessage('Verification email sent! Check your inbox or spam folder.');
    } catch (e: any) {
      setStatusMessage(e.message || 'Failed to dispatch verification email.');
    } finally {
      setVerifyingEmail(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      await updateUserProfileData({
        displayName: displayName.trim(),
        bio: bio.trim(),
        organization: organization.trim(),
        phoneNumber: phoneNumber.trim(),
      });
      setStatusMessage('Profile updated successfully!');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      setStatusMessage(err.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    try {
      setAddingNote(true);
      await addNote({
        title: noteTitle.trim(),
        content: noteContent.trim(),
        category: noteCategory,
      });
      setNoteTitle('');
      setNoteContent('');
      setStatusMessage('Note stored to your Firebase Firestore records!');
      setTimeout(() => setStatusMessage(null), 2500);
    } catch (err: any) {
      setStatusMessage(err.message || 'Failed to add note.');
    } finally {
      setAddingNote(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      setSendingReset(true);
      await resetPassword(user.email);
      setStatusMessage(`Password reset email sent to ${user.email}`);
    } catch (err: any) {
      setStatusMessage(err.message || 'Failed to trigger password reset.');
    } finally {
      setSendingReset(false);
    }
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryColor = (cat: UserNote['category']) => {
    switch (cat) {
      case 'work':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'important':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'idea':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Top Profile Banner */}
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-md rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white font-bold text-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                (profile?.displayName || user?.displayName || user?.email || 'U')[0].toUpperCase()
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {profile?.displayName || user?.displayName || 'Registered Member'}
                </h1>
                
                {user?.providerData?.some((p) => p.providerId === 'google.com') ? (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-white text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                    <svg className="w-3 h-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Google Account
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                    <Lock className="w-3 h-3 text-slate-500" />
                    Email Account
                  </span>
                )}

                {user?.emailVerified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    Verified Email
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    Unverified
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 font-medium">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{user?.email}</span>
              </p>

              <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
                <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                  UID: {user?.uid.slice(0, 12)}...
                </span>
                <button
                  onClick={copyUid}
                  className="hover:text-indigo-600 inline-flex items-center gap-1 text-[11px]"
                  title="Copy User UID"
                >
                  {copiedUid ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedUid ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            {!user?.emailVerified && !verificationSent && (
              <button
                onClick={handleSendVerification}
                disabled={verifyingEmail}
                className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {verifyingEmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                <span>Verify Email</span>
              </button>
            )}

            <button
              onClick={logout}
              className="py-2.5 px-4 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Status alert message */}
        {statusMessage && (
          <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs text-indigo-900 flex items-center justify-between animate-in fade-in">
            <span>{statusMessage}</span>
            <button onClick={() => setStatusMessage(null)} className="text-indigo-600 font-bold ml-2">
              ×
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 mt-6 -mb-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('workspace')}
            className={`py-2.5 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'workspace'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Workspace & Notes ({notes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2.5 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Edit Profile & Security</span>
          </button>

          <button
            onClick={() => setActiveTab('firebase')}
            className={`py-2.5 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'firebase'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Firebase Config & Console</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Workspace & Cloud Notes */}
      {activeTab === 'workspace' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* New Note Form */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Create Record</span>
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Saved directly to your private Firebase Firestore path: <code className="text-indigo-600">users/{'{uid}'}/notes</code>
            </p>

            <form onSubmit={handleAddNote} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. Project onboarding notes"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value as UserNote['category'])}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="personal">Personal</option>
                  <option value="work">Work & Tasks</option>
                  <option value="idea">Idea & Brainstorm</option>
                  <option value="important">Important / Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Content</label>
                <textarea
                  rows={4}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Enter details, thoughts, or information..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={addingNote || !noteTitle.trim()}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
              >
                {addingNote ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                <span>Add Record</span>
              </button>
            </form>
          </div>

          {/* Notes List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search user records..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <span className="text-xs text-slate-400 self-center px-1">
                {filteredNotes.length} {filteredNotes.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {filteredNotes.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-800 text-sm">No workspace items yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Add your first cloud note or task using the form on the left. It will be stored in your private Firestore collection under your UID.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getCategoryColor(
                            note.category
                          )}`}
                        >
                          {note.category}
                        </span>

                        <button
                          onClick={() => deleteNote(note.id)}
                          className="opacity-60 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
                          title="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                        {note.title}
                      </h4>
                      <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {note.id.startsWith('local_') ? 'Pending Sync' : 'Firestore Synced'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Edit Profile & Security */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Details Form */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Account Details</span>
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Update your public display information and organizational profile.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="text"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Managed via Firebase Authentication
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Organization / Team
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Acme Corp, Independent, etc."
                    className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bio / Headline
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Short bio or description..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Profile Changes</span>
              </button>
            </form>
          </div>

          {/* Security & Auth Settings */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Security & Credentials</span>
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                Manage access security and authentication credentials.
              </p>

              <div className="space-y-4">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">Authentication Method</span>
                    <span className="font-mono text-indigo-600 font-medium">
                      {user?.providerData[0]?.providerId === 'google.com' ? 'Google OAuth' : 'Email & Password'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Your account is securely managed by Firebase Auth on the web client.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">Password Management</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Trigger an official Firebase password reset email to update your credentials securely.
                  </p>
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    disabled={sendingReset}
                    className="py-1.5 px-3 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {sendingReset ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5 text-indigo-600" />}
                    <span>Send Password Reset Email</span>
                  </button>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">User Identification</span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-600 break-all bg-white p-2 rounded-lg border border-slate-200">
                    {user?.uid}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Firebase Config & Diagnostics */}
      {activeTab === 'firebase' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600" />
              <span>Active Firebase Configuration</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              These credentials are active and initialized for this application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Project ID</span>
              <span className="font-mono text-sm font-bold text-indigo-600">{firebaseConfig.projectId}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Auth Domain</span>
              <span className="font-mono text-sm text-slate-800">{firebaseConfig.authDomain}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 block mb-1">Storage Bucket</span>
              <span className="font-mono text-sm text-slate-800">{firebaseConfig.storageBucket}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 block mb-1">App ID</span>
              <span className="font-mono text-sm text-slate-800">{firebaseConfig.appId}</span>
            </div>
          </div>

          {/* Direct Firebase Console Shortcuts */}
          <div className="p-5 bg-gradient-to-r from-indigo-50/70 to-purple-50/70 border border-indigo-100 rounded-2xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-2">
              Firebase Console Management Links
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <a
                href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/users`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white border border-indigo-100 hover:border-indigo-300 rounded-xl text-xs font-semibold text-indigo-700 flex items-center justify-between hover:shadow-xs transition-all"
              >
                <span>View Registered Users</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/providers`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white border border-indigo-100 hover:border-indigo-300 rounded-xl text-xs font-semibold text-indigo-700 flex items-center justify-between hover:shadow-xs transition-all"
              >
                <span>Auth Sign-In Methods</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white border border-indigo-100 hover:border-indigo-300 rounded-xl text-xs font-semibold text-indigo-700 flex items-center justify-between hover:shadow-xs transition-all"
              >
                <span>Firestore Database</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
