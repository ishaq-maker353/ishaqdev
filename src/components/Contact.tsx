import React, { useState, useEffect } from 'react';
import { SiteConfig, ContactMessage } from '../types';
import { Mail, MessageSquare, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';

interface ContactProps {
  config: SiteConfig;
  onSubmitMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status' | 'type'>) => void;
}

export const Contact: React.FC<ContactProps> = ({ config, onSubmitMessage }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [budget, setBudget] = useState('৳10,000 - ৳25,000 / $100 - $250');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Live Bangladesh Clock (UTC+6)
  const [bdTime, setBdTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setBdTime(new Intl.DateTimeFormat('en-US', options).format(now));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    onSubmitMessage({
      name,
      email,
      phone,
      subject: subject || 'General Web Development Inquiry',
      budget,
      message,
    });

    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 relative bg-sky-50/60 border-t border-sky-100">
      
      {/* Glow ambient background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-sky-200/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-sky-200 text-sky-700 text-xs font-mono font-bold shadow-xs">
            <Mail className="w-3.5 h-3.5" />
            <span>LET'S BUILD TOGETHER</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Get in <span className="text-gradient-cyan">Touch</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Have a new project, business web app, or bug fix inquiry? Send a direct message or connect instantly on WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Quick Contact Info & Live Bangladesh Clock */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Bangladesh Status Box */}
            <div className="glass-card p-6 rounded-3xl border border-sky-100 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
                  </span>
                  <span className="text-xs font-bold text-emerald-700">Online & Accepting Projects</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                  <span>{bdTime || 'Dhaka Time'}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Based in <strong className="text-slate-800">Bangladesh (GMT+6)</strong>. Fast response times guaranteed on WhatsApp and email inquiries.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-3">
              
              <a
                href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-4 rounded-2xl border border-sky-100 hover:border-emerald-300 flex items-center gap-4 transition-all group shadow-xs"
              >
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono font-bold text-slate-500 uppercase">WhatsApp & bKash</div>
                  <div className="text-sm font-bold text-slate-800 group-hover:text-emerald-700">{config.whatsapp}</div>
                </div>
              </a>

              <a
                href={`mailto:${config.email}`}
                className="glass-card p-4 rounded-2xl border border-sky-100 hover:border-sky-300 flex items-center gap-4 transition-all group shadow-xs"
              >
                <div className="p-3 rounded-xl bg-sky-50 text-sky-600 group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono font-bold text-slate-500 uppercase">Direct Email</div>
                  <div className="text-sm font-bold text-slate-800 group-hover:text-sky-700">{config.email}</div>
                </div>
              </a>

              <div className="glass-card p-4 rounded-2xl border border-sky-100 flex items-center gap-4 shadow-xs">
                <div className="p-3 rounded-xl bg-sky-50 text-sky-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono font-bold text-slate-500 uppercase">Location</div>
                  <div className="text-sm font-bold text-slate-800">Bangladesh</div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-sm">
              
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">Message Delivered!</h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto">
                    Thank you <span className="text-sky-700 font-bold">{name}</span>. Your message has been saved to Firebase database and routed to Ishaq.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setEmail('');
                      setMessage('');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold hover:bg-sky-100"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600 block">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tanvir"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-sky-100 text-slate-800 text-xs focus:border-sky-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600 block">Your Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-sky-100 text-slate-800 text-xs focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600 block">WhatsApp / Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+8801700000000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-sky-100 text-slate-800 text-xs focus:border-sky-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600 block">Estimated Budget Range</label>
                      <select
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-sky-100 text-slate-800 text-xs focus:border-sky-500 focus:outline-none"
                      >
                        <option value="৳5,000 - ৳10,000 / $50 - $100">৳5,000 - ৳10,000 / $50 - $100 (Starter)</option>
                        <option value="৳10,000 - ৳25,000 / $100 - $250">৳10,000 - ৳25,000 / $100 - $250 (Standard)</option>
                        <option value="৳25,000 - ৳50,000+ / $250 - $500+">৳25,000 - ৳50,000+ / $250 - $500+ (Enterprise)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 block">Subject</label>
                    <input
                      type="text"
                      placeholder="e.g. E-Commerce Development Inquiry"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-sky-100 text-slate-800 text-xs focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 block">Your Message *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe your website goals, feature requirements, or timeline..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-sky-100 text-slate-800 text-xs focus:border-sky-500 focus:outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-extrabold text-sm shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message to Ishaq</span>
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
