'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import GlassCard from '@/components/GlassCard';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { Save, Plus, Trash2 } from 'lucide-react';

interface Interaction {
  pair: string[];
  severity: string;
  description: string;
}

export default function NewPrescription() {
  const [patientName, setPatientName] = useState('');
  const [drugs, setDrugs] = useState<string[]>(['', '']);
  const [notes, setNotes] = useState('');
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [saving, setSaving] = useState(false);

  const addDrug = () => {
    if (drugs.length < 8) {
      setDrugs([...drugs, '']);
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkInteractions = async () => {
    const filledDrugs = drugs.filter(d => d.trim() !== '');
    if (filledDrugs.length < 2) {
      setInteractions([]);
      return;
    }

    try {
      const res = await api.post('/interactions/check', { drugs: filledDrugs });
      setInteractions(res.data.interactions || []);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      console.error('Failed to check interactions');
      setInteractions([]);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(checkInteractions, 700);
    return () => clearTimeout(timeout);
  }, [checkInteractions, drugs]);

  const handleSavePrescription = async () => {
    const filledDrugs = drugs.filter(d => d.trim() !== '');

    if (!patientName || filledDrugs.length < 1) {
      toast.error("Patient name and at least one drug are required");
      return;
    }

    setSaving(true);

    try {
      await api.post('/prescriptions', {
        patientName: patientName.trim(),
        drugs: filledDrugs,
        notes
      });

      toast.success("Prescription saved successfully!");

      // Reset form
      setPatientName('');
      setDrugs(['', '']);
      setNotes('');
      setInteractions([]);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || "Failed to save prescription");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar />

      <main className="lg:ml-72 mt-20 pt-20 min-h-screen p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">New Prescription</h1>
          <p className="text-gray-400 mb-10">Prescribe medication for a patient</p>

          <GlassCard className="p-8">
            <div className="space-y-8">
              {/* Patient Info */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Patient Full Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Mrs. Aisha Okoro"
                />
              </div>

              {/* Drugs */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Medications</h3>
                  <button
                    onClick={addDrug}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm"
                  >
                    <Plus size={18} /> Add Drug
                  </button>
                </div>

                <div className="space-y-4">
                  {drugs.map((drug, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="text"
                        value={drug}
                        onChange={(e) => updateDrug(index, e.target.value)}
                        placeholder={`Drug ${index + 1} (e.g. Panadol, Flagyl)`}
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500"
                      />
                      {drugs.length > 2 && (
                        <button
                          onClick={() => removeDrug(index)}
                          className="px-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Interaction Warnings */}
              {interactions.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-6">
                  <h4 className="text-red-400 font-semibold mb-3">Interaction Warnings</h4>
                  {interactions.map((int, i) => (
                    <div key={i} className="text-sm text-red-300 mb-2">
                      • {int.pair[0]} + {int.pair[1]} → {int.severity.toUpperCase()}
                    </div>
                  ))}
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Additional Notes / Instructions</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-3xl px-5 py-4 focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Take after meals, 1 tablet 3x daily..."
                />
              </div>

              <button
                onClick={handleSavePrescription}
                disabled={saving}
                className="w-full bg-linear-to-r from-emerald-600 to-teal-600 py-5 rounded-3xl font-semibold text-lg hover:brightness-110 transition flex items-center justify-center gap-3 disabled:opacity-70"
              >
                <Save size={24} />
                {saving ? "Saving Prescription..." : "Save Prescription"}
              </button>
            </div>
          </GlassCard>
        </div>
      </main>
    </>
  );
}