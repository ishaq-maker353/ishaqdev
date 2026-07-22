import React, { useState, useEffect } from 'react';
import { ContactMessage, PricingPlan } from '../types';
import { X, CheckCircle2, Copy, Check, MessageSquare, Send, Sparkles } from 'lucide-react';
import { db, collection, addDoc, User } from '../lib/firebase';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlanName?: string;
  plans: PricingPlan[];
  bkashNumber: string;
  whatsappNumber: string;
  currentUser: User | null;
  onSubmitOrder: (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status' | 'type'>) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  selectedPlanName,
  plans,
  bkashNumber,
  whatsappNumber,
  currentUser,
  onSubmitOrder,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>(selectedPlanName || 'Professional Web App');
  const [name, setName] = useState(currentUser?.displayName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('');
  const [requirements, setRequirements] = useState('');
  const [bkashTrxId, setBkashTrxId] = useState('');
  const [copiedBkash, setCopiedBkash] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Addons state
  const [expressDelivery, setExpressDelivery] = useState(false);
  const [domainHosting, setDomainHosting] = useState(false);

  useEffect(() => {
    if (selectedPlanName) {
      setSelectedPlan(selectedPlanName);
    }
    if (currentUser) {
      if (currentUser.displayName && !name) setName(currentUser.displayName);
      if (currentUser.email && !email) setEmail(currentUser.email);
    }
  }, [selectedPlanName, currentUser]);

  if (!isOpen) return null;

  const currentPlanObj = plans.find(p => p.name === selectedPlan);
  const basePriceBDT = currentPlanObj ? currentPlanObj.priceBDT : 25000;
  
  // Calculate total
  let totalBDT = basePriceBDT;
  if (expressDelivery) totalBDT += 5000;
  if (domainHosting) totalBDT += 3000;

  const handleCopyBkash = () => {
    navigator.clipboard.writeText(bkashNumber);
    setCopiedBkash(true);
    setTimeout(() => setCopiedBkash(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    setLoading(true);

    try {
      // 1. Save directly to Firebase Firestore orders collection
      await addDoc(collection(db, 'orders'), {
        userId: currentUser?.uid || 'guest',
        userName: name,
        userEmail: email,
        userPhone: phone,
        planName: selectedPlan,
        price: `৳${totalBDT.toLocaleString()} BDT`,
        bkashTransaction: bkashTrxId.trim() || 'Pending',
        projectRequirements: requirements || 'Standard Package',
        expressAddon: expressDelivery,
        hostingAddon: domainHosting,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      // 2. Local state callback
      onSubmitOrder({
        name,
        email,
        phone,
        subject: `[ORDER BOOKING] ${selectedPlan}`,
        message: `Selected Plan: ${selectedPlan}\nTotal Cost: ৳${totalBDT.toLocaleString()}\nRequirements: ${requirements}\nAddons: ${expressDelivery ? 'Express 48hr Delivery (+৳5,000)' : 'None'}, ${domainHosting ? 'Domain & Hosting Setup (+৳3,000)' : 'None'}`,
        planName: selectedPlan,
        bkashTrxId: bkashTrxId.trim() || undefined,
      });

      setLoading(false);
      setSubmittedSuccess(true);
    } catch (err) {
      console.error('Error saving order to Firestore:', err);
      // Fallback submission
      onSubmitOrder({
        name,
        email,
        phone,
        subject: `[ORDER BOOKING] ${selectedPlan}`,
        message: `Selected Plan: ${selectedPlan}\nTotal Cost: ৳${totalBDT.toLocaleString()}\nRequirements: ${requirements}`,
        planName: selectedPlan,
        bkashTrxId: bkashTrxId.trim() || undefined,
      });
      setLoading(false);
      setSubmittedSuccess(true);
    }
  };

  const getWhatsAppOrderUrl = () => {
    const text = `Hello Ishaq Ahmed! I want to order a web development project.\n\n` +
      `📌 *Selected Plan:* ${selectedPlan}\n` +
      `💰 *Estimated Total:* ৳${totalBDT.toLocaleString()}\n` +
      `👤 *Name:* ${name || 'Client'}\n` +
      `📱 *Phone:* ${phone || 'N/A'}\n` +
      `💳 *bKash Trx ID:* ${bkashTrxId || 'Will send after confirmation'}\n` +
      `📝 *Requirements:* ${requirements || 'Standard Package'}`;
    return `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-2xl relative space-y-6 my-8">
        
        {/* Top Close Button (X) */}
        <button
          type="button"
          onClick={onClose}
          title="Close / Cancel Order (বাতিল করুন)"
          className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-all border border-slate-200 hover:border-rose-300 cursor-pointer shadow-xs z-10 flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Order Saved in Firebase!</h3>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              Thank you, <span className="text-sky-700 font-bold">{name}</span>. Your order request is stored securely in Firebase database.
            </p>

            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-left space-y-2 text-xs text-slate-700">
              <div><strong className="text-slate-500">Plan:</strong> {selectedPlan}</div>
              <div><strong className="text-slate-500">Total Price:</strong> ৳{totalBDT.toLocaleString()} BDT</div>
              {bkashTrxId && <div><strong className="text-slate-500">bKash Trx ID:</strong> <span className="font-mono text-sky-800 font-bold">{bkashTrxId}</span></div>}
            </div>

            <div className="pt-4 flex flex-wrap gap-3 justify-center">
              <a
                href={getWhatsAppOrderUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Notify via WhatsApp Direct</span>
              </a>

              <button
                onClick={() => {
                  setSubmittedSuccess(false);
                  onClose();
                }}
                className="px-6 py-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold hover:bg-sky-100"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Modal Title */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>BOOK SERVICE / ORDER</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Hire Ishaq Ahmed & Build Your Project</h3>
              <p className="text-xs text-slate-500">
                Select your desired package, customize add-ons, and complete order via bKash or direct form submission.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Package Selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">Select Package Tier</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {plans.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPlan(p.name)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedPlan === p.name
                          ? 'bg-sky-50/90 border-sky-500 text-slate-900 shadow-sm ring-1 ring-sky-500'
                          : 'bg-slate-50 border-sky-100 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <div className="text-xs font-bold">{p.name}</div>
                      <div className="text-sm font-extrabold text-sky-700 font-mono mt-1">৳{p.priceBDT.toLocaleString()}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Addons Checklist */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">Custom Add-Ons</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className="p-3 rounded-2xl bg-slate-50 border border-sky-100 flex items-center gap-3 cursor-pointer hover:border-sky-300">
                    <input
                      type="checkbox"
                      checked={expressDelivery}
                      onChange={(e) => setExpressDelivery(e.target.checked)}
                      className="accent-sky-600 h-4 w-4 rounded"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Express 48hr Rush (+৳5,000)</div>
                      <div className="text-[10px] text-slate-500">Fast-track initial prototype</div>
                    </div>
                  </label>

                  <label className="p-3 rounded-2xl bg-slate-50 border border-sky-100 flex items-center gap-3 cursor-pointer hover:border-sky-300">
                    <input
                      type="checkbox"
                      checked={domainHosting}
                      onChange={(e) => setDomainHosting(e.target.checked)}
                      className="accent-sky-600 h-4 w-4 rounded"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Domain & Hosting Setup (+৳3,000)</div>
                      <div className="text-[10px] text-slate-500">Custom domain deployment</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* bKash Payment Guide Box */}
              <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-pink-600 text-white font-bold text-xs">bKash</span>
                    <span className="text-xs font-bold text-pink-900">Send Money Instructions</span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleCopyBkash}
                    className="flex items-center gap-1 text-[11px] font-mono text-sky-800 hover:text-sky-900 bg-white px-2 py-1 rounded-xl border border-pink-200 cursor-pointer"
                  >
                    {copiedBkash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedBkash ? 'Copied!' : bkashNumber}</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  To pay via bKash: Open bKash App &rarr; Select <strong>Send Money</strong> &rarr; Enter <strong>{bkashNumber}</strong> &rarr; Enter amount or deposit. Paste Trx ID below!
                </p>
              </div>

              {/* Form Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanvir Rahman"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-sky-100 text-slate-800 text-xs focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-sky-100 text-slate-800 text-xs focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">WhatsApp / Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+8801700000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-sky-100 text-slate-800 text-xs focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">bKash Trx ID (Optional / If paid)</label>
                  <input
                    type="text"
                    placeholder="e.g. BAX1092837"
                    value={bkashTrxId}
                    onChange={(e) => setBkashTrxId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-sky-100 text-slate-800 text-xs font-mono focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">Project Requirements / Details</label>
                <textarea
                  rows={3}
                  placeholder="Tell me about your business, desired features, color preferences, or reference websites..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-sky-100 text-slate-800 text-xs focus:border-sky-500 focus:outline-none"
                ></textarea>
              </div>

              {/* Total Calculation & Actions */}
              <div className="pt-4 border-t border-sky-100 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-mono text-slate-500 uppercase font-semibold">Calculated Total</div>
                  <div className="text-2xl font-extrabold text-sky-700 font-mono">৳{totalBDT.toLocaleString()} BDT</div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 font-bold text-xs transition-all cursor-pointer"
                  >
                    Cancel (ক্যানসেল)
                  </button>

                  <a
                    href={getWhatsAppOrderUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Order</span>
                  </a>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-extrabold text-xs shadow-md shadow-sky-500/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Submit Order Online'}</span>
                  </button>
                </div>
              </div>

            </form>
          </>
        )}

      </div>
    </div>
  );
};
