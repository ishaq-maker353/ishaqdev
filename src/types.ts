export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Full Stack Web App' | 'E-Commerce' | 'Business Software' | 'UI/UX Design';
  image: string;
  demoUrl: string;
  githubUrl?: string;
  techStack: string[];
  features: string[];
  featured?: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  features: string[];
  startingPrice: string;
  popular?: boolean;
}

export interface SkillItem {
  name: string;
  level: number;
  icon?: string;
  category: 'frontend' | 'backend' | 'tools';
}

export interface PricingPlan {
  id: string;
  name: string;
  priceUSD: number;
  priceBDT: number;
  deliveryTime: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  budget?: string;
  message: string;
  createdAt: string;
  status: 'Unread' | 'Contacted' | 'Completed';
  type: 'General Inquiry' | 'Order Booking';
  planName?: string;
  bkashTrxId?: string;
}

export interface SiteConfig {
  developerName: string;
  title: string;
  location: string;
  email: string;
  whatsapp: string;
  bkashNumber: string;
  tiktok: string;
  github: string;
  linkedin: string;
  bio: string;
  education: string;
  experienceYears: string;
  completedProjects: string;
  happyClients: string;
  isAvailable: boolean;
  profileImage: string;
  logoImage: string;
}

export interface Order {
  id: string;
  userId?: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  planName: string;
  price: string;
  bkashTransaction: string;
  projectRequirements: string;
  expressAddon?: boolean;
  hostingAddon?: boolean;
  paymentStatus?: 'Paid' | 'Unpaid';
  orderStatus?: 'Pending' | 'In Progress' | 'Confirmed' | 'Cancelled';
  status?: string;
  createdAt: string;
}
