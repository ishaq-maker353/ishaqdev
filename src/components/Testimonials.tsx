import React, { useState } from 'react';
import { Testimonial } from '../types';
import { Star, Quote, PlusCircle, CheckCircle2, X } from 'lucide-react';

interface TestimonialsProps {
  testimonials: Testimonial[];
  onAddTestimonial: (t: Omit<Testimonial, 'id' | 'date'>) => void;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials, onAddTestimonial }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;

    onAddTestimonial({
      name,
      role: role || 'Client',
      company: company || 'Independent',
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?auto=format&fit=crop&q=80&w=200`,
      rating,
      comment,
    });

    setName('');
    setRole('');
    setCompany('');
    setComment('');
    setShowAddModal(false);
  };

  return (
    <section className="py-24 relative bg-sky-50/60 border-t border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-sky-200 text-sky-700 text-xs font-mono font-bold shadow-xs">
            <Quote className="w-3.5 h-3.5" />
            <span>CLIENT FEEDBACK</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Client <span className="text-gradient-cyan">Testimonials</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Read authentic reviews from business owners, agency leads, and medical professionals who collaborated with Ishaq Ahmed.
          </p>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold mt-4 transition-colors shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-sky-600" />
            <span>Leave a Client Review</span>
          </button>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="glass-card glass-card-hover rounded-3xl p-6 border border-sky-100 flex flex-col justify-between space-y-6 relative shadow-xs"
            >
              <div className="space-y-4">
                
                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < item.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic">
                  "{item.comment}"
                </p>

              </div>

              {/* Client Info Footer */}
              <div className="pt-4 border-t border-sky-100 flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover border border-sky-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{item.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {item.role} &bull; <span className="text-sky-700 font-bold">{item.company}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Leave Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl border border-sky-100 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-sky-50 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900">Leave Client Feedback</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-sky-100 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-600 font-semibold block mb-1">Role / Position</label>
                  <input
                    type="text"
                    placeholder="e.g. CEO"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-sky-100 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 font-semibold block mb-1">Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Azelia Tech"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-sky-100 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Star Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-sky-100 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 / 5)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 / 5)</option>
                  <option value={3}>⭐⭐⭐ (3 / 5)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Your Feedback *</label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-sky-100 text-xs text-slate-800 focus:border-sky-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-sky-500 text-white rounded-xl hover:bg-sky-600"
                >
                  Post Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
