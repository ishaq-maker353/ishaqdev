import React, { useState } from 'react';
import { Project } from '../types';
import { ExternalLink, Github, QrCode, Layers, CheckCircle, Info, X } from 'lucide-react';

interface ProjectsProps {
  projects: Project[];
}

export const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [qrModalProject, setQrModalProject] = useState<Project | null>(null);

  const categories = ['All', 'Full Stack Web App', 'E-Commerce', 'Business Software'];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <section id="projects" className="py-24 relative bg-slate-50/50">
      
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-sky-200/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-sky-200 text-sky-700 text-xs font-mono font-bold shadow-xs">
            <Layers className="w-3.5 h-3.5" />
            <span>PORTFOLIO SHOWCASE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Featured <span className="text-gradient-cyan">Projects</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Explore live production web applications, e-commerce platforms, and custom business management software built by Ishaq Ahmed.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 border cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white border-sky-500 shadow-md shadow-sky-500/20 scale-105'
                  : 'bg-white text-slate-600 border-sky-100 hover:bg-sky-50 hover:text-sky-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-card glass-card-hover rounded-3xl overflow-hidden border border-sky-100 flex flex-col group relative shadow-sm"
            >
              
              {/* Project Image Preview */}
              <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-sky-200 text-sky-800 text-[11px] font-mono font-bold shadow-xs">
                  {project.category}
                </div>

                {/* QR Quick Scan Trigger */}
                <button
                  onClick={() => setQrModalProject(project)}
                  title="Scan QR Code to open on Mobile"
                  className="absolute top-3 right-3 p-2 rounded-2xl bg-white/90 backdrop-blur-md border border-sky-200 text-slate-600 hover:text-sky-600 hover:border-sky-300 transition-all shadow-xs cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors flex items-center justify-between">
                    <span>{project.title}</span>
                  </h3>
                  
                  <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Tech Stack Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md bg-sky-50 border border-sky-100 text-[11px] font-mono font-bold text-sky-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-sky-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveProject(project)}
                    className="text-xs font-semibold text-slate-500 hover:text-sky-600 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5 text-sky-500" />
                    <span>View Details</span>
                  </button>

                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 flex items-center gap-1.5 transition-all"
                  >
                    <span>Live Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Detailed Project Info Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveProject(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-sky-50 text-slate-400 hover:text-slate-700 hover:bg-sky-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-200 text-xs font-mono font-bold">
                {activeProject.category}
              </span>
              <h3 className="text-2xl font-bold text-slate-900">{activeProject.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{activeProject.description}</p>
            </div>

            {/* Key Features List */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">Key Technical Features</h4>
              <ul className="space-y-2">
                {activeProject.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Badges */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">Technology Stack</h4>
              <div className="flex flex-wrap gap-2">
                {activeProject.techStack.map((tech, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg bg-sky-50 border border-sky-200 text-xs font-mono font-bold text-sky-800">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Footer CTAs */}
            <div className="pt-4 border-t border-sky-100 flex flex-wrap items-center justify-between gap-4">
              {activeProject.githubUrl && (
                <a
                  href={activeProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Repository</span>
                </a>
              )}

              <a
                href={activeProject.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold text-xs shadow-md shadow-sky-500/20 flex items-center gap-2"
              >
                <span>Launch Live Application</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      )}

      {/* QR Code Scan Modal */}
      {qrModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white max-w-sm w-full p-6 rounded-3xl border border-sky-100 shadow-2xl text-center space-y-4 relative">
            <button
              onClick={() => setQrModalProject(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-sky-50 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Scan Live Demo</h3>
              <p className="text-xs text-slate-500">{qrModalProject.title}</p>
            </div>

            {/* Generated QR Code Image via API */}
            <div className="p-4 bg-sky-50 border border-sky-100 rounded-2xl inline-block mx-auto shadow-xs">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrModalProject.demoUrl)}`}
                alt="Live Demo QR Code"
                className="w-48 h-48 object-contain"
              />
            </div>

            <p className="text-[11px] font-mono text-sky-700 break-all bg-sky-50 p-2 rounded-xl border border-sky-100">
              {qrModalProject.demoUrl}
            </p>

            <button
              onClick={() => window.open(qrModalProject.demoUrl, '_blank')}
              className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs transition-colors"
            >
              Open Direct Link
            </button>
          </div>
        </div>
      )}

    </section>
  );
};
