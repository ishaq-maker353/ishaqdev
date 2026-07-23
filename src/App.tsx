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
import { auth, onAuthStateChanged, User, db, doc, setDoc, updateDoc, deleteDoc, onSnapshot, collection } from './lib/firebase';

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

  // Site configuration with Firestore + localStorage backup
  const [config, setConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('ishaq_site_config');
    if (saved) {
      try {
        return JSON.parse(saved);
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

  // Firestore Real-Time Listener for Config
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'config', 'main'), (snapshot) => {
      if (snapshot.exists()) {
        const firestoreConfig = snapshot.data() as SiteConfig;
        const mergedConfig: SiteConfig = {
          ...initialSiteConfig,
          ...firestoreConfig,
          profileImage: firestoreConfig.profileImage || initialSiteConfig.profileImage,
          logoImage: firestoreConfig.logoImage || initialSiteConfig.logoImage,
        };
        setConfig(mergedConfig);
        localStorage.setItem('ishaq_site_config', JSON.stringify(mergedConfig));
      } else {
        setDoc(doc(db, 'config', 'main'), initialSiteConfig).catch(console.error);
      }
    }, (err) => {
      console.error('Firestore Config Sync Error:', err);
    });

    return () => unsubscribe();
  }, []);

  // Firestore Real-Time Listener for Projects
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'projects'), (snapshot) => {
      if (!snapshot.empty) {
        const list: Project[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Project);
        });
        setProjects(list);
        localStorage.setItem('ishaq_projects', JSON.stringify(list));
      } else {
        initialProjects.forEach((p) => {
          setDoc(doc(db, 'projects', p.id), p).catch(console.error);
        });
      }
    }, (err) => {
      console.error('Firestore Projects Sync Error:', err);
    });

    return () => unsubscribe();
  }, []);

  // Firestore Real-Time Listener for Pricing Plans
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'plans'), (snapshot) => {
      if (!snapshot.empty) {
        const list: PricingPlan[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as PricingPlan);
        });
        setPlans(list);
        localStorage.setItem('ishaq_pricing_plans', JSON.stringify(list));
      } else {
        initialPricingPlans.forEach((p) => {
          setDoc(doc(db, 'plans', p.id), p).catch(console.error);
        });
      }
    }, (err) => {
      console.error('Firestore Plans Sync Error:', err);
    });

    return () => unsubscribe();
  }, []);

  // Firestore Real-Time Listener for Testimonials
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'testimonials'), (snapshot) => {
      if (!snapshot.empty) {
        const list: Testimonial[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Testimonial);
        });
        setTestimonials(list);
        localStorage.setItem('ishaq_testimonials', JSON.stringify(list));
      } else {
        initialTestimonials.forEach((t) => {
          setDoc(doc(db, 'testimonials', t.id), t).catch(console.error);
        });
      }
    }, (err) => {
      console.error('Firestore Testimonials Sync Error:', err);
    });

    return () => unsubscribe();
  }, []);

  // Firestore Real-Time Listener for Contact Messages
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'messages'), (snapshot) => {
      if (!snapshot.empty) {
        const list: ContactMessage[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as ContactMessage);
        });
        setMessages(list);
        localStorage.setItem('ishaq_messages', JSON.stringify(list));
      }
    }, (err) => {
      console.error('Firestore Messages Sync Error:', err);
    });

    return () => unsubscribe();
  }, []);

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

  // Local Storage Backups
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

  const handleAddMessage = async (msgData: Omit<ContactMessage, 'id' | 'createdAt' | 'status' | 'type'>) => {
    const msgId = 'msg-' + Date.now();
    const newMsg: ContactMessage = {
      ...msgData,
      id: msgId,
      createdAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }) + ' (BD Time)',
      status: 'Unread',
      type: msgData.planName ? 'Order Booking' : 'General Inquiry',
    };
    setMessages(prev => [newMsg, ...prev]);
    try {
      await setDoc(doc(db, 'messages', msgId), newMsg);
    } catch (err) {
      console.error('Error saving message to Firestore:', err);
    }
  };

  const handleAddTestimonial = async (item: Omit<Testimonial, 'id' | 'date'>) => {
    const testiId = 'testi-' + Date.now();
    const newTesti: Testimonial = {
      ...item,
      id: testiId,
      date: new Date().toISOString().split('T')[0],
    };
    setTestimonials(prev => [newTesti, ...prev]);
    try {
      await setDoc(doc(db, 'testimonials', testiId), newTesti);
    } catch (err) {
      console.error('Error saving testimonial to Firestore:', err);
    }
  };

  const handleUpdateMessageStatus = async (id: string, status: 'Unread' | 'Contacted' | 'Completed') => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    try {
      await updateDoc(doc(db, 'messages', id), { status });
    } catch (err) {
      console.error('Error updating message status in Firestore:', err);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    try {
      await deleteDoc(doc(db, 'messages', id));
    } catch (err) {
      console.error('Error deleting message from Firestore:', err);
    }
  };

  const handleAddProject = async (newProj: Omit<Project, 'id'>) => {
    const projId = 'proj-' + Date.now();
    const created: Project = {
      ...newProj,
      id: projId,
    };
    setProjects(prev => [created, ...prev]);
    try {
      await setDoc(doc(db, 'projects', projId), created);
    } catch (err) {
      console.error('Error saving project to Firestore:', err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (err) {
      console.error('Error deleting project from Firestore:', err);
    }
  };

  // Pricing Plan CRUD Handlers
  const handleAddPlan = async (newPlan: Omit<PricingPlan, 'id'>) => {
    const planId = 'plan-' + Date.now();
    const created: PricingPlan = {
      ...newPlan,
      id: planId,
    };
    setPlans(prev => [...prev, created]);
    try {
      await setDoc(doc(db, 'plans', planId), created);
    } catch (err) {
      console.error('Error saving plan to Firestore:', err);
    }
  };

  const handleDeletePlan = async (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id));
    try {
      await deleteDoc(doc(db, 'plans', id));
    } catch (err) {
      console.error('Error deleting plan from Firestore:', err);
    }
  };

  const handleUpdatePlan = async (updatedPlan: PricingPlan) => {
    setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
    try {
      await setDoc(doc(db, 'plans', updatedPlan.id), updatedPlan, { merge: true });
    } catch (err) {
      console.error('Error updating plan in Firestore:', err);
    }
  };

  const handleUpdateConfig = async (newCfg: Partial<SiteConfig>) => {
    const updated = { ...config, ...newCfg };
    setConfig(updated);
    localStorage.setItem('ishaq_site_config', JSON.stringify(updated));
    try {
      await setDoc(doc(db, 'config', 'main'), updated, { merge: true });
    } catch (err) {
      console.error('Error saving config to Firestore:', err);
    }
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
