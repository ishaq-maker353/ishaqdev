import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X, Shield, Sparkles, MoreVertical, User as UserIcon, LogOut, ShoppingBag, LogIn } from 'lucide-react';
import { User, signOut, auth } from '../lib/firebase';

interface NavbarProps {
  activePage: string;
  onNavigate: (pageId: string) => void;
  onOpenAdmin: () => void;
  onOpenOrder: (planName?: string) => void;
  onOpenAuth: () => void;
  onOpenMyOrders: () => void;
  currentUser: User | null;
  isAdminAuthenticated?: boolean;
  developerEmail?: string;
  logoImage?: string;
  isAvailable?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  onOpenAdmin,
  onOpenOrder,
  onOpenAuth,
  onOpenMyOrders,
  currentUser,
  isAdminAuthenticated = false,
  developerEmail = 'ishaqahmed.dev@gmail.com',
  logoImage,
  isAvailable = true,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine if the logged in user is Admin (strictly via PIN authentication)
  const isAdminUser = Boolean(isAdminAuthenticated);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Sign out error:', e);
    }
    localStorage.removeItem('ishaq_client_user');
    localStorage.removeItem('ishaq_admin_authenticated');
    window.location.reload();
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Projects', id: 'projects' },
    { name: 'Services', id: 'services' },
    { name: 'Skills', id: 'skills' },
    { name: 'Pricing', id: 'pricing' },
    { name: 'Reviews', id: 'reviews' },
    { name: 'Contact', id: 'contact' },
    { name: 'CV / Resume', id: 'resume' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-sky-100 py-3 shadow-md shadow-sky-100/50'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <button onClick={() => onNavigate('home')} className="focus:outline-none text-left">
          <Logo logoImage={logoImage} />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 bg-sky-50/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-sky-100 shadow-xs">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold shadow-md shadow-sky-500/20'
                    : 'text-slate-600 hover:text-sky-600 hover:bg-sky-100/60'
                }`}
              >
                {link.name}
              </button>
            );
          })}
        </nav>

        {/* Action & Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          
          {/* User / Admin Authentication State */}
          {currentUser || isAdminAuthenticated ? (
            <div className="flex items-center gap-2">
              
              {/* If Admin logged in: Show Admin Panel Button */}
              {isAdminUser ? (
                <button
                  onClick={onOpenAdmin}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-sky-500/20 cursor-pointer"
                  title="Open Admin Dashboard & Full Control Panel"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-300" />
                  <span>Admin Dashboard (এডমিন ড্যাশবোর্ড)</span>
                </button>
              ) : (
                /* Normal User logged in: Show Client Dashboard Button */
                <button
                  onClick={onOpenMyOrders}
                  className="px-3 py-2 rounded-xl bg-sky-100 hover:bg-sky-200/80 text-sky-800 text-xs font-bold transition-all flex items-center gap-1.5 border border-sky-200 cursor-pointer"
                  title="View My Profile & Ordered Plans"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-sky-600" />
                  <span>Client Dashboard (মাই ড্যাশবোর্ড)</span>
                </button>
              )}

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                {currentUser?.photoURL ? (
                  <img src={currentUser.photoURL} alt="Avatar" className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <UserIcon className="w-4 h-4 text-sky-600" />
                )}
                <span className="font-semibold text-slate-700 max-w-[110px] truncate">
                  {isAdminUser ? 'Admin' : (currentUser?.displayName || currentUser?.email?.split('@')[0])}
                </span>
                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold border border-sky-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-sky-600" />
              <span>Login / Order</span>
            </button>
          )}

          {/* Admin Shield Portal Login Button */}
          {!isAdminUser && (
            <button
              onClick={onOpenAdmin}
              title="Admin Portal"
              className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl border border-sky-100 transition-all duration-200 group relative cursor-pointer"
            >
              <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          )}

          {/* Hire Me CTA Button */}
          <button
            onClick={() => onOpenOrder()}
            className="relative group inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl font-semibold text-xs lg:text-sm text-white bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 shadow-md shadow-sky-500/25 transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-white animate-spin" style={{ animationDuration: '6s' }} />
            <span>Hire Me</span>
            {isAvailable && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
            )}
          </button>
        </div>

        {/* Mobile / Touch Hamburger & 3-Dots Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          {isAdminUser ? (
            <button
              onClick={onOpenAdmin}
              className="p-2 text-amber-600 bg-amber-50 rounded-xl border border-amber-200 font-bold text-xs flex items-center gap-1"
              title="Admin Panel"
            >
              <Shield className="w-4 h-4 text-sky-600" />
            </button>
          ) : currentUser ? (
            <button
              onClick={onOpenMyOrders}
              className="p-2 text-sky-600 bg-sky-50 rounded-xl border border-sky-200"
              title="My Profile & Orders"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onOpenAdmin}
              title="Admin Portal"
              className="p-2 text-slate-400 hover:text-sky-600 bg-sky-50 rounded-xl border border-sky-100"
            >
              <Shield className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            title="Menu Sections"
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-sky-50 border border-sky-100 focus:outline-none flex items-center gap-1 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-sky-600" /> : <MoreVertical className="w-5 h-5 text-sky-600" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 border-b border-sky-100 px-4 pt-3 pb-6 space-y-3 backdrop-blur-xl animate-in slide-in-from-top duration-300 shadow-xl">
          
          {!currentUser && !isAdminUser ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Login to Track Orders / Profile</span>
            </button>
          ) : (
            <div className="flex flex-col gap-2 p-3 rounded-2xl bg-sky-50 border border-sky-100 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-sky-600" />
                  <span className="font-bold text-slate-800">
                    {isAdminUser ? 'Admin Panel (এডমিন)' : (currentUser?.displayName || currentUser?.email)}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                >
                  Sign Out (লগআউট)
                </button>
              </div>

              {/* Special options in 3-dots drawer */}
              {isAdminUser ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full mt-1 py-2 px-3 rounded-xl bg-sky-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-amber-300" />
                  <span>Admin Dashboard (এডমিন ড্যাশবোর্ড)</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenMyOrders();
                  }}
                  className="w-full mt-1 py-2 px-3 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold text-xs flex items-center justify-center gap-2 border border-sky-200 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-sky-600" />
                  <span>Client Dashboard (মাই ড্যাশবোর্ড & অর্ডার)</span>
                </button>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-sky-100">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate(link.id);
                  }}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-sky-500 text-white font-bold'
                      : 'text-slate-600 hover:text-sky-600 hover:bg-sky-50'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrder();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-sky-500 to-cyan-500 shadow-md shadow-sky-500/20"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Hire Ishaq Ahmed</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
