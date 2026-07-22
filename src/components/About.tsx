import React from 'react';
import { SiteConfig } from '../types';
import { User, GraduationCap, CheckCircle2, FileText, Globe, ShieldCheck } from 'lucide-react';

interface AboutProps {
  config: SiteConfig;
  onOpenResume: () => void;
}

export const About: React.FC<AboutProps> = ({ config, onOpenResume }) => {

  return (
    <section id="about" className="py-20 relative bg-sky-50/60 border-t border-b border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-sky-200 text-sky-700 text-xs font-mono font-bold shadow-xs">
            <User className="w-3.5 h-3.5" />
            <span>GET TO KNOW ME</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About <span className="text-gradient-cyan">Ishaq Ahmed</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Passionate Full Stack Web Developer & Tech Enthusiast based in Bangladesh.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Profile Photo Display */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative group w-72 h-72 sm:w-80 sm:h-80 rounded-3xl overflow-hidden glass-card p-3 border-2 border-sky-200 hover:border-sky-400 transition-all duration-300 shadow-lg">
              <img
                src={config.profileImage}
                alt="Ishaq Ahmed Profile"
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Verified Full Stack Developer Profile</span>
            </div>
          </div>

          {/* Bio & Details Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main Bio Card */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-sky-100 space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span>Driven Full Stack Web Developer</span>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-sky-100 text-sky-800 border border-sky-200">
                  Class 9 Student
                </span>
              </h3>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {config.bio}
              </p>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-sky-100 shadow-xs">
                  <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Education</div>
                    <div className="text-sm font-bold text-slate-800">{config.education}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-sky-100 shadow-xs">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Languages</div>
                    <div className="text-sm font-bold text-slate-800">Bangla (Native) &bull; English (Intermediate)</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Key Strengths Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { title: 'Full Stack Dev', desc: 'React, Node, Mongo, Firebase' },
                { title: 'Responsive UI', desc: 'Tailwind CSS, Modern UI' },
                { title: 'Problem Solving', desc: 'Clean architecture & APIs' },
                { title: 'Fast Learner', desc: 'Continuously adopting new tech' },
              ].map((item, idx) => (
                <div key={idx} className="glass-card p-3 rounded-2xl border border-sky-100 text-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <div className="text-xs font-bold text-slate-800">{item.title}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenResume}
                className="px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-md shadow-sky-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>View Digital Resume (CV)</span>
              </button>

              <div className="text-xs text-slate-600 font-mono">
                Direct Contact: <span className="text-sky-700 font-bold">{config.whatsapp}</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
