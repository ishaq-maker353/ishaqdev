import React, { useState, useEffect } from 'react';
import { SiteConfig, Project, Service, SkillItem, PricingPlan, Testimonial, ContactMessage } from './types';
import { initialSiteConfig, initialProjects, initialServices, initialSkills, initialPricingPlans, initialTestimonials } from './data/initialData';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Services } from './components/Services';
import { Skills } from './components/Skills';
import { Pricing } from './components/Pricing';
import { Testimonials } from './components/Testimonials';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

import { OrderModal } from './components/OrderModal';
import { ResumeModal } from './components/ResumeModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { AuthModal } from './components/AuthModal';
import { ClientOrdersModal } from './components/ClientOrdersModal';
import { auth, onAuthStateChanged, User } from './lib/firebase';

export default function App() {
  const [activePage, setActivePage] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Persistence via LocalStorage with guaranteed user profile photo
  const [config, setConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('ishaq_site_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          profileImage: initialSiteConfig.profileImage,
          logoImage: initialSiteConfig.logoImage,
        };
      } catch (e) {
        return initialSiteConfig;
      }
    }
    return initialSiteConfig;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('ishaq_projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [services] = useState<Service[]>(initialServices);
  const [skills] = useState<SkillItem[]>(initialSkills);

  const [plans, setPlans] = useState<PricingPlan[]>(() => {
    const saved = localStorage.getItem('ishaq_pricing_plans');
    return saved ? JSON.parse(saved) : initialPricingPlans;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('ishaq_testimonials');
    return saved ? JSON.parse(saved) : initialTestimonials;
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('ishaq_messages');
    return saved ? JSON.parse(saved) : [];
  });

  // Modal State Control
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [selectedOrderPlan, setSelectedOrderPlan] = useState<string | undefined>(undefined);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);

  // Smooth scroll to section
  const handleNavigate = (pageId: string) => {
    setActivePage(pageId);
    if (pageId === 'resume') {
      setIsResumeOpen(true);
      return;
    }
    const elem = document.getElementById(pageId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('ishaq_site_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('ishaq_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('ishaq_pricing_plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('ishaq_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem('ishaq_messages', JSON.stringify(messages));
  }, [messages]);

  // Handlers
  const handleOpenOrder = (planName?: string) => {
    setSelectedOrderPlan(planName);
    setIsOrderOpen(true);
  };

  const handleAddMessage = (msgData: Omit<ContactMessage, 'id' | 'createdAt' | 'status' | 'type'>) => {
    const newMsg: ContactMessage = {
      ...msgData,
      id: 'msg-' + Date.now(),
      createdAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }) + ' (BD Time)',
      status: 'Unread',
      type: msgData.planName ? 'Order Booking' : 'General Inquiry',
    };
    setMessages(prev => [newMsg, ...prev]);
  };

  const handleAddTestimonial = (item: Omit<Testimonial, 'id' | 'date'>) => {
    const newTesti: Testimonial = {
      ...item,
      id: 'testi-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
    };
    setTestimonials(prev => [newTesti, ...prev]);
  };

  const handleUpdateMessageStatus = (id: string, status: 'Unread' | 'Contacted' | 'Completed') => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const handleAddProject = (newProj: Omit<Project, 'id'>) => {
    const created: Project = {
      ...newProj,
      id: 'proj-' + Date.now(),
    };
    setProjects(prev => [created, ...prev]);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // Pricing Plan CRUD Handlers
  const handleAddPlan = (newPlan: Omit<PricingPlan, 'id'>) => {
    const created: PricingPlan = {
      ...newPlan,
      id: 'plan-' + Date.now(),
    };
    setPlans(prev => [...prev, created]);
  };

  const handleDeletePlan = (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdatePlan = (updatedPlan: PricingPlan) => {
    setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
  };

  const handleUpdateConfig = (newCfg: Partial<SiteConfig>) => {
    setConfig(prev => ({ ...prev, ...newCfg }));
  };

  const handleExportData = () => {
    const data = { config, projects, plans, testimonials, messages };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ishaq_dev_portfolio_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  };

  const handleImportData = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.config) setConfig(parsed.config);
      if (parsed.projects) setProjects(parsed.projects);
      if (parsed.plans) setPlans(parsed.plans);
      if (parsed.testimonials) setTestimonials(parsed.testimonials);
      if (parsed.messages) setMessages(parsed.messages);
      alert('Data imported successfully!');
    } catch (err) {
      alert('Invalid JSON file format.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-sky-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenOrder={handleOpenOrder}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenMyOrders={() => setIsMyOrdersOpen(true)}
        currentUser={currentUser}
        isAdminAuthenticated={isAdminAuthenticated}
        developerEmail={config.email}
        logoImage={config.logoImage}
        isAvailable={config.isAvailable}
      />

      {/* Main Single Page Layout */}
      <main className="space-y-16 pt-20">
        <div id="home">
          <Hero
            config={config}
            onOpenOrder={() => handleOpenOrder()}
            onOpenResume={() => setIsResumeOpen(true)}
          />
        </div>

        <div id="about">
          <About
            config={config}
            onOpenResume={() => setIsResumeOpen(true)}
          />
        </div>

        <div id="projects">
          <Projects projects={projects} />
        </div>

        <div id="services">
          <Services
            services={services}
            onSelectService={(serviceTitle) => handleOpenOrder(`Service: ${serviceTitle}`)}
          />
        </div>

        <div id="skills">
          <Skills skills={skills} />
        </div>

        <div id="pricing">
          <Pricing
            plans={plans}
            onOpenOrder={handleOpenOrder}
            bkashNumber={config.bkashNumber}
          />
        </div>

        <div id="reviews">
          <Testimonials
            testimonials={testimonials}
            onAddTestimonial={handleAddTestimonial}
          />
        </div>

        <div id="contact">
          <Contact
            config={config}
            onSubmitMessage={handleAddMessage}
          />
        </div>
      </main>

      {/* Footer */}
      <Footer
        config={config}
        onOpenOrder={() => handleOpenOrder()}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* Modals */}
      <OrderModal
        isOpen={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
        selectedPlanName={selectedOrderPlan}
        plans={plans}
        bkashNumber={config.bkashNumber}
        whatsappNumber={config.whatsapp}
        currentUser={currentUser}
        onSubmitOrder={handleAddMessage}
      />

      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        config={config}
      />

      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        messages={messages}
        projects={projects}
        plans={plans}
        testimonials={testimonials}
        config={config}
        onAdminAuthenticated={() => setIsAdminAuthenticated(true)}
        onUpdateMessageStatus={handleUpdateMessageStatus}
        onDeleteMessage={handleDeleteMessage}
        onAddProject={handleAddProject}
        onDeleteProject={handleDeleteProject}
        onAddPlan={handleAddPlan}
        onDeletePlan={handleDeletePlan}
        onUpdatePlan={handleUpdatePlan}
        onUpdateConfig={handleUpdateConfig}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <ClientOrdersModal
        isOpen={isMyOrdersOpen}
        onClose={() => setIsMyOrdersOpen(false)}
        currentUser={currentUser}
      />

    </div>
  );
}
