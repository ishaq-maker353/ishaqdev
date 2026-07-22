import { Project, Service, SkillItem, PricingPlan, Testimonial, SiteConfig } from '../types';

import profileAvatar from '../assets/images/profile_avatar_1784736852709.jpg';
import ishaqLogo from '../assets/images/ishaq_dev_logo_brand_1784743420863.jpg';
import hospitalPreview from '../assets/images/hospital_app_preview_1784736889510.jpg';
import azeliaPreview from '../assets/images/azelia_mart_preview_1784736906316.jpg';
import nakshaghorPreview from '../assets/images/nakshaghor_preview_1784736922544.jpg';

export const initialSiteConfig: SiteConfig = {
  developerName: "ISHAQ AHMED",
  title: "Full Stack Web Developer",
  location: "Bangladesh",
  email: "ishaqahmed.dev@gmail.com",
  whatsapp: "+8801749032883",
  bkashNumber: "01749032883",
  tiktok: "@ishaq.dev",
  github: "https://github.com/ishaqahmed-dev",
  linkedin: "https://linkedin.com/in/ishaqahmed-dev",
  bio: "Full Stack Web Developer specializing in building high-performance, modern, responsive, and user-friendly web applications using React, Tailwind CSS, Node.js, Express, Firebase, and MongoDB. Currently studying in Class 9 while actively building production-grade web applications.",
  education: "Class 9 Student (Active Full Stack Practitioner)",
  experienceYears: "3+",
  completedProjects: "25+",
  happyClients: "20+",
  isAvailable: true,
  profileImage: profileAvatar,
  logoImage: ishaqLogo,
};

export const initialProjects: Project[] = [
  {
    id: "proj-1",
    title: "Hospital Management System",
    description: "Complete healthcare management portal featuring multi-role authentication (Admin, Doctor, Patient), automated appointment scheduling, medical prescription logs, patient records, and real-time dashboard analytics.",
    category: "Full Stack Web App",
    image: hospitalPreview,
    demoUrl: "https://hospital-ishaq2.netlify.app/",
    githubUrl: "https://github.com/ishaqahmed-dev/hospital-management-system",
    techStack: ["React", "Firebase Auth", "Node.js", "Express", "Tailwind CSS"],
    features: [
      "Role-Based Dashboards (Admin, Doctor, Patient)",
      "Instant Online Appointment Booking System",
      "Doctor Management & Shift Schedules",
      "Secure Medical Record Storage with Firebase",
      "Fully Responsive & Fast-Loading UI"
    ],
    featured: true,
  },
  {
    id: "proj-2",
    title: "Azelia Mart",
    description: "High-performance e-commerce platform built for fast loading, intuitive product discovery, category filtering, interactive shopping cart, checkout flow, and mobile-first responsive design.",
    category: "E-Commerce",
    image: azeliaPreview,
    demoUrl: "https://azeliamart.netlify.app/",
    githubUrl: "https://github.com/ishaqahmed-dev/azelia-mart-ecommerce",
    techStack: ["React", "JavaScript (ES6+)", "Tailwind CSS", "Local Storage State"],
    features: [
      "Modern Glassmorphism E-Commerce Layout",
      "Instant Search & Category Filter System",
      "Dynamic Cart Drawer & Price Calculation",
      "Mobile-Optimized Touch Interfaces",
      "Sub-Second Page Load Optimization"
    ],
    featured: true,
  },
  {
    id: "proj-3",
    title: "NakshaGhor Inventory",
    description: "Comprehensive business inventory and stock management software. Streamlines stock updates, sales invoicing, supplier logs, automated low-stock alerts, and visual financial analytics.",
    category: "Business Software",
    image: nakshaghorPreview,
    demoUrl: "https://nakshaghorbd.netlify.app/",
    githubUrl: "https://github.com/ishaqahmed-dev/nakshaghor-inventory-system",
    techStack: ["React", "Node.js", "MongoDB", "Express.js", "Tailwind CSS"],
    features: [
      "Real-Time Stock Inventory Tracker",
      "Supplier & Product Purchase Loggers",
      "Automated Monthly Revenue & Sales Reports",
      "RESTful API Architecture with MongoDB",
      "Clean Executive Dark Theme UI"
    ],
    featured: true,
  },
  {
    id: "proj-4",
    title: "SaaS Analytics & Billing Portal",
    description: "Custom admin dashboard for subscription monitoring, user usage metrics, API key management, and automated invoice PDF generation.",
    category: "Full Stack Web App",
    image: hospitalPreview,
    demoUrl: "https://hospital-ishaq2.netlify.app/",
    githubUrl: "https://github.com/ishaqahmed-dev/saas-analytics-portal",
    techStack: ["React", "Node.js", "Express", "Chart.js", "Tailwind CSS"],
    features: [
      "Real-Time Telemetry & Visitor Graphs",
      "User Subscription State Management",
      "Custom RESTful Endpoint Integration",
      "Dark Obsidian Interface Aesthetics"
    ],
    featured: false,
  }
];

