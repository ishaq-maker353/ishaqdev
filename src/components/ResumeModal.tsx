import React from 'react';
import { SiteConfig } from '../types';
import { X, Printer, Phone, MapPin, Mail, BookOpen } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose, config }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-sky-100 max-w-4xl w-full rounded-3xl p-4 sm:p-8 text-slate-800 relative my-6 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        
        {/* Header Controls */}
        <div className="flex items-center justify-between border-b border-sky-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-mono font-bold">
              OFFICIAL CV DOCUMENT
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">Ishaq Ahmed - Resume</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-sky-50 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CV Document Sheet Body */}
        <div className="bg-slate-50/70 p-6 sm:p-10 rounded-2xl border border-sky-100 text-slate-700 grid grid-cols-1 md:grid-cols-12 gap-8 shadow-xs">
          
          {/* CV Left Sidebar */}
          <div className="md:col-span-4 space-y-6 border-b md:border-b-0 md:border-r border-sky-100 pb-6 md:pb-0 md:pr-6">
            
            {/* Profile Photo */}
            <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-sky-200 p-1 bg-white shadow-md">
              <img
                src={config.profileImage}
                alt="Ishaq Ahmed CV Profile"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Contact Details */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono font-extrabold uppercase text-sky-800 tracking-wider">Contact</h4>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>{config.whatsapp}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>{config.location}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-700 break-all">
                  <Mail className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>{config.email}</span>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-extrabold uppercase text-sky-800 tracking-wider">Languages</h4>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>Bangla (Native)</span>
                  <span className="text-emerald-600">•••••</span>
                </div>
                <div className="flex justify-between">
                  <span>English (Intermediate)</span>
                  <span className="text-sky-600">••••○</span>
                </div>
              </div>
            </div>

            {/* Strengths */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-extrabold uppercase text-sky-800 tracking-wider">Strengths</h4>
              <ul className="text-xs space-y-1 text-slate-700 list-disc list-inside">
                <li>Full Stack Web Development</li>
                <li>Responsive Web Design</li>
                <li>Problem Solving & Logic</li>
                <li>Clean Modular Architecture</li>
                <li>Fast Independent Learner</li>
              </ul>
            </div>

          </div>

          {/* CV Main Right Content */}
          <div className="md:col-span-8 space-y-6">
            
            {/* Header Title */}
            <div className="border-b border-sky-100 pb-4">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{config.developerName}</h2>
              <p className="text-sm font-bold text-sky-700 uppercase tracking-widest mt-0.5">{config.title}</p>
            </div>

            {/* About Me Section */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-extrabold uppercase text-sky-800 tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-sky-600" />
                <span>ABOUT ME</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                I am a passionate Full Stack Web Developer specializing in both frontend and backend development. I build responsive, modern, fast, and user-friendly web applications using modern technologies. Currently studying in Class 9 while continuously improving my programming skills.
              </p>
            </div>

            {/* Skills Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-extrabold uppercase text-sky-800 tracking-wider">SKILLS SUMMARY</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-sky-100">
                  <strong className="text-sky-800 block mb-1">Frontend</strong>
                  <div className="text-slate-600">HTML5 (95%), CSS3 (90%), JS (90%), Tailwind CSS (85%), Bootstrap (85%)</div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-sky-100">
                  <strong className="text-emerald-700 block mb-1">Backend & DB</strong>
                  <div className="text-slate-600">Node.js (85%), Express.js (80%), Firebase (85%), MongoDB (80%)</div>
                </div>
              </div>
            </div>

            {/* Featured Projects with QR code links */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-extrabold uppercase text-sky-800 tracking-wider">FEATURED PROJECTS</h3>

              <div className="space-y-3">
                <div className="p-3 bg-white rounded-xl border border-sky-100 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">HOSPITAL MANAGEMENT SYSTEM</h4>
                    <a href="https://hospital-ishaq2.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-sky-700 hover:underline font-bold">
                      https://hospital-ishaq2.netlify.app/
                    </a>
                    <p className="text-[11px] text-slate-500">
                      Admin Dashboard, Patient Dashboard, Doctor Management, Appointment Booking, Firebase Auth, Responsive Design.
                    </p>
                  </div>

                  <div className="bg-white p-1 rounded border border-sky-100 shrink-0">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=https://hospital-ishaq2.netlify.app/"
                      alt="Hospital QR"
                      className="w-12 h-12"
                    />
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-sky-100 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">AZELIA MART</h4>
                    <a href="https://azeliamart.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-sky-700 hover:underline font-bold">
                      https://azeliamart.netlify.app/
                    </a>
                    <p className="text-[11px] text-slate-500">
                      Modern E-commerce Website, Responsive UI, Product Showcase, Mobile Friendly, Fast Loading.
                    </p>
                  </div>

                  <div className="bg-white p-1 rounded border border-sky-100 shrink-0">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=https://azeliamart.netlify.app/"
                      alt="Azelia QR"
                      className="w-12 h-12"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Education & Career Objective */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-sky-100">
              <div>
                <h4 className="text-xs font-mono font-extrabold uppercase text-sky-800 mb-1">Education</h4>
                <div className="text-xs text-slate-800 font-bold">{config.education}</div>
              </div>

              <div>
                <h4 className="text-xs font-mono font-extrabold uppercase text-sky-800 mb-1">Career Objective</h4>
                <p className="text-xs text-slate-600">
                  To become a professional Software Engineer and build world-class web applications.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
