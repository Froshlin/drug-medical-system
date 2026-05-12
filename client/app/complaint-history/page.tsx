'use client';
import ProtectedRoute from '@/lib/protectedRoute';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import GlassCard from '@/components/GlassCard';
import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/services/api';

interface Complaint {
  _id: string;
  complaint: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
  doctorResponse?: string;
}

export default function MyComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyComplaints = async () => {
    try {
      const res = await api.get('/complaints/my');   // New endpoint for patient's own complaints
      setComplaints(res.data.complaints || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load your complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMyComplaints();
  }, []);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-NG', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(dateString));
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <Sidebar />

      <main className="lg:ml-72 pt-20 min-h-screen p-6 lg:p-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">My Complaints</h1>
          <p className="text-gray-400 mb-10">All your submitted complaints and doctor responses</p>

          {loading ? (
            <p className="text-center py-20 text-gray-400">Loading your complaints...</p>
          ) : complaints.length === 0 ? (
            <GlassCard className="p-20 text-center">
              <p className="text-6xl mb-4">📭</p>
              <h3 className="text-xl">You haven&apos;t submitted any complaints yet</h3>
            </GlassCard>
          ) : (
            <div className="space-y-6">
              {complaints.map((item) => (
                <GlassCard key={item._id} className="p-7">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                        <Calendar size={16} />
                        {formatDate(item.createdAt)}
                      </div>

                      <p className="text-gray-300 leading-relaxed mb-5">
                        {item.complaint}
                      </p>

                      {item.doctorResponse && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5">
                          <p className="text-green-400 text-sm font-medium mb-2">Doctor&apos;s Response:</p>
                          <p className="text-gray-300">{item.doctorResponse}</p>
                        </div>
                      )}
                    </div>

                    <span className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize ${
                      item.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      item.status === 'reviewed' ? 'bg-blue-500/20 text-blue-400' : 
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}