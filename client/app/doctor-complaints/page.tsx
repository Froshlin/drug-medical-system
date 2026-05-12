'use client';
import ProtectedRoute from '@/lib/protectedRoute';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import GlassCard from '@/components/GlassCard';
import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/services/api';

interface Complaint {
    _id: string;
    patientName: string;
    complaint: string;
    status: 'pending' | 'reviewed' | 'resolved';
    createdAt: string;
    doctorResponse?: string;
}

export default function DoctorComplaints() {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState<string | null>(null); // Which complaint is being replied to
    const [responseText, setResponseText] = useState('');

    const fetchComplaints = async () => {
        try {
            const res = await api.get('/complaints');
            setComplaints(res.data.complaints || []);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Failed to load complaints");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchComplaints();
    }, []);

    const handleRespond = async (id: string) => {
        if (!responseText.trim()) {
            toast.error("Please write a response");
            return;
        }

        try {
            await api.put(`/complaints/${id}/respond`, { response: responseText });

            toast.success("Response sent successfully");
            setResponseText('');
            setActiveId(null);
            fetchComplaints(); // Refresh
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Failed to send response");
        }
    };

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dateString));
    };

    return (
        <ProtectedRoute>
            <Navbar />
            <Sidebar />

            <main className="lg:ml-72 pt-20 min-h-screen p-6 lg:p-10">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-bold mb-2">Patient Complaints</h1>
                    <p className="text-gray-400 mb-10">Review and respond to patient concerns</p>

                    {loading ? (
                        <p className="text-center py-20">Loading complaints...</p>
                    ) : complaints.length === 0 ? (
                        <GlassCard className="p-20 text-center">
                            <p className="text-6xl mb-4">📭</p>
                            <h3>No complaints yet</h3>
                        </GlassCard>
                    ) : (
                        <div className="space-y-6">
                            {complaints.map((item) => (
                                <GlassCard key={item._id} className="p-7">
                                    <div className="flex items-start gap-4">
                                        <User className="text-blue-400 mt-1" size={28} />

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold text-xl">{item.patientName}</h3>
                                                    <p className="text-sm text-gray-400">{formatDate(item.createdAt)}</p>
                                                </div>
                                                <span className={`px-4 py-1 rounded-full text-xs font-medium capitalize ${item.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                                                    {item.status}
                                                </span>
                                            </div>

                                            <p className="mt-4 text-gray-300 leading-relaxed">{item.complaint}</p>

                                            {item.doctorResponse && (
                                                <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-2xl p-5">
                                                    <p className="text-green-400 text-sm font-medium">Your Response:</p>
                                                    <p className="text-gray-300 mt-1">{item.doctorResponse}</p>
                                                </div>
                                            )}

                                            {/* Response Box - Only shows when clicked */}
                                            {item.status === 'pending' && (
                                                <div className="mt-6">
                                                    <button
                                                        onClick={() => setActiveId(activeId === item._id ? null : item._id)}
                                                        className="text-blue-400 hover:underline mb-3"
                                                    >
                                                        {activeId === item._id ? "Cancel" : "Reply to this complaint"}
                                                    </button>

                                                    {activeId === item._id && (
                                                        <>
                                                            <textarea
                                                                value={responseText}
                                                                onChange={(e) => setResponseText(e.target.value)}
                                                                placeholder="Write your medical advice or prescription here..."
                                                                rows={4}
                                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 focus:outline-none focus:border-blue-500"
                                                            />
                                                            <button
                                                                onClick={() => handleRespond(item._id)}
                                                                disabled={!responseText.trim()}
                                                                className="mt-3 px-8 py-3 bg-green-600 hover:bg-green-700 rounded-2xl font-medium transition disabled:opacity-50"
                                                            >
                                                                Send Response
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
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