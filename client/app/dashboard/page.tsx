'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import GlassCard from '@/components/GlassCard';
import ProtectedRoute from '@/lib/protectedRoute';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { FileText, AlertCircle, Users, Clock, CheckCircle } from 'lucide-react';

interface UserData {
    name: string;
    role: 'patient' | 'doctor';
}

interface Stats {
    totalPrescriptions: number;
    patientsToday: number;
    pendingComplaints: number;
    totalComplaints: number;
    thisMonth: number;
}

interface Complaint {
    _id: string;
    status: 'pending' | 'reviewed' | 'resolved';
}

interface PatientStats {
    totalComplaints: number;
    pendingComplaints: number;
    reviewedComplaints: number;
    resolvedComplaints: number;
}

export default function Dashboard() {
    const [user, setUser] = useState<UserData | null>(null);
    const [stats, setStats] = useState<Stats>({
        totalPrescriptions: 0,
        patientsToday: 0,
        pendingComplaints: 0,
        totalComplaints: 0,
        thisMonth: 0,
    });

    const [patientStats, setPatientStats] = useState<PatientStats>({
        totalComplaints: 0,
        pendingComplaints: 0,
        reviewedComplaints: 0,
        resolvedComplaints: 0,
    });

    const [loading, setLoading] = useState(true);

    // Load User
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Load Stats based on Role
    useEffect(() => {
        const loadStats = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                if (user.role === 'doctor') {
                    const res = await api.get('/prescriptions/stats');
                    setStats(res.data.stats || stats);
                } else {
                    // Patient Stats
                    const res = await api.get('/complaints/my');
                    const complaints: Complaint[] = res.data.complaints || [];

                    setPatientStats({
                        totalComplaints: complaints.length,
                        pendingComplaints: complaints.filter(c => c.status === 'pending').length,
                        reviewedComplaints: complaints.filter(c => c.status === 'reviewed').length,
                        resolvedComplaints: complaints.filter(c => c.status === 'resolved').length,
                    });
                }
            } catch (error) {
                console.error(error);
                toast.error('Failed to load dashboard stats');
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, [stats, user]);

    const isDoctor = user?.role === 'doctor';

    return (
        <ProtectedRoute>
            <Navbar />
            <Sidebar />

            <main className="lg:ml-72 mt-20 pt-20 min-h-screen p-6 lg:p-10">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-2">
                        Welcome back, {isDoctor ? 'Dr.' : ''} {user?.name?.split(' ')[0] || 'User'}
                    </h1>
                    <p className="text-gray-400 mb-10">
                        {isDoctor 
                            ? "Here's what's happening in your practice today" 
                            : "Here's your health activity summary"}
                    </p>

                    {loading ? (
                        <p className="text-gray-400">Loading stats...</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            {isDoctor ? (
                                // Doctor Stats
                                <>
                                    <GlassCard className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-400 text-sm">Total Prescriptions</p>
                                                <p className="text-4xl font-bold mt-2">{stats.totalPrescriptions}</p>
                                            </div>
                                            <FileText className="text-blue-400" size={32} />
                                        </div>
                                    </GlassCard>

                                    <GlassCard className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-400 text-sm">Patients Today</p>
                                                <p className="text-4xl font-bold mt-2">{stats.patientsToday}</p>
                                            </div>
                                            <Users className="text-emerald-400" size={32} />
                                        </div>
                                    </GlassCard>

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
                                // Patient Stats
                                <>
                                    <GlassCard className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-400 text-sm">Total Complaints</p>
                                                <p className="text-4xl font-bold mt-2">{patientStats.totalComplaints}</p>
                                            </div>
                                            <FileText className="text-blue-400" size={32} />
                                        </div>
                                    </GlassCard>

                                    <GlassCard className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-400 text-sm">Pending</p>
                                                <p className="text-4xl font-bold mt-2 text-yellow-400">
                                                    {patientStats.pendingComplaints}
                                                </p>
                                            </div>
                                            <AlertCircle className="text-yellow-400" size={32} />
                                        </div>
                                    </GlassCard>

                                    <GlassCard className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-400 text-sm">Reviewed</p>
                                                <p className="text-4xl font-bold mt-2 text-blue-400">
                                                    {patientStats.reviewedComplaints}
                                                </p>
                                            </div>
                                            <Clock className="text-blue-400" size={32} />
                                        </div>
                                    </GlassCard>

                                    <GlassCard className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-400 text-sm">Resolved</p>
                                                <p className="text-4xl font-bold mt-2 text-green-400">
                                                    {patientStats.resolvedComplaints}
                                                </p>
                                            </div>
                                            <CheckCircle className="text-green-400" size={32} />
                                        </div>
                                    </GlassCard>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </ProtectedRoute>
    );
}