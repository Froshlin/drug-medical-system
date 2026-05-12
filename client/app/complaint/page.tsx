'use client';
import ProtectedRoute from '@/lib/protectedRoute';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import GlassCard from '@/components/GlassCard';
import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/services/api';
import { Send } from 'lucide-react';

export default function SubmitComplaint() {
    const [complaint, setComplaint] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!complaint.trim()) {
            toast.error("Please describe your symptoms or complaint");
            return;
        }

        setLoading(true);

        try {
            await api.post('/complaints', {
                complaint: complaint.trim()
            });

            toast.success("Complaint submitted successfully! A doctor will review it soon.");
            setComplaint(''); // Clear the form
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            toast.error(
                err.response?.data?.error || 
                "Failed to submit complaint. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <Navbar />
            <Sidebar />

            <main className="lg:ml-72 mt-20 pt-20 min-h-screen p-6 lg:p-10">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold mb-2">Clinical Complaint</h1>
                    <p className="text-gray-400 mb-10">Tell your doctor how you&apos;re feeling</p>

                    <GlassCard className="p-8">
                        <form onSubmit={handleSubmit}>
                            <textarea
                                value={complaint}
                                onChange={(e) => setComplaint(e.target.value)}
                                placeholder="Describe your symptoms, how long you've had them, any medications you're taking, pain level, etc..."
                                rows={12}
                                className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 focus:outline-none focus:border-blue-500 resize-none text-gray-200"
                            />

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading || !complaint.trim()}
                                    className="flex items-center gap-3 bg-linear-to-r from-blue-600 to-purple-600 px-10 py-4 rounded-2xl font-semibold text-lg disabled:opacity-50 hover:scale-105 transition"
                                >
                                    <Send size={22} />
                                    {loading ? "Submitting..." : "Submit Complaint"}
                                </button>
                            </div>
                        </form>
                    </GlassCard>

                    <p className="text-center text-sm text-gray-500 mt-8">
                        Your complaint will be reviewed by a doctor shortly.
                    </p>
                </div>
            </main>
        </ProtectedRoute>
    );
}