'use client';
import ProtectedRoute from '@/lib/protectedRoute';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import GlassCard from '@/components/GlassCard';
import { useState, useEffect } from 'react';
import { User, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface Interaction {
    pair: string[];
    severity: string;
    description: string;
}

interface PatientInteraction {
    _id: string;
    patientName: string;
    drugs: string[];
    interactionsFound: Interaction[];
    createdAt: string;
}

export default function InteractionLogs() {
    const [logs, setLogs] = useState<PatientInteraction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchInteractionLogs = async () => {
        try {
            // Mock data for now (replace with real API later)
            setLogs([
                {
                    _id: "log1",
                    patientName: "Aisha Mohammed",
                    drugs: ["Panadol", "Flagyl", "Augmentin"],
                    interactionsFound: [
                        {
                            pair: ["Panadol", "Flagyl"],
                            severity: "moderate",
                            description: "May cause stomach irritation"
                        }
                    ],
                    createdAt: "2026-05-08T10:45:00Z"
                },
                {
                    _id: "log2",
                    patientName: "Emeka Okafor",
                    drugs: ["Paracetamol", "Ibuprofen"],
                    interactionsFound: [],
                    createdAt: "2026-05-08T09:20:00Z"
                }
            ]);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Failed to load interaction logs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchInteractionLogs();
    }, []);

    const filteredLogs = logs.filter(log =>
        log.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

            <main className="lg:ml-72 mt-20 pt-20 min-h-screen p-6 lg:p-10">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-4xl font-bold">Patient Interaction Logs</h1>
                            <p className="text-gray-400">All drug checks performed by patients</p>
                        </div>

                        <div className="relative w-80">
                            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search patient..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 py-3 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <p className="text-center py-20 text-gray-400">Loading logs...</p>
                    ) : filteredLogs.length === 0 ? (
                        <GlassCard className="p-20 text-center">
                            <p className="text-6xl mb-4">📭</p>
                            <h3>No interaction logs yet</h3>
                        </GlassCard>
                    ) : (
                        <div className="space-y-6">
                            {filteredLogs.map((log) => (
                                <GlassCard key={log._id} className="p-7">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <User className="text-blue-400" />
                                                <div>
                                                    <h3 className="font-semibold text-xl">{log.patientName}</h3>
                                                    <p className="text-sm text-gray-400">{formatDate(log.createdAt)}</p>
                                                </div>
                                            </div>

                                            <div className="mt-5">
                                                <p className="text-gray-400 text-sm mb-2">DRUGS CHECKED</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {log.drugs.map((drug, i) => (
                                                        <span key={i} className="bg-white/10 px-4 py-2 rounded-xl text-sm">
                                                            {drug}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {log.interactionsFound.length > 0 ? (
                                            <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-5 w-96">
                                                <p className="text-red-400 font-medium mb-3">
                                                    Interactions Found ({log.interactionsFound.length})
                                                </p>
                                                {log.interactionsFound.map((inter, i) => (
                                                    <div key={i} className="text-sm text-red-300 mb-2">
                                                        • {inter.pair.join(" + ")} — {inter.severity}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="bg-green-500/10 border border-green-500/30 rounded-3xl p-5 text-center w-96">
                                                <p className="text-green-400 font-medium">No interactions found</p>
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