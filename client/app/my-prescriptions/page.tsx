'use client';
import ProtectedRoute from '@/lib/protectedRoute';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import GlassCard from '@/components/GlassCard';
import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/services/api';

interface Interaction {
    pair: string[];
    severity: string;
    description: string;
}

interface Prescription {
    _id: string;
    doctorName: string;
    drugs: string[];
    interactionsFound: Interaction[];
    notes?: string;
    createdAt: string;
}

export default function MyPrescriptions() {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMyPrescriptions = async () => {
        try {
            const res = await api.get('/prescriptions/my');
            setPrescriptions(res.data.prescriptions || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load your prescriptions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchMyPrescriptions();
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
                    <h1 className="text-4xl font-bold mb-2">My Prescriptions</h1>
                    <p className="text-gray-400 mb-10">All medications prescribed by doctors</p>

                    {loading ? (
                        <p className="text-center py-20 text-gray-400">Loading prescriptions...</p>
                    ) : prescriptions.length === 0 ? (
                        <GlassCard className="p-20 text-center">
                            <p className="text-6xl mb-4">📭</p>
                            <h3 className="text-xl">No prescriptions yet</h3>
                            <p className="text-gray-400 mt-2">Prescriptions from your doctor will appear here</p>
                        </GlassCard>
                    ) : (
                        <div className="space-y-6">
                            {prescriptions.map((rx) => (
                                <GlassCard key={rx._id} className="p-7">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-4">
                                                <User className="text-blue-400" size={28} />
                                                <div>
                                                    <h3 className="font-semibold text-xl">Dr. {rx.doctorName}</h3>
                                                    <p className="text-sm text-gray-400">{formatDate(rx.createdAt)}</p>
                                                </div>
                                            </div>

                                            <div className="mb-5">
                                                <p className="text-gray-400 text-sm mb-2">PRESCRIBED MEDICATIONS</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {rx.drugs.map((drug, i) => (
                                                        <span key={i} className="bg-white/10 px-4 py-2 rounded-xl text-sm">
                                                            {drug}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {rx.notes && (
                                                <div>
                                                    <p className="text-gray-400 text-sm mb-1">DOCTOR&apos;S INSTRUCTIONS</p>
                                                    <p className="text-gray-300">{rx.notes}</p>
                                                </div>
                                            )}
                                        </div>

                                        {rx.interactionsFound.length > 0 && (
                                            <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-5 w-80">
                                                <p className="text-red-400 font-medium mb-3">Interactions Found</p>
                                                {rx.interactionsFound.map((inter, i) => (
                                                    <div key={i} className="text-sm text-red-300 mb-2">
                                                        • {inter.pair.join(" + ")} ({inter.severity})
                                                    </div>
                                                ))}
                                            </div>
                                        )}
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