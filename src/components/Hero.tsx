import React from 'react';
import { SiteConfig } from '../types';
import { Github, Mail, MessageSquare, ArrowRight, Code, Sparkles, CheckCircle2, Download } from 'lucide-react';

interface HeroProps {
  config: SiteConfig;
  onOpenOrder: () => void;
  onOpenResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ config, onOpenOrder, onOpenResume }) => {
  return (
    <section id="home" className="relative min-h-screen pt-28 pb-16 md:pt-36 md:pb-24 flex items-center justify-center overflow-hidden bg-soft-grid bg-radial-ice">
      {/* Ambient soft glow background elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Availability Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold tracking-wide shadow-xs backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
              </span>
              <span>Available for Freelance & Contract Work</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-slate-900">
                Building <span className="text-gradient-cyan">Modern Web</span> Experiences Through Code
              </h1>
              <p className="text-sm sm:text-base text-slate-900 font-mono font-extrabold bg-sky-100/80 px-3 py-1 rounded-lg border border-sky-200 inline-block">
                Ishaq Ahmed &bull; Full Stack Web Developer &bull; Bangladesh
              </p>
            </div>

            {/* Subtitle */}
            <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Specializing in high-performance web applications, modern responsive UI, and custom backend systems built with React, Node.js, Tailwind CSS, Firebase, and MongoDB.
            </p>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#projects"
                className="px-6 py-3 rounded-2xl bg-white text-slate-800 border border-sky-200 hover:border-sky-400 font-semibold text-sm hover:bg-sky-50 transition-all duration-300 shadow-sm flex items-center gap-2 group cursor-pointer"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4 text-sky-600 group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                onClick={onOpenOrder}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold text-sm hover:from-sky-600 hover:to-cyan-600 transition-all duration-300 shadow-md shadow-sky-500/20 flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Get in Touch / Hire</span>
              </button>

              <button
                onClick={onOpenResume}
                className="px-4 py-3 rounded-2xl bg-sky-50 text-sky-900 border border-sky-200 hover:bg-sky-100 font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-sky-600" />
                <span>View CV / Resume</span>
              </button>
            </div>

            {/* Social Links Row */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-3">
              <span className="text-xs text-slate-500 font-medium mr-2 hidden sm:inline">Connect:</span>
              
              <a
                href={config.github}
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub Profile"
                className="p-2.5 rounded-2xl bg-white border border-sky-100 text-slate-600 hover:text-sky-600 hover:border-sky-300 transition-all shadow-xs"
              >
                <Github className="w-4 h-4" />
              </a>

              <a
                href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp Direct"
                className="p-2.5 rounded-2xl bg-white border border-sky-100 text-slate-600 hover:text-emerald-600 hover:border-emerald-300 transition-all shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
              </a>

              <a
                href={`mailto:${config.email}`}
                title="Send Email"
                className="p-2.5 rounded-2xl bg-white border border-sky-100 text-slate-600 hover:text-sky-600 hover:border-sky-300 transition-all shadow-xs"
              >
                <Mail className="w-4 h-4" />
              </a>

              <a
                href={`https://tiktok.com/${config.tiktok}`}
                target="_blank"
                rel="noopener noreferrer"
                title="TikTok @ishaq.dev"
                className="px-3 py-2 rounded-2xl bg-white border border-sky-100 text-xs font-mono text-slate-600 hover:text-sky-600 hover:border-sky-300 transition-all shadow-xs flex items-center gap-1.5"
              >
                <span>TikTok</span>
                <span className="text-sky-600 font-bold">{config.tiktok}</span>
              </a>
            </div>

            {/* Quick Counter Stats Card */}
            <div className="pt-6 grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0">
              <div className="glass-card p-3 rounded-2xl border border-sky-100 text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-sky-600">{config.experienceYears}</div>
                <div className="text-[11px] sm:text-xs text-slate-600 font-medium">Years Experience</div>
              </div>

              <div className="glass-card p-3 rounded-2xl border border-sky-100 text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{config.completedProjects}</div>
                <div className="text-[11px] sm:text-xs text-slate-600 font-medium">Projects Built</div>
              </div>

              <div className="glass-card p-3 rounded-2xl border border-sky-100 text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-sky-600">{config.happyClients}</div>
                <div className="text-[11px] sm:text-xs text-slate-600 font-medium">Happy Clients</div>
              </div>
            </div>

          </div>

          {/* Right Column: Profile Picture */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
              
              {/* Animated Halo Ring */}
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-sky-300 via-teal-200 to-sky-300 opacity-60 blur-xl animate-pulse"></div>
              
              {/* Profile Image Frame */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-sky-200 bg-white p-2 shadow-xl shadow-sky-100">
                <img
                  src={config.profileImage}
                  alt={config.developerName}
                  className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Tech Tag Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-xl border border-sky-200 flex items-center justify-between text-xs font-mono shadow-md">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-sky-600" />
                    <span className="text-slate-800 font-bold">MERN + Firebase</span>
                  </div>
                  <span className="text-emerald-700 font-extrabold">Full Stack Dev</span>
                </div>
              </div>

              {/* Floating Glass Badges */}
              <div className="absolute -top-4 -left-4 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl border border-sky-200 text-xs font-bold text-sky-800 shadow-md hidden sm:flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>React 19 & Firebase</span>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-800 shadow-md hidden sm:flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>bKash Payment Verified</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
