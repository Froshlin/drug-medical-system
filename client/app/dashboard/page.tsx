'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import GlassCard from '@/components/GlassCard';
import ProtectedRoute from '@/lib/protectedRoute';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { FileText, AlertCircle, Users, Clock } from 'lucide-react';

interface UserData {
    name: string;
    role: 'patient' | 'doctor';
}

interface Stats {
    totalPrescriptions: number;
    patientsToday: number;
    pendingComplaints: number;
    thisMonth: number;
}

export default function Dashboard() {
    const [user] = useState<UserData | null>(() => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        }
        return null;
    });

    const [stats, setStats] = useState<Stats>({
        totalPrescriptions: 0,
        patientsToday: 0,
        pendingComplaints: 0,
        thisMonth: 0,
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadStats = async () => {
            if (!user || user.role !== 'doctor') return;

            try {
                setLoading(true);
                const res = await api.get('/prescriptions/stats');
                setStats(res.data.stats);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load stats');
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, [user]);

    const isDoctor = user?.role === 'doctor';

    return (
        <ProtectedRoute>
            <Navbar />
            <Sidebar />

            <main className="lg:ml-72 mt-20 pt-20 min-h-screen p-6 lg:p-10">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-2">
                        Welcome back, {isDoctor ? 'Dr.' : ''}{' '}
                        {user?.name?.split(' ')[0] || 'User'}
                    </h1>

                    <p className="text-gray-400 mb-10">
                        {isDoctor
                            ? "Here's what's happening in your practice"
                            : 'Health Overview'}
                    </p>

                    {loading ? (
                        <p className="text-gray-400">Loading stats...</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            {isDoctor ? (
                                <>
                                    {/* Total Prescriptions */}
                                    <GlassCard className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-400 text-sm">Total Prescriptions</p>
                                                <p className="text-4xl font-bold mt-2">{stats.totalPrescriptions}</p>
                                            </div>
                                            <FileText className="text-blue-400" size={32} />
                                        </div>
                                    </GlassCard>

                                    {/* Patients Today */}
                                    <GlassCard className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-400 text-sm">Patients Today</p>
                                                <p className="text-4xl font-bold mt-2">{stats.patientsToday}</p>
                                            </div>
                                            <Users className="text-emerald-400" size={32} />
                                        </div>
                                    </GlassCard>

                                    {/* Pending Complaints */}
                                    <GlassCard className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-400 text-sm">Pending Complaints</p>
                                                <p className="text-4xl font-bold mt-2 text-yellow-400">
                                                    {stats.pendingComplaints}
                                                </p>
                                            </div>
                                            <AlertCircle className="text-yellow-400" size={32} />
                                        </div>
                                    </GlassCard>

                                    {/* This Month */}
                                    <GlassCard className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-400 text-sm">This Month</p>
                                                <p className="text-4xl font-bold mt-2">{stats.thisMonth}</p>
                                            </div>
                                            <Clock className="text-purple-400" size={32} />
                                        </div>
                                    </GlassCard>
                                </>
                            ) : (
                                <GlassCard className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-400 text-sm">My Complaints</p>
                                            <p className="text-4xl font-bold mt-2">3</p>
                                        </div>
                                        <AlertCircle className="text-purple-400" size={32} />
                                    </div>
                                </GlassCard>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </ProtectedRoute>
    );
}