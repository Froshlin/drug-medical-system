'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import GlassCard from '@/components/GlassCard';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { Search, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import ProtectedRoute from '@/lib/protectedRoute';

interface Interaction {
    pair: string[];
    severity: string;
    description: string;
}

export default function CheckInteraction() {
    const [drugs, setDrugs] = useState<string[]>(['', '']);
    const [interactions, setInteractions] = useState<Interaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);

    const addDrugField = () => {
        if (drugs.length < 8) {
            setDrugs([...drugs, '']);
        } else {
            toast.error("Maximum 8 drugs allowed");
        }
    };

    const removeDrug = (index: number) => {
        if (drugs.length > 2) {
            setDrugs(drugs.filter((_, i) => i !== index));
        }
    };

    const updateDrug = (index: number, value: string) => {
        const updated = [...drugs];
        updated[index] = value;
        setDrugs(updated);
    };

    const handleCheck = async () => {
        const filledDrugs = drugs.filter(d => d.trim() !== '');

        if (filledDrugs.length < 2) {
            toast.error("Please enter at least 2 drugs");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/interactions/check', { drugs: filledDrugs });

            setInteractions(res.data.interactions || []);
            setChecked(true);

            if (res.data.interactions.length === 0) {
                toast.success("No interactions found! ✓ Safe combination");
            } else {
                toast.error(`${res.data.interactions.length} interaction(s) found`, { duration: 5000 });
            }
        } catch (error) {
            toast.error("Failed to check interactions");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <Navbar />
            <Sidebar />

            <main className="lg:ml-72 mt-20 pt-20 min-h-screen p-6 lg:p-10">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-4xl font-bold mb-2">Drug Interaction Checker</h1>
                    <p className="text-gray-400 mb-10">Check for dangerous combinations before prescribing</p>

                    <GlassCard className="p-8">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Search size={24} /> Selected Drugs
                            </h2>

                            <div className="space-y-4">
                                {drugs.map((drug, index) => (
                                    <div key={index} className="flex gap-3">
                                        <input
                                            type="text"
                                            value={drug}
                                            onChange={(e) => updateDrug(index, e.target.value)}
                                            placeholder={`Drug ${index + 1} (e.g. Panadol, Flagyl)`}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500 transition"
                                        />
                                        {drugs.length > 2 && (
                                            <button
                                                onClick={() => removeDrug(index)}
                                                className="p-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={addDrugField}
                                className="mt-4 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
                            >
                                <Plus size={20} /> Add another drug
                            </button>
                        </div>

                        <button
                            onClick={handleCheck}
                            disabled={loading}
                            className="w-full bg-linear-to-r from-blue-600 to-purple-600 py-5 rounded-3xl font-semibold text-lg hover:brightness-110 transition disabled:opacity-70"
                        >
                            {loading ? "Checking Interactions..." : "🔍 Check for Interactions"}
                        </button>
                    </GlassCard>

                    {/* Results */}
                    {checked && (
                        <div className="mt-8">
                            <h2 className="text-2xl font-semibold mb-6">Interaction Results</h2>

                            {interactions.length === 0 ? (
                                <GlassCard className="p-12 text-center">
                                    <div className="text-6xl mb-4">
                                        <CheckCircle2 color='text-green-500'/>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-green-400">No Interactions Found</h3>
                                    <p className="text-gray-400 mt-3">This combination appears safe</p>
                                </GlassCard>
                            ) : (
                                <div className="space-y-6">
                                    {interactions.map((interaction, index) => (
                                        <GlassCard key={index} className={`p-6 ${interaction.severity}`}>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="font-semibold text-lg">
                                                        {interaction.pair[0]} × {interaction.pair[1]}
                                                    </div>
                                                    <p className="mt-3 leading-relaxed">{interaction.description}</p>
                                                </div>
                                                <span className="uppercase text-sm font-bold px-4 py-1 rounded-full border">
                                                    {interaction.severity}
                                                </span>
                                            </div>
                                        </GlassCard>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </ProtectedRoute>
    );
}