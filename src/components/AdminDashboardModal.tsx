import React, { useState, useEffect } from 'react';
import { ContactMessage, Project, PricingPlan, Testimonial, SiteConfig } from '../types';
import { Shield, Lock, X, Trash2, Plus, Edit, Download, MessageSquare, Briefcase, DollarSign, Settings, ShoppingBag, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';
import { db, collection, getDocs, updateDoc, deleteDoc, doc } from '../lib/firebase';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ContactMessage[];
  projects: Project[];
  plans: PricingPlan[];
  testimonials: Testimonial[];
  config: SiteConfig;
  onAdminAuthenticated?: () => void;
  onUpdateMessageStatus: (id: string, status: 'Unread' | 'Contacted' | 'Completed') => void;
  onDeleteMessage: (id: string) => void;
  onAddProject: (project: Omit<Project, 'id'>) => void;
  onUpdateProject?: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onAddPlan: (plan: Omit<PricingPlan, 'id'>) => void;
  onDeletePlan: (id: string) => void;
  onUpdatePlan: (plan: PricingPlan) => void;
  onUpdateConfig: (newConfig: Partial<SiteConfig>) => void;
  onExportData: () => void;
  onImportData: (jsonData: string) => void;
}

interface FirestoreOrder {
  id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  planName: string;
  price: string;
  bkashTransaction: string;
  projectRequirements: string;
  paymentStatus?: 'Paid' | 'Unpaid';
  orderStatus?: 'Pending' | 'In Progress' | 'Confirmed' | 'Cancelled';
  status?: string;
  createdAt: string;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  messages,
  projects,
  plans,
  testimonials,
  config,
  onAdminAuthenticated,
  onUpdateMessageStatus,
  onDeleteMessage,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onAddPlan,
  onDeletePlan,
  onUpdatePlan,
  onUpdateConfig,
  onExportData,
  onImportData,
}) => {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('ishaq_admin_authenticated') === 'true';
  });
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'messages' | 'projects' | 'plans' | 'settings'>('orders');

  // Firestore orders
  const [dbOrders, setDbOrders] = useState<FirestoreOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // New / Edit Project Form State
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjCategory, setNewProjCategory] = useState<'Full Stack Web App' | 'E-Commerce' | 'Business Software' | 'UI/UX Design'>('Full Stack Web App');
  const [newProjDemo, setNewProjDemo] = useState('');
  const [newProjTech, setNewProjTech] = useState('');
  const [newProjImage, setNewProjImage] = useState('');

  // New Pricing Plan Form State
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [planTitle, setPlanTitle] = useState('');
  const [planPrice, setPlanPrice] = useState('');
  const [planDelivery, setPlanDelivery] = useState('');
  const [planDesc, setPlanDesc] = useState('');
  const [planFeatures, setPlanFeatures] = useState('');
  const [planPopular, setPlanPopular] = useState(false);
  const [planBkash, setPlanBkash] = useState('01749032883');

  // Config Form State
  const [tempWhatsapp, setTempWhatsapp] = useState(config.whatsapp);
  const [tempEmail, setTempEmail] = useState(config.email);
  const [tempBio, setTempBio] = useState(config.bio);
  const [tempAvailable, setTempAvailable] = useState(config.isAvailable);
  const [tempPhoto, setTempPhoto] = useState(config.profileImage);
  const [tempLogo, setTempLogo] = useState(config.logoImage || '');

  useEffect(() => {
    setTempWhatsapp(config.whatsapp);
    setTempEmail(config.email);
    setTempBio(config.bio);
    setTempAvailable(config.isAvailable);
    setTempPhoto(config.profileImage);
    setTempLogo(config.logoImage || '');
  }, [config]);

  // Helper function to compress images before saving to prevent Firestore 1MB document size limit errors
  const compressImageFile = (file: File, callback: (dataUrl: string) => void) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 500;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.8);
          callback(compressed);
        } else {
          if (typeof reader.result === 'string') callback(reader.result);
        }
      };
      img.onerror = () => {
        if (typeof reader.result === 'string') callback(reader.result);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchFirestoreOrders();
    }
  }, [isAuthenticated]);

  const fetchFirestoreOrders = async () => {
    setLoadingOrders(true);
    try {
      const snap = await getDocs(collection(db, 'orders'));
      const ordersList: FirestoreOrder[] = [];
      snap.forEach(docSnap => {
        ordersList.push({ id: docSnap.id, ...docSnap.data() } as FirestoreOrder);
      });
      ordersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setDbOrders(ordersList);
    } catch (e) {
      console.error('Failed to load orders from Firestore', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    newPaymentStatus: 'Paid' | 'Unpaid',
    newOrderStatus: 'Pending' | 'In Progress' | 'Confirmed' | 'Cancelled'
  ) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        paymentStatus: newPaymentStatus,
        orderStatus: newOrderStatus,
        status: newOrderStatus.toLowerCase().replace(' ', '_'),
      });
      setDbOrders(prev =>
        prev.map(o =>
          o.id === orderId
            ? { ...o, paymentStatus: newPaymentStatus, orderStatus: newOrderStatus }
            : o
        )
      );
    } catch (err) {
      console.error('Error updating order status in Firestore:', err);
      alert('Could not update status in database.');
    }
  };

  const handleDeleteFirestoreOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order record?')) return;
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      setDbOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) {
      console.error('Error deleting order from Firestore:', err);
      alert('Failed to delete order record.');
    }
  };

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === 'Fahim#123' || pin.trim() === '1234' || pin.trim() === '01749032883') {
      setIsAuthenticated(true);
      localStorage.setItem('ishaq_admin_authenticated', 'true');
      setPinError(false);
      if (onAdminAuthenticated) onAdminAuthenticated();
    } else {
      setPinError(true);
    }
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ishaq_admin_authenticated');
    setPin('');
  };

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle || !newProjDemo) return;

    const finalImg = newProjImage.trim() || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';

    if (editingProjectId && onUpdateProject) {
      onUpdateProject({
        id: editingProjectId,
        title: newProjTitle,
        description: newProjDesc,
        category: newProjCategory,
        image: finalImg,
        demoUrl: newProjDemo,
        techStack: newProjTech.split(',').map(t => t.trim()).filter(Boolean),
        features: ['Responsive Design', 'Fast Loading', 'Firebase Realtime Backend'],
        featured: true,
      });
      alert('প্রজেক্টের তথ্য ও ছবি সফলভাবে আপডেট করা হয়েছে এবং ফায়ারবেসে সেভ হয়েছে!');
    } else {
      onAddProject({
        title: newProjTitle,
        description: newProjDesc,
        category: newProjCategory,
        image: finalImg,
        demoUrl: newProjDemo,
        techStack: newProjTech.split(',').map(t => t.trim()).filter(Boolean),
        features: ['Responsive Design', 'Fast Loading', 'Firebase Realtime Backend'],
        featured: true,
      });
      alert('নতুন প্রজেক্ট ছবিসহ ফায়ারবেস ডাটাবেসে সেভ করা হয়েছে!');
    }

    setEditingProjectId(null);
    setNewProjTitle('');
    setNewProjDesc('');
    setNewProjDemo('');
    setNewProjTech('');
    setNewProjImage('');
    setShowAddProject(false);
  };

  const handleStartEditProject = (p: Project) => {
    setEditingProjectId(p.id);
    setNewProjTitle(p.title);
    setNewProjCategory(p.category);
    setNewProjDemo(p.demoUrl);
    setNewProjTech(p.techStack ? p.techStack.join(', ') : '');
    setNewProjDesc(p.description || '');
    setNewProjImage(p.image || '');
    setShowAddProject(true);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      whatsapp: tempWhatsapp,
      email: tempEmail,
      bio: tempBio,
      isAvailable: tempAvailable,
      profileImage: tempPhoto,
      logoImage: tempLogo,
    });
    alert('Website configuration & pictures updated successfully and permanently saved to Firebase database!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white max-w-4xl w-full p-6 rounded-3xl border border-sky-100 text-slate-800 relative my-6 space-y-6 max-h-[92vh] overflow-y-auto shadow-2xl">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-sky-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-700 border border-sky-200">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Ishaq Dev &bull; Admin Portal</h3>
              <p className="text-[11px] text-slate-500">Firebase Database & Secret Management</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleAdminLogout}
                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold transition-all cursor-pointer mr-1"
                title="Log out from Admin panel"
              >
                Logout (লগআউট)
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-sky-50 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isAuthenticated ? (
          /* PIN Authentication Step */
          <div className="max-w-md mx-auto py-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center mx-auto shadow-xs">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-bold text-slate-900">Enter Admin Access PIN</h4>
              <p className="text-xs text-slate-500">
                Protected area for Ishaq Ahmed to manage client orders, site settings, and portfolio configuration.
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <input
                type="password"
                maxLength={11}
                required
                placeholder="Enter PIN..."
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-sky-100 text-center text-xl font-mono text-slate-900 focus:border-sky-500 focus:outline-none"
              />

              {pinError && (
                <p className="text-xs font-semibold text-rose-600">
                  Invalid PIN! Please check and try again.
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 cursor-pointer"
              >
                Unlock Admin Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard Interface */
          <div className="space-y-6">
            
            {/* Tabs Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky-100 pb-3">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-sky-50'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Firebase Orders ({dbOrders.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('messages')}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'messages'
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-sky-50'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Messages ({messages.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('projects')}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'projects'
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-sky-50'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Projects ({projects.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('plans')}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'plans'
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-sky-50'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Pricing Plans ({plans.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-sky-50'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Site Config</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onExportData}
                  title="Export Site Backup JSON"
                  className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-mono flex items-center gap-1 border border-sky-200 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-sky-600" />
                  <span className="hidden sm:inline">Export JSON</span>
                </button>
              </div>
            </div>

            {/* TAB 0: Firebase Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">Firestore Cloud Orders Management</h4>
                  <button
                    onClick={fetchFirestoreOrders}
                    className="px-3 py-1 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold hover:bg-sky-100 cursor-pointer"
                  >
                    Refresh Orders
                  </button>
                </div>

                {loadingOrders ? (
                  <div className="text-center py-8 text-xs text-slate-500">Loading orders from Firebase Firestore...</div>
                ) : dbOrders.length === 0 ? (
                  <div className="p-8 text-center bg-sky-50/50 rounded-2xl border border-sky-100 text-slate-500 text-xs">
                    No orders submitted yet in Firebase database. Submit a test order on the Pricing section or Order Modal!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dbOrders.map((ord) => (
                      <div key={ord.id} className="p-4 rounded-2xl bg-white border border-sky-100 shadow-xs space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{ord.userName}</span>
                            <span className="text-xs text-sky-700 font-mono font-bold">&bull; {ord.userEmail}</span>
                            <span className="text-xs text-emerald-700 font-mono font-bold">&bull; {ord.userPhone}</span>
                          </div>

                          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-100 text-sky-800 border border-sky-200">
                            {ord.planName} - {ord.price}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-sky-100 whitespace-pre-wrap font-mono">
                          {ord.projectRequirements}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                          <span className="text-pink-700 font-bold">bKash Trx: {ord.bkashTransaction}</span>
                          <span className="text-slate-400">Date: {new Date(ord.createdAt).toLocaleString()}</span>
                        </div>

                        {/* Admin Status Controls */}
                        <div className="pt-3 border-t border-sky-100 flex flex-wrap items-center justify-between gap-3 bg-sky-50/50 p-3 rounded-2xl">
                          <div className="flex flex-wrap items-center gap-4 text-xs">
                            
                            {/* Payment Status Dropdown */}
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-700">পেমেন্ট:</span>
                              <select
                                value={ord.paymentStatus || 'Unpaid'}
                                onChange={(e) => handleUpdateOrderStatus(
                                  ord.id,
                                  e.target.value as 'Paid' | 'Unpaid',
                                  ord.orderStatus || 'Pending'
                                )}
                                className={`px-2.5 py-1 rounded-xl text-xs font-bold border cursor-pointer ${
                                  (ord.paymentStatus || 'Unpaid') === 'Paid'
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : 'bg-rose-100 text-rose-800 border-rose-300'
                                }`}
                              >
                                <option value="Unpaid">Unpaid (আনপেইড)</option>
                                <option value="Paid">Paid (পেইড)</option>
                              </select>
                            </div>

                            {/* Order Status Dropdown */}
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-700">অর্ডার স্ট্যাটাস:</span>
                              <select
                                value={ord.orderStatus || 'Pending'}
                                onChange={(e) => handleUpdateOrderStatus(
                                  ord.id,
                                  ord.paymentStatus || 'Unpaid',
                                  e.target.value as any
                                )}
                                className={`px-2.5 py-1 rounded-xl text-xs font-bold border cursor-pointer ${
                                  (ord.orderStatus || 'Pending') === 'Confirmed' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                                  (ord.orderStatus || 'Pending') === 'In Progress' ? 'bg-sky-100 text-sky-800 border-sky-300' :
                                  (ord.orderStatus || 'Pending') === 'Cancelled' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                                  'bg-amber-100 text-amber-800 border-amber-300'
                                }`}
                              >
                                <option value="Pending">Pending (পেন্ডিং)</option>
                                <option value="In Progress">In Progress (চলমান)</option>
                                <option value="Confirmed">Confirmed (কনফার্মড)</option>
                                <option value="Cancelled">Cancelled (ক্যানসেলড)</option>
                              </select>
                            </div>

                          </div>

                          <button
                            onClick={() => handleDeleteFirestoreOrder(ord.id)}
                            className="p-1.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1 border border-rose-200 cursor-pointer"
                            title="Delete Order Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 1: Messages */}
            {activeTab === 'messages' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">Client Messages & Inquiries</h4>
                  <span className="text-xs text-slate-500">Total: {messages.length} Records</span>
                </div>

                {messages.length === 0 ? (
                  <div className="p-8 text-center bg-sky-50/50 rounded-2xl border border-sky-100 text-slate-500 text-xs">
                    No client messages recorded yet. Submit a test message on the contact section!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-4 rounded-2xl bg-white border border-sky-100 shadow-xs space-y-2 relative"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{msg.name}</span>
                            <span className="text-xs text-sky-700 font-mono font-bold">&bull; {msg.email}</span>
                            {msg.phone && <span className="text-xs text-emerald-700 font-mono font-bold">&bull; {msg.phone}</span>}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                              msg.status === 'Unread' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                              msg.status === 'Contacted' ? 'bg-sky-100 text-sky-800 border border-sky-200' :
                              'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}>
                              {msg.status}
                            </span>

                            <button
                              onClick={() => onDeleteMessage(msg.id)}
                              className="p-1 rounded text-slate-400 hover:text-rose-600"
                              title="Delete Message"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="text-xs font-semibold text-slate-800">{msg.subject}</div>

                        <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-sky-100 whitespace-pre-wrap font-mono">
                          {msg.message}
                        </p>

                        {msg.bkashTrxId && (
                          <div className="text-xs font-mono text-pink-700 bg-pink-50 px-3 py-1.5 rounded-lg border border-pink-200">
                            bKash Transaction ID: <strong className="text-slate-900">{msg.bkashTrxId}</strong>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 text-[10px] text-slate-500 font-mono">
                          <span>Received: {msg.createdAt}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => onUpdateMessageStatus(msg.id, 'Contacted')}
                              className="hover:text-sky-700 font-bold"
                            >
                              Mark Contacted
                            </button>
                            <span>&bull;</span>
                            <button
                              onClick={() => onUpdateMessageStatus(msg.id, 'Completed')}
                              className="hover:text-emerald-700 font-bold"
                            >
                              Mark Completed
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Projects */}
            {activeTab === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">Portfolio Projects Manager</h4>
                  <button
                    onClick={() => {
                      setEditingProjectId(null);
                      setNewProjTitle('');
                      setNewProjCategory('Full Stack Web App');
                      setNewProjDemo('');
                      setNewProjTech('');
                      setNewProjDesc('');
                      setNewProjImage('');
                      setShowAddProject(!showAddProject);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddProject && !editingProjectId ? 'Close Form' : 'Add New Project'}</span>
                  </button>
                </div>

                {showAddProject && (
                  <form onSubmit={handleCreateProjectSubmit} className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-3.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-sky-900 uppercase tracking-wide">
                        {editingProjectId ? 'Edit Project Details & Photo (প্রজেক্ট এডিট)' : 'Create New Showcase Project'}
                      </h5>
                      {editingProjectId && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                          Editing ID: {editingProjectId}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Project Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Modern E-Commerce Platform"
                          value={newProjTitle}
                          onChange={(e) => setNewProjTitle(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-sky-100 text-xs text-slate-800 focus:outline-none focus:border-sky-400"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Category *</label>
                        <select
                          value={newProjCategory}
                          onChange={(e) => setNewProjCategory(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-sky-100 text-xs text-slate-800 focus:outline-none focus:border-sky-400"
                        >
                          <option value="Full Stack Web App">Full Stack Web App</option>
                          <option value="E-Commerce">E-Commerce</option>
                          <option value="Business Software">Business Software</option>
                          <option value="UI/UX Design">UI/UX Design</option>
                        </select>
                      </div>
                    </div>

                    {/* Project Image Section */}
                    <div className="p-3 rounded-xl bg-white border border-sky-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-800">Project Image (প্রজেক্টের ছবি)</div>
                          <div className="text-[11px] text-slate-500">Auto-compressed for fast loading & saved permanently in Firebase</div>
                        </div>

                        {newProjImage ? (
                          <img
                            src={newProjImage}
                            alt="Project Preview"
                            className="w-16 h-12 rounded-lg object-cover border-2 border-sky-400 shadow-xs"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-16 h-12 rounded-lg bg-slate-100 border border-dashed border-sky-300 text-[10px] text-slate-400 font-bold flex items-center justify-center text-center p-1">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="text-[11px] text-slate-600 font-semibold block mb-1">Upload Project Image File</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                compressImageFile(file, (compressedUrl) => {
                                  setNewProjImage(compressedUrl);
                                });
                              }
                            }}
                            className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-500 file:text-white cursor-pointer"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-600 font-semibold block mb-1">Or Direct Image URL</label>
                          <input
                            type="text"
                            value={newProjImage}
                            onChange={(e) => setNewProjImage(e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-sky-100 text-xs text-slate-800 focus:outline-none focus:border-sky-400"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Live Demo URL *</label>
                        <input
                          type="url"
                          required
                          placeholder="e.g. https://my-app.netlify.app/"
                          value={newProjDemo}
                          onChange={(e) => setNewProjDemo(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-sky-100 text-xs text-slate-800 focus:outline-none focus:border-sky-400"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Tech Stack (comma separated)</label>
                        <input
                          type="text"
                          placeholder="React, Node, Firebase, Tailwind..."
                          value={newProjTech}
                          onChange={(e) => setNewProjTech(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-sky-100 text-xs text-slate-800 focus:outline-none focus:border-sky-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Description</label>
                      <textarea
                        placeholder="Project features & description..."
                        rows={2}
                        value={newProjDesc}
                        onChange={(e) => setNewProjDesc(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-sky-100 text-xs text-slate-800 focus:outline-none focus:border-sky-400"
                      ></textarea>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddProject(false);
                          setEditingProjectId(null);
                        }}
                        className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white rounded-xl shadow-xs transition-all cursor-pointer"
                      >
                        {editingProjectId ? 'Update Project (সেভ করুন)' : 'Save New Project (ফায়ারবেসে সেভ করুন)'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projects.map((p) => (
                    <div key={p.id} className="p-3 rounded-2xl bg-white border border-sky-100 flex items-center justify-between gap-3 shadow-xs hover:border-sky-300 transition-all">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img
                          src={p.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'}
                          alt={p.title}
                          className="w-14 h-12 rounded-xl object-cover border border-sky-200 flex-shrink-0 bg-slate-100"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-800 truncate">{p.title}</div>
                          <span className="inline-block text-[10px] font-semibold text-sky-600 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-100 mb-0.5">
                            {p.category}
                          </span>
                          <div className="text-[10px] text-slate-500 font-mono truncate">{p.demoUrl}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEditProject(p)}
                          className="p-1.5 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 border border-sky-100 cursor-pointer"
                          title="Edit Project & Image"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteProject(p.id)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: Pricing Plans Manager */}
            {activeTab === 'plans' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">Hire Me & Pricing Packages Manager</h4>
                  <button
                    onClick={() => {
                      setEditingPlanId(null);
                      setPlanTitle('');
                      setPlanPrice('৳');
                      setPlanDelivery('3-5 Days');
                      setPlanDesc('');
                      setPlanFeatures('Responsive Layout\nCustom Frontend & API\n1 Month Support');
                      setPlanPopular(false);
                      setShowAddPlan(!showAddPlan);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Package</span>
                  </button>
                </div>

                {showAddPlan && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const featuresArr = planFeatures.split('\n').map(f => f.trim()).filter(Boolean);
                      if (editingPlanId) {
                        onUpdatePlan({
                          id: editingPlanId,
                          name: planTitle,
                          price: planPrice,
                          duration: planDelivery,
                          description: planDesc,
                          features: featuresArr,
                          popular: planPopular,
                          bkashNumber: planBkash,
                        });
                      } else {
                        onAddPlan({
                          name: planTitle,
                          price: planPrice,
                          duration: planDelivery,
                          description: planDesc,
                          features: featuresArr,
                          popular: planPopular,
                          bkashNumber: planBkash,
                        });
                      }
                      setShowAddPlan(false);
                      setEditingPlanId(null);
                    }}
                    className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-3"
                  >
                    <h5 className="text-xs font-bold text-sky-800 uppercase">
                      {editingPlanId ? 'Edit Package' : 'Create New Package'}
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-600 font-semibold block mb-1">Package Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Starter Package / Custom App"
                          value={planTitle}
                          onChange={(e) => setPlanTitle(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-sky-100 text-xs text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-600 font-semibold block mb-1">Price (BDT / USD)</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. ৳5,000 / $50"
                          value={planPrice}
                          onChange={(e) => setPlanPrice(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-sky-100 text-xs text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-600 font-semibold block mb-1">Delivery Duration</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 3-5 Days"
                          value={planDelivery}
                          onChange={(e) => setPlanDelivery(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-sky-100 text-xs text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-600 font-semibold block mb-1">bKash Payment Number</label>
                        <input
                          type="text"
                          required
                          value={planBkash}
                          onChange={(e) => setPlanBkash(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-sky-100 text-xs text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-600 font-semibold block mb-1">Short Description</label>
                      <input
                        type="text"
                        placeholder="Brief summary of what client gets..."
                        value={planDesc}
                        onChange={(e) => setPlanDesc(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-sky-100 text-xs text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-600 font-semibold block mb-1">Features List (1 per line)</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                        value={planFeatures}
                        onChange={(e) => setPlanFeatures(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-sky-100 text-xs text-slate-800 font-mono"
                      ></textarea>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="planPop"
                        checked={planPopular}
                        onChange={(e) => setPlanPopular(e.target.checked)}
                        className="accent-sky-600"
                      />
                      <label htmlFor="planPop" className="text-xs text-slate-700">
                        Highlight as "Most Popular / Recommended" Package
                      </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddPlan(false)}
                        className="px-3 py-1.5 text-xs text-slate-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 text-xs font-bold bg-sky-500 text-white rounded-xl"
                      >
                        {editingPlanId ? 'Update Package' : 'Save Package'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {plans.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl bg-white border border-sky-100 shadow-xs flex flex-wrap items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-800">{p.name}</span>
                          <span className="text-xs font-mono font-bold text-sky-700">{p.price}</span>
                          {p.popular && (
                            <span className="text-[10px] bg-sky-100 text-sky-800 border border-sky-200 px-2 py-0.5 rounded font-bold">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{p.description}</p>
                        <div className="text-[11px] text-slate-400 mt-1">
                          Delivery: {p.duration} &bull; Features: {p.features.length} Items
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingPlanId(p.id);
                            setPlanTitle(p.name);
                            setPlanPrice(p.price);
                            setPlanDelivery(p.duration);
                            setPlanDesc(p.description);
                            setPlanFeatures(p.features.join('\n'));
                            setPlanPopular(p.popular || false);
                            setPlanBkash(p.bkashNumber || '01749032883');
                            setShowAddPlan(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => onDeletePlan(p.id)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                          title="Delete Package"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Settings */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Agency & Developer Settings</h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-sky-100 shadow-xs">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Freelance Availability Status</div>
                      <div className="text-[11px] text-slate-500">Controls the green availability status pill on Hero section</div>
                    </div>

                    <input
                      type="checkbox"
                      checked={tempAvailable}
                      onChange={(e) => setTempAvailable(e.target.checked)}
                      className="accent-sky-600 h-5 w-5 rounded cursor-pointer"
                    />
                  </div>

                  {/* Developer Profile Photo Setting */}
                  <div className="p-3.5 rounded-2xl bg-white border border-sky-100 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Developer Profile Photo (ডেভেলপার ছবি)</div>
                        <div className="text-[11px] text-slate-500">Auto-compressed for fast loading & permanent database persistence</div>
                      </div>

                      {tempPhoto && (
                        <img
                          src={tempPhoto}
                          alt="Current Preview"
                          className="w-11 h-11 rounded-full object-cover border-2 border-sky-500 shadow-xs"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-[11px] text-slate-600 font-semibold block mb-1">Upload Profile Photo</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              compressImageFile(file, (compressedUrl) => {
                                setTempPhoto(compressedUrl);
                              });
                            }
                          }}
                          className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-500 file:text-white cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-600 font-semibold block mb-1">Or Profile Photo URL</label>
                        <input
                          type="text"
                          value={tempPhoto}
                          onChange={(e) => setTempPhoto(e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-sky-100 text-xs text-slate-800 focus:outline-none focus:border-sky-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Website Brand Logo Setting */}
                  <div className="p-3.5 rounded-2xl bg-white border border-sky-100 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800">Website Brand Logo (ওয়েবসাইটের লোগো)</div>
                        <div className="text-[11px] text-slate-500">Appears in Navigation Header & Footer</div>
                      </div>

                      {tempLogo ? (
                        <img
                          src={tempLogo}
                          alt="Logo Preview"
                          className="w-11 h-11 rounded-xl object-contain border border-sky-300 p-0.5 bg-slate-900 shadow-xs"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-slate-900 border border-sky-400 text-sky-400 font-black text-xs flex items-center justify-center">
                          ID
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-[11px] text-slate-600 font-semibold block mb-1">Upload Brand Logo</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              compressImageFile(file, (compressedUrl) => {
                                setTempLogo(compressedUrl);
                              });
                            }
                          }}
                          className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-500 file:text-white cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-600 font-semibold block mb-1">Or Logo Image URL</label>
                        <input
                          type="text"
                          value={tempLogo}
                          onChange={(e) => setTempLogo(e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-sky-100 text-xs text-slate-800 focus:outline-none focus:border-sky-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-600 font-semibold block mb-1">WhatsApp & bKash Number</label>
                      <input
                        type="text"
                        value={tempWhatsapp}
                        onChange={(e) => setTempWhatsapp(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-sky-100 text-xs text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-600 font-semibold block mb-1">Contact Email</label>
                      <input
                        type="email"
                        value={tempEmail}
                        onChange={(e) => setTempEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-sky-100 text-xs text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 font-semibold block mb-1">Developer Bio</label>
                    <textarea
                      rows={3}
                      value={tempBio}
                      onChange={(e) => setTempBio(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-sky-100 text-xs text-slate-800"
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Save Site Configuration
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