export const initialServices: Service[] = [
  {
    id: "srv-1",
    title: "Full Stack Web Applications",
    description: "End-to-end web application development using modern MERN & React/Node stack with secure backend logic and lightning-fast database structures.",
    iconName: "Code2",
    features: [
      "Custom React / Node.js Architecture",
      "MongoDB or Firebase Backend Integration",
      "RESTful API Development & Testing",
      "User Authentication & Authorization",
      "Scalable Cloud Deployment Setup"
    ],
    startingPrice: "৳15,000 / $149",
    popular: true
  },
  {
    id: "srv-2",
    title: "E-Commerce Solutions",
    description: "Custom online storefronts engineered for maximum conversion, smooth product browsing, shopping carts, bKash & mobile wallet checkout integration.",
    iconName: "ShoppingBag",
    features: [
      "High-Converting Product Showcase",
      "Cart & Checkout Order Management",
      "bKash & Local Mobile Payment Support",
      "Admin Inventory & Sales Tracker",
      "Mobile-First Responsive Layout"
    ],
    startingPrice: "৳18,000 / $179",
    popular: true
  },
  {
    id: "srv-3",
    title: "Custom Admin Dashboards & APIs",
    description: "Tailor-made management panels to monitor business operations, automate workflows, manage users, and visualize key performance metrics.",
    iconName: "LayoutDashboard",
    features: [
      "Interactive Data Charts & Analytics",
      "Role-Based Access Control (RBAC)",
      "Secure Database Ingestion",
      "Export Data to Excel / CSV / PDF",
      "Real-time Updates"
    ],
    startingPrice: "৳12,000 / $119"
  },
  {
    id: "srv-4",
    title: "Responsive UI/UX Web Design",
    description: "Modern, glassmorphic obsidian cyberpunk web interfaces engineered with Tailwind CSS and Motion animations for maximum visual impact.",
    iconName: "Palette",
    features: [
      "Sleek Glassmorphic Dark & Light Themes",
      "Flawless Cross-Device Compatibility",
      "Micro-Interactions & Motion Effects",
      "Pixel-Perfect Component Architecture",
      "Clean Accessibility Standards"
    ],
    startingPrice: "৳8,000 / $79"
  },
  {
    id: "srv-5",
    title: "Speed Optimization & SEO",
    description: "Transform existing slow websites into ultra-fast web apps scoring 90+ on Google PageSpeed, paired with clean technical SEO markup.",
    iconName: "Zap",
    features: [
      "Google PageSpeed 90+ Score Guarantee",
      "Bundle Size Reduction & Lazy Loading",
      "Technical SEO & OpenGraph Meta Tags",
      "Image WebP Compression & Caching",
      "Clean Code Refactoring"
    ],
    startingPrice: "৳5,000 / $49"
  }
];

