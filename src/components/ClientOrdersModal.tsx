import React, { useEffect, useState } from 'react';
import { X, ShoppingBag, Clock, CheckCircle, AlertCircle, XCircle, Phone, CreditCard, Sparkles, User as UserIcon } from 'lucide-react';
import { db, collection, query, where, onSnapshot, User } from '../lib/firebase';
import { Order } from '../types';

interface ClientOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
}

export const ClientOrdersModal: React.FC<ClientOrdersModalProps> = ({ isOpen, onClose, currentUser }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !currentUser) return;

    setLoading(true);
    // Query client orders from Firestore
    const q = query(collection(db, 'orders'), where('userEmail', '==', currentUser.email));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Order[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Order);
      });
      // Sort newest first
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(list);
      setLoading(false);
    }, (err) => {
      console.error('Error listening to client orders:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white max-w-2xl w-full rounded-3xl border border-sky-100 shadow-2xl overflow-hidden p-6 space-y-5 max-h-[90vh] flex flex-col">
        
        {/* Modal Header & User Profile Card */}
        <div className="flex items-center justify-between border-b border-sky-100 pb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 overflow-hidden">
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="User Profile" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-6 h-6" />
              )}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {currentUser?.displayName || 'My Client Profile'}
              </h3>
              <p className="text-xs text-sky-700 font-mono font-semibold">
                {currentUser?.email} &bull; {orders.length} Order(s) Placed
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-sky-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto space-y-4 pr-1 flex-1">
          {loading ? (
            <div className="text-center py-10 text-xs text-slate-500 font-mono">
              Loading orders from Firebase...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 space-y-3 bg-sky-50/50 rounded-2xl border border-sky-100 p-6">
              <ShoppingBag className="w-10 h-10 text-sky-400 mx-auto opacity-80" />
              <h4 className="text-sm font-bold text-slate-700">No Orders Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You haven't placed any website service orders or hire requests yet. Choose a package from Pricing section to order!
              </p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl bg-slate-50/90 border border-sky-100 space-y-3 shadow-xs hover:border-sky-300 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-500" />
                    <span className="text-sm font-extrabold text-slate-900">{ord.planName}</span>
                    <span className="text-xs font-mono font-extrabold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-lg border border-sky-200">
                      {ord.price}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Payment Status Badge */}
                    <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border ${
                      ord.paymentStatus === 'Paid'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border-rose-300'
                    }`}>
                      পেমেন্ট: {ord.paymentStatus === 'Paid' ? 'পেইড (Paid)' : 'আনপেইড (Unpaid)'}
                    </span>

                    {/* Order Progress Status Badge */}
                    <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 border ${
                      ord.orderStatus === 'Confirmed' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                      ord.orderStatus === 'In Progress' ? 'bg-sky-100 text-sky-800 border-sky-300' :
                      ord.orderStatus === 'Cancelled' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                      'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {ord.orderStatus === 'Confirmed' && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                      {ord.orderStatus === 'In Progress' && <Clock className="w-3.5 h-3.5 animate-spin text-sky-600" />}
                      {ord.orderStatus === 'Cancelled' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                      {(ord.orderStatus === 'Pending' || !ord.orderStatus) && <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
                      <span>
                        {ord.orderStatus === 'Confirmed' ? 'কনফার্মড (Confirmed)' :
                         ord.orderStatus === 'In Progress' ? 'চলমান (In Progress)' :
                         ord.orderStatus === 'Cancelled' ? 'ক্যানসেলড (Cancelled)' :
                         'পেন্ডিং (Pending)'}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-sky-500" />
                    <span>bKash Trx ID: <strong className="font-mono text-slate-800">{ord.bkashTransaction}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-sky-500" />
                    <span>Contact Phone: <strong className="font-mono text-slate-800">{ord.userPhone}</strong></span>
                  </div>
                </div>

                {ord.projectRequirements && (
                  <div className="p-3 rounded-xl bg-white border border-sky-100 text-xs text-slate-600 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-sky-600 font-mono">Project Requirements</div>
                    <p className="whitespace-pre-line leading-relaxed">{ord.projectRequirements}</p>
                  </div>
                )}

                <div className="text-[10px] text-slate-400 font-mono pt-1 flex items-center justify-between">
                  <span>Ordered on: {new Date(ord.createdAt).toLocaleString()}</span>
                  <span className="text-sky-600 font-semibold">Real-time Cloud Sync</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
