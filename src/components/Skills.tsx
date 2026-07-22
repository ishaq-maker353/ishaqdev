import React, { useState } from 'react';
import { SkillItem } from '../types';
import { Cpu, Code, Database, Wrench } from 'lucide-react';

interface SkillsProps {
  skills: SkillItem[];
}

export const Skills: React.FC<SkillsProps> = ({ skills }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'frontend' | 'backend' | 'tools'>('all');

  const filteredSkills = activeTab === 'all'
    ? skills
    : skills.filter(s => s.category === activeTab);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'frontend': return 'Frontend Engineering';
      case 'backend': return 'Backend & Databases';
      case 'tools': return 'Tools & Deployment';
      default: return 'All Tech Stack';
    }
  };

  return (
    <section id="skills" className="py-24 relative bg-slate-50/50">
      
      {/* Background glow */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-teal-100/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-sky-200 text-sky-700 text-xs font-mono font-bold shadow-xs">
            <Cpu className="w-3.5 h-3.5" />
            <span>TECHNICAL PROFICIENCY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Skills & <span className="text-gradient-cyan">Technologies</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Proficiency levels across modern frontend design systems, backend APIs, cloud databases, and DevOps workflows.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {[
            { id: 'all', label: 'All Technologies', icon: Cpu },
            { id: 'frontend', label: 'Frontend', icon: Code },
            { id: 'backend', label: 'Backend & DB', icon: Database },
            { id: 'tools', label: 'Tools & Workflow', icon: Wrench },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 border cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/20 scale-105'
                    : 'bg-white text-slate-600 border-sky-100 hover:bg-sky-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, idx) => (
            <div
              key={idx}
              className="glass-card p-5 rounded-2xl border border-sky-100 hover:border-sky-300 transition-all duration-300 space-y-3 group shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-500 group-hover:bg-emerald-500 transition-colors"></div>
                  <span className="font-bold text-sm text-slate-800 group-hover:text-sky-700 transition-colors">
                    {skill.name}
                  </span>
                </div>

                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {skill.level}%
                </span>
              </div>

              {/* Level Progress Bar */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200 p-0.5">
                <div
                  className="bg-gradient-to-r from-sky-500 to-cyan-500 h-full rounded-full transition-all duration-1000 ease-out shadow-xs"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>Category: {getCategoryLabel(skill.category)}</span>
                <span className="text-sky-700 font-bold">Production Ready</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