export const initialSkills: SkillItem[] = [
  // Frontend
  { name: "HTML5", level: 95, category: "frontend" },
  { name: "CSS3", level: 90, category: "frontend" },
  { name: "JavaScript (ES6+)", level: 90, category: "frontend" },
  { name: "Tailwind CSS", level: 85, category: "frontend" },
  { name: "Bootstrap", level: 85, category: "frontend" },
  { name: "React 18+", level: 90, category: "frontend" },
  
  // Backend & Database
  { name: "Node.js", level: 85, category: "backend" },
  { name: "Express.js", level: 80, category: "backend" },
  { name: "Firebase (Auth & Firestore)", level: 85, category: "backend" },
  { name: "MongoDB", level: 80, category: "backend" },
  { name: "REST APIs", level: 88, category: "backend" },

  // Tools
  { name: "Git", level: 90, category: "tools" },
  { name: "GitHub", level: 90, category: "tools" },
  { name: "VS Code", level: 95, category: "tools" },
  { name: "Netlify / Vercel", level: 85, category: "tools" },
  { name: "npm / Vite", level: 90, category: "tools" }
];

export const initialPricingPlans: PricingPlan[] = [
  {
    id: "plan-starter",
    name: "Starter Package",
    priceUSD: 99,
    priceBDT: 10000,
    deliveryTime: "3-5 Business Days",
    description: "Ideal for personal branding, portfolios, or small business landing pages requiring fast loading and sleek design.",
    features: [
      "Up to 5 Responsive Pages / Sections",
      "Modern React + Tailwind CSS Stack",
      "Contact Form with Direct Email / WhatsApp Setup",
      "Mobile-Optimized & Touch Friendly",
      "Basic On-Page SEO Optimization",
      "1 Month Free Bug Support"
    ],
  },
  {
    id: "plan-pro",
    name: "Professional Web App",
    priceUSD: 249,
    priceBDT: 25000,
    deliveryTime: "7-10 Business Days",
    description: "Full-featured web application or e-commerce store with database, user auth, and custom backend services.",
    features: [
      "Complete Full Stack Web App / E-Commerce Store",
      "Firebase / MongoDB Database Integration",
      "Secure User Authentication & Admin Panel",
      "bKash & Mobile Wallet Payment Guidance",
      "Custom Dashboard with Order Management",
      "Speed Optimization (90+ PageSpeed Score)",
      "3 Months Dedicated Maintenance & Updates"
    ],
    popular: true
  },
  {
    id: "plan-enterprise",
    name: "Custom Enterprise Solution",
    priceUSD: 499,
    priceBDT: 50000,
    deliveryTime: "14-21 Business Days",
    description: "Tailored multi-role business software, custom APIs, inventory management, and specialized cloud integrations.",
    features: [
      "Complex Multi-Role Platform (Admin, Doctor, Client, Manager)",
      "Custom RESTful APIs & Microservices",
      "Real-time Inventory or Appointment Booking Engine",
      "Advanced Data Analytics & Automated PDF/CSV Exports",
      "6 Months Support & Priority Feature Requests",
      "1-on-1 Direct Consultation & Code Handover"
    ]
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: "testi-1",
    name: "Tanvir Rahman",
    role: "Founder & CEO",
    company: "Azelia Brands BD",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    comment: "Ishaq developed our Azelia Mart e-commerce platform and the performance is incredible! Very fast page loads, beautiful UI, and super responsive on mobile phones. Hard to believe he is in Class 9 — highly professional developer!",
    date: "2026-06-12"
  },
  {
    id: "testi-2",
    name: "Dr. Mahmudul Hasan",
    role: "Clinical Coordinator",
    company: "CareLine Health",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    comment: "The Hospital Management System Ishaq built for us streamlined our entire doctor schedule and patient record process. Firebase auth worked flawlessly and the admin panel is super intuitive.",
    date: "2026-05-28"
  },
  {
    id: "testi-3",
    name: "Sharmin Akter",
    role: "Operations Lead",
    company: "NakshaGhor Crafts",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    rating: 5,
    comment: "Our inventory system was chaotic until NakshaGhor Inventory was created. Ishaq listened to every single requirement and delivered on time with bKash order tracking functionality. 10/10 recommendation!",
    date: "2026-04-15"
  }
];
