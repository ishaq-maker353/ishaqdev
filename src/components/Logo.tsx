import React from 'react';

interface LogoProps {
  logoImage?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ logoImage, className = "h-9 w-auto" }) => {
  return (
    <div className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
      {logoImage ? (
        <div className="relative">
          <img 
            src={logoImage} 
            alt="Ishaq Dev Logo" 
            className="h-10 w-10 rounded-xl object-contain border border-cyan-500/30 group-hover:border-cyan-400 transition-all duration-300 shadow-md shadow-cyan-500/10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-20 blur group-hover:opacity-60 transition duration-300 -z-10"></div>
        </div>
      ) : (
        <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-400 font-extrabold text-lg shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
          <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">ID</span>
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-30 blur group-hover:opacity-75 transition duration-300 -z-10"></div>
        </div>
      )}
      <div className="flex flex-col">
        <span className="font-black text-lg tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors flex items-center gap-1">
          Ishaq <span className="text-sky-600 font-black">Dev</span>
        </span>
        <span className="text-[10px] text-slate-600 tracking-wider uppercase font-bold -mt-1">
          Full Stack Agency
        </span>
      </div>
    </div>
  );
};
