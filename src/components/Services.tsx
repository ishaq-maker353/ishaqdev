import React from 'react';
import { Service } from '../types';
import { Code2, ShoppingBag, LayoutDashboard, Palette, Zap, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

interface ServicesProps {
  services: Service[];
  onSelectService: (serviceTitle: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ services, onSelectService }) => {
  // Map string icon names to Lucide icon components
  const getIcon = (name: string) => {
    switch (name) {
      case 'Code2': return <Code2 className="w-6 h-6 text-sky-600" />;
      case 'ShoppingBag': return <ShoppingBag className="w-6 h-6 text-emerald-600" />;
      case 'LayoutDashboard': return <LayoutDashboard className="w-6 h-6 text-sky-600" />;
      case 'Palette': return <Palette className="w-6 h-6 text-emerald-600" />;
      case 'Zap': return <Zap className="w-6 h-6 text-sky-600" />;
      default: return <Code2 className="w-6 h-6 text-sky-600" />;
    }
  };

  return (
    <section id="services" className="py-24 relative bg-sky-50/60 border-t border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-sky-200 text-sky-700 text-xs font-mono font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AGENCY OFFERINGS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Services & <span className="text-gradient-cyan">Solutions</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            High-performance full stack web development services tailored for modern startups, e-commerce brands, and local enterprises.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className={`glass-card glass-card-hover rounded-3xl p-6 sm:p-8 border flex flex-col justify-between relative group ${
                service.popular ? 'border-sky-300 shadow-md shadow-sky-100' : 'border-sky-100'
              }`}
            >
              {service.popular && (
                <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold text-[10px] uppercase tracking-wider shadow-xs">
                  Most Requested
                </div>
              )}

              <div className="space-y-6">
                
                {/* Icon & Title */}
                <div className="flex items-start justify-between">
                  <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-100 group-hover:border-sky-300 transition-colors">
                    {getIcon(service.iconName)}
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-mono uppercase text-slate-500 block font-semibold">Starting at</span>
                    <span className="text-xs sm:text-sm font-bold text-sky-700 font-mono">{service.startingPrice}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Features Checklist */}
                <ul className="space-y-2 pt-2 border-t border-sky-100">
                  {service.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

              </div>

              {/* Order Service CTA */}
              <div className="pt-6">
                <button
                  onClick={() => onSelectService(service.title)}
                  className="w-full py-3 rounded-2xl bg-white hover:bg-sky-500 text-slate-800 hover:text-white font-bold text-xs border border-sky-200 hover:border-sky-500 transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-xs cursor-pointer"
                >
                  <span>Order {service.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
