import React, { useState } from 'react';
import { X, LogIn, UserPlus, Sparkles, Mail, Lock, User as UserIcon, Zap, CheckCircle2 } from 'lucide-react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  db,
  doc,
  setDoc
} from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [authTab, setAuthTab] = useState<'firebase' | 'instant'>('firebase');
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Instant guest fields
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const parseFirebaseError = (err: any) => {
    const code = err?.code || '';
    const msg = err?.message || '';

    if (code === 'auth/unauthorized-domain' || msg.includes('unauthorized-domain')) {
      return '⚠️ Firebase Domain Error: আপনার এই সাইট ডোমেইনটি (যেমন netlify.app) Firebase Console-এ যোগ করা নেই। Firebase Console > Auth > Settings > Authorized domains-এ যুক্ত করুন। অথবা পাশের "সহজ ইনস্ট্যান্ট প্রবেশ" ট্যাব ব্যবহার করুন।';
    }
    if (code === 'auth/popup-closed-by-user' || code === 'auth/popup-blocked') {
      return '⚠️ গুগল লগইন পপআপ বন্ধ হয়ে গেছে বা ব্রাউজারে ব্লক করা হয়েছে। আবার চেষ্টা করুন বা "সহজ ইনস্ট্যান্ট প্রবেশ" ব্যবহার করুন।';
    }
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
      return '❌ ইমেইল বা পাসওয়ার্ড সঠিক নয়। একাউন্ট না থাকলে "Create Account" এ ক্লিক করে একাউন্ট খুলুন।';
    }
    if (code === 'auth/email-already-in-use') {
      return '⚠️ এই ইমেইল দিয়ে ইতোমধ্যে একাউন্ট খোলা আছে। "Client Login" দিয়ে সাইন ইন করুন।';
    }
    if (code === 'auth/weak-password') {
      return '⚠️ পাসওয়ার্ডটি অন্তত ৬ অক্ষরের হতে হবে।';
    }
    if (code === 'auth/operation-not-allowed') {
      return '⚠️ Firebase Console-এ Sign-in Provider অন করা নেই।';
    }
    return msg || 'Authentication failed. Please try again.';
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || name || 'Client User',
        photoURL: user.photoURL || '',
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem('ishaq_client_user', JSON.stringify(userData));

      // Save user to Firestore
      await setDoc(doc(db, 'users', user.uid), userData, { merge: true });

      setLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setLoading(false);
      setError(parseFirebaseError(err));
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: name || 'Client User',
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('ishaq_client_user', JSON.stringify(userData));
        await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
      } else {
        const res = await signInWithEmailAndPassword(auth, email, password);
        const user = res.user;
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Client User',
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('ishaq_client_user', JSON.stringify(userData));
      }

      setLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setLoading(false);
      setError(parseFirebaseError(err));
    }
  };

  const handleInstantGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    setLoading(true);
    setError('');

    try {
      const guestUid = 'client-' + Date.now();
      const guestData = {
        uid: guestUid,
        email: guestEmail.trim() || `${guestName.toLowerCase().replace(/\s+/g, '')}@client.local`,
        displayName: guestName.trim(),
        photoURL: '',
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem('ishaq_client_user', JSON.stringify(guestData));
      
      try {
        await setDoc(doc(db, 'users', guestUid), guestData, { merge: true });
      } catch (fErr) {
        console.warn('Firestore guest sync note:', fErr);
      }

      setLoading(false);
      if (onSuccess) onSuccess();
      onClose();
      window.location.reload();
    } catch (err: any) {
      setLoading(false);
      setError('Instant Login Error: ' + (err.message || 'Failed'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white max-w-md w-full rounded-3xl border border-sky-100 shadow-2xl overflow-hidden p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sky-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800">
                {authTab === 'instant' ? 'Instant Client Entry' : (isRegister ? 'Create Account' : 'Client Login')}
              </h3>
              <p className="text-xs text-sky-600 font-medium">
                {authTab === 'instant' ? 'সরাসরি নাম দিয়ে প্রবেশ করুন (পাসওয়ার্ড ছাড়া)' : (isRegister ? 'Join to order packages & track requests' : 'Sign in to access your orders & messages')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-sky-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Mode Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-slate-100 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setAuthTab('firebase'); setError(''); }}
            className={`py-2 rounded-xl transition-all ${authTab === 'firebase' ? 'bg-white text-sky-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Google / Email Login
          </button>
          <button
            type="button"
            onClick={() => { setAuthTab('instant'); setError(''); }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${authTab === 'instant' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>ইনস্ট্যান্ট প্রবেশ</span>
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium leading-relaxed">
            {error}
          </div>
        )}

        {authTab === 'firebase' ? (
          <>
            {/* Google One-Click Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span>Continue with Google</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-sky-100"></div>
              <span className="flex-shrink mx-3 text-slate-400 text-[11px] font-mono">OR EMAIL</span>
              <div className="flex-grow border-t border-sky-100"></div>
            </div>

            {/* Email Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-3">
              {isRegister && (
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Your Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanvir Hossain"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-slate-50 border border-sky-100 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-slate-50 border border-sky-100 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-slate-50 border border-sky-100 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                <span>{loading ? 'Processing...' : isRegister ? 'Register Account' : 'Sign In'}</span>
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="text-center pt-2 border-t border-sky-100">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                }}
                className="text-xs text-sky-600 hover:text-sky-800 font-semibold cursor-pointer"
              >
                {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register here"}
              </button>
            </div>
          </>
        ) : (
          /* Instant Guest Login Form */
          <form onSubmit={handleInstantGuestLogin} className="space-y-4">
            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-sky-800 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                <span>কোন পাসওয়ার্ড লাগবে না!</span>
              </div>
              <p className="text-[11px] text-sky-700">
                শুধু আপনার নাম দিন। সরাসরি ক্লায়েন্ট প্যানেলে ঢোকা যাবে এবং অর্ডার ট্র্যাক করা যাবে।
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">আপনার নাম (Full Name) *</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="যেমন: তানভীর হোসেন"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-slate-50 border border-sky-100 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">ইমেইল বা ফোন নম্বর (ঐচ্ছিক)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="017xxxxxxxx or client@gmail.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-slate-50 border border-sky-100 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !guestName.trim()}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{loading ? 'প্রবেশ করা হচ্ছে...' : 'সরাসরি প্রবেশ করুন'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
