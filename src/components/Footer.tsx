import React from 'react';
import { SiteConfig } from '../types';
import { Logo } from './Logo';
import { ArrowUp, Github, Mail, MessageSquare } from 'lucide-react';

interface FooterProps {
  config: SiteConfig;
  onOpenOrder: () => void;
  onOpenAdmin: () => void;
  onNavigate?: (pageId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onOpenOrder, onOpenAdmin, onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { name: 'Home & Overview', id: 'home' },
    { name: 'About Ishaq Ahmed', id: 'about' },
    { name: 'Featured Projects', id: 'projects' },
    { name: 'Services & Solutions', id: 'services' },
    { name: 'Skills & Expertise', id: 'skills' },
    { name: 'Pricing Packages', id: 'pricing' },
    { name: 'Client Reviews', id: 'reviews' },
    { name: 'Contact & Order', id: 'contact' },
    { name: 'Official CV / Resume', id: 'resume' },
  ];

  return (
    <footer className="bg-sky-50/90 border-t border-sky-100 pt-16 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-sky-200">
          
          {/* Brand & Bio Column */}
          <div className="md:col-span-5 space-y-4">
            <Logo logoImage={config.logoImage} />
            
            <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
              High-performance, ultra-modern developer portfolio & service agency website. Specializing in full stack web applications, e-commerce stores, and custom business software.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-500 font-mono">bKash Accepted:</span>
              <span className="text-xs font-mono font-bold text-pink-700 bg-pink-100 px-2 py-0.5 rounded border border-pink-200">
                {config.bkashNumber}
              </span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase font-bold text-slate-800 tracking-wider">Pages Navigation</h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      if (onNavigate) onNavigate(item.id);
                      else window.location.hash = item.id;
                    }}
                    className="hover:text-sky-700 transition-colors text-left font-medium cursor-pointer"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Direct Contact */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono uppercase font-bold text-slate-800 tracking-wider">Connect & Hire</h4>
            <div className="flex flex-wrap gap-2">
              <a
                href={config.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white border border-sky-200 text-slate-600 hover:text-sky-700 transition-colors shadow-xs"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>

              <a
                href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white border border-sky-200 text-slate-600 hover:text-emerald-600 transition-colors shadow-xs"
                title="WhatsApp Direct"
              >
                <MessageSquare className="w-4 h-4" />
              </a>

              <a
                href={`mailto:${config.email}`}
                className="p-2.5 rounded-xl bg-white border border-sky-200 text-slate-600 hover:text-sky-700 transition-colors shadow-xs"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            <button
              onClick={onOpenOrder}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold text-xs shadow-md shadow-sky-500/10 cursor-pointer"
            >
              Start a Project Together
            </button>
          </div>

        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} <strong className="text-slate-800">ISHAQ AHMED</strong>. Built with React, Tailwind CSS, Firebase & Node.js.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="hover:text-sky-700 transition-colors text-[11px] font-mono cursor-pointer font-bold"
            >
              [ Admin Portal ]
            </button>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-white border border-sky-200 text-slate-600 hover:text-sky-700 transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
              title="Back to top"
            >
              <span>Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
