import React from 'react';
import { PricingPlan } from '../types';
import { DollarSign, Check, Sparkles, ArrowRight, MessageSquare } from 'lucide-react';

interface PricingProps {
  plans: PricingPlan[];
  onOpenOrder: (planName?: string) => void;
  bkashNumber: string;
}

export const Pricing: React.FC<PricingProps> = ({ plans, onOpenOrder, bkashNumber }) => {
  return (
    <section id="pricing" className="py-24 relative bg-sky-50/60 border-t border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-sky-200 text-sky-700 text-xs font-mono font-bold shadow-xs">
            <DollarSign className="w-3.5 h-3.5" />
            <span>TRANSPARENT PRICING</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Service Tiers & <span className="text-gradient-cyan">Packages</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Clear, upfront pricing for clients in Bangladesh (bKash accepted) and worldwide. No hidden fees.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`glass-card rounded-3xl p-6 sm:p-8 border flex flex-col justify-between relative group shadow-sm ${
                plan.popular
                  ? 'border-sky-300 bg-white/95 shadow-lg shadow-sky-100 scale-102 z-10'
                  : 'border-sky-100'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Most Popular Choice</span>
                </div>
              )}

              <div className="space-y-6">
                
                {/* Package Title & Delivery */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-sky-700 mt-1 font-mono font-bold">{plan.deliveryTime}</p>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-sky-700 font-mono">
                      ৳{plan.priceBDT.toLocaleString()}
                    </span>
                    <span className="text-slate-500 text-xs font-mono font-bold">/ ${plan.priceUSD} USD</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">bKash Send Money & Global Payment Supported</p>
                </div>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {plan.description}
                </p>

                {/* Features List */}
                <ul className="space-y-2.5 pt-2 border-t border-sky-100">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <div className="p-0.5 rounded bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

              </div>

              {/* Order Trigger */}
              <div className="pt-8">
                <button
                  onClick={() => onOpenOrder(plan.name)}
                  className={`w-full py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 shadow-md cursor-pointer ${
                    plan.popular
                      ? 'bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white shadow-sky-500/20'
                      : 'bg-white hover:bg-sky-50 text-slate-800 border border-sky-200 hover:border-sky-400'
                  }`}
                >
                  <span>Order {plan.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* bKash Direct Info Banner */}
        <div className="mt-12 bg-white p-6 rounded-3xl border border-sky-200 flex flex-wrap items-center justify-between gap-4 max-w-4xl mx-auto shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-pink-100 border border-pink-200 text-pink-700 font-extrabold text-sm">
              bKash
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>bKash Personal / Send Money Number:</span>
                <span className="font-mono text-sky-800 font-extrabold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">{bkashNumber}</span>
              </div>
              <p className="text-xs text-slate-500">Order online or connect directly via WhatsApp to initiate Send Money order verification.</p>
            </div>
          </div>

          <a
            href={`https://wa.me/8801749032883?text=${encodeURIComponent('Hello Ishaq Ahmed, I would like to order a website project via bKash.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
