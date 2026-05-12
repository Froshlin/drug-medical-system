'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import GlassCard from '@/components/GlassCard';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { User, Clock, AlertTriangle } from 'lucide-react';
import ProtectedRoute from '@/lib/protectedRoute';

interface Interaction {
    pair?: string[];
    severity?: string;
}

interface Prescription {
    _id: string;
    patientName: string;
    drugs: string[];
    interactionsFound: Interaction[];
    notes?: string;
    createdAt: string;
}

export default function History() {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/prescriptions');
                setPrescriptions(res.data.prescriptions || []);
            } catch (error) {
                toast.error('Failed to load prescription history');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const handleRefresh = async () => {
        setLoading(true);

        try {
            const res = await api.get('/prescriptions');
            setPrescriptions(res.data.prescriptions || []);
            toast.success('History refreshed');
        } catch (error) {
            toast.error('Failed to refresh history');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('en-NG', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(new Date(dateString));
    };

    return (
        <ProtectedRoute>
            <Navbar />
            <Sidebar />

            <main className="lg:ml-72 mt-20 pt-20 min-h-screen p-6 lg:p-10">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-4xl font-bold">
                                Prescription History
                            </h1>
                            <p className="text-gray-400">
                                All previous prescriptions
                            </p>
                        </div>

                        <button
                            onClick={handleRefresh}
                            className="px-5 py-3 glass rounded-2xl hover:bg-white/10 transition flex items-center gap-2"
                        >
                            <Clock size={18} />
                            Refresh
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <p className="text-gray-400">
                                Loading history...
                            </p>
                        </div>
                    ) : prescriptions.length === 0 ? (
                        <GlassCard className="p-20 text-center">
                            <p className="text-6xl mb-4">📭</p>

                            <h3 className="text-2xl font-semibold">
                                No prescriptions yet
                            </h3>

                            <p className="text-gray-400 mt-3">
                                Your saved prescriptions will appear here
                            </p>
                        </GlassCard>
                    ) : (
                        <div className="space-y-6">
                            {prescriptions.map((rx) => (
                                <GlassCard
                                    key={rx._id}
                                    className="p-7"
                                >
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-4">
                                                <User className="text-blue-400" />

                                                <div>
                                                    <h3 className="font-semibold text-xl">
                                                        {rx.patientName}
                                                    </h3>

                                                    <p className="text-sm text-gray-400">
                                                        {formatDate(
                                                            rx.createdAt
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <p className="text-gray-400 text-sm mb-2">
                                                    MEDICATIONS
                                                </p>

                                                <div className="flex flex-wrap gap-2">
                                                    {rx.drugs.map(
                                                        (drug, i) => (
                                                            <span
                                                                key={i}
                                                                className="bg-white/10 px-4 py-2 rounded-xl text-sm"
                                                            >
                                                                {drug}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            {rx.notes && (
                                                <div>
                                                    <p className="text-gray-400 text-sm mb-1">
                                                        NOTES
                                                    </p>

                                                    <p className="text-gray-300">
                                                        {rx.notes}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Interaction Summary */}
                                        <div className="md:w-80">
                                            {rx.interactionsFound &&
                                            rx.interactionsFound.length > 0 ? (
                                                <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-5">
                                                    <div className="flex items-center gap-2 text-red-400 mb-3">
                                                        <AlertTriangle
                                                            size={20}
                                                        />

                                                        <span className="font-semibold">
                                                            Interactions
                                                            Detected
                                                        </span>
                                                    </div>

                                                    <div className="space-y-2 text-sm">
                                                        {rx.interactionsFound.map(
                                                            (
                                                                inter: Interaction,
                                                                i: number
                                                            ) => (
                                                                <div
                                                                    key={i}
                                                                    className="text-red-300"
                                                                >
                                                                    •{' '}
                                                                    {inter.pair?.join(
                                                                        ' + '
                                                                    )}{' '}
                                                                    (
                                                                    {
                                                                        inter.severity
                                                                    }
                                                                    )
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="glass rounded-3xl p-5 text-center">
                                                    <p className="text-green-400 font-medium">
                                                        ✅ No interactions found
                                                    </p>
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