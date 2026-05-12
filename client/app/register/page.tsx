'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import toast from 'react-hot-toast';
import GlassCard from '@/components/GlassCard';
import { User, Lock, Mail, Loader2 } from 'lucide-react';
import Logo from '@/public/medical-logo.png'
import Image from 'next/image';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'patient' | 'doctor'>('patient');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        if (!name.trim() || !email.trim() || !password.trim()) {
            toast.error('All fields are required');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await api.post('/auth/register', {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password,
                role
            });

            toast.success('Account created successfully! Please login.');
            router.push('/login');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string; message?: string } } };

            toast.error(
                err.response?.data?.error || 
                err.response?.data?.message || 
                'Registration failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0a0a0a] to-[#1a1a2e] p-6">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-3">
                        <Image
                        src={Logo}
                        alt='medical logo'
                        width={60}
                        height={60}
                        className='object-contain'
                        />
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight text-white">
                                MediGuard
                            </h1>
                            <p className="text-gray-400">Nigeria Healthcare System</p>
                        </div>
                    </div>
                </div>

                <GlassCard className="p-10">
                    <h2 className="text-2xl font-semibold text-center mb-8">Create Account</h2>

                    <form onSubmit={handleRegister} className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 py-3 focus:outline-none focus:border-blue-500"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 py-3 focus:outline-none focus:border-blue-500"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 py-3 focus:outline-none focus:border-blue-500"
                                    placeholder="Create strong password"
                                />
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-3">Register As</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setRole('patient')}
                                    className={`py-4 rounded-2xl font-medium transition-all ${
                                        role === 'patient' 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-white/5 hover:bg-white/10'
                                    }`}
                                >
                                    Patient
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('doctor')}
                                    className={`py-4 rounded-2xl font-medium transition-all ${
                                        role === 'doctor' 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-white/5 hover:bg-white/10'
                                    }`}
                                >
                                    Doctor
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-blue-600 to-purple-600 py-4 rounded-2xl font-semibold text-lg transition disabled:opacity-70 flex items-center justify-center gap-2 hover:scale-[1.02]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={22} />
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-blue-400 hover:underline">
                            Login here
                        </Link>
                    </p>
                </GlassCard>
            </div>
        </div>
    );
}