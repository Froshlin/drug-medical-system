'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import toast from 'react-hot-toast';
import GlassCard from '@/components/GlassCard';
import { User, Lock, Loader2 } from 'lucide-react';
import Logo from '@/public/medical-logo.png'
import Image from 'next/image';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post('/auth/login', { email, password });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            toast.success('Login successful! Welcome back.');

            // Role-based redirection
            const userRole = res.data.user.role;

            if (userRole === 'doctor') {
                router.push('/dashboard');
            } else if (userRole === 'patient') {
                router.push('/dashboard');
            } else {
                router.push('/dashboard');
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } };
            toast.error(err.response?.data?.error || 'Invalid credentials');
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
                            <h1 className="text-4xl font-bold tracking-tight">
                                MediGuard
                            </h1>

                            <p className="text-gray-400">
                                Nigeria Healthcare System
                            </p>
                        </div>
                    </div>
                </div>

                {/* Login Card */}
                <GlassCard className="p-10">
                    <h2 className="text-2xl font-semibold text-center mb-8">
                        Login
                    </h2>

                    <form
                        onSubmit={handleLogin}
                        className="space-y-6"
                    >
                        {/* Email */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                Email Address
                            </label>

                            <div className="relative">
                                <User
                                    className="absolute left-4 top-3.5 text-gray-400"
                                    size={20}
                                />

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 py-3 focus:outline-none focus:border-blue-500 transition"
                                    placeholder="joshua@hospital.ng"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                Password
                            </label>

                            <div className="relative">
                                <Lock
                                    className="absolute left-4 top-3.5 text-gray-400"
                                    size={20}
                                />

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 py-3 focus:outline-none focus:border-blue-500 transition"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-4 rounded-2xl font-semibold text-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2
                                        className="animate-spin"
                                        size={22}
                                    />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center text-sm text-gray-400">
                        Don&apos;t have an account?{' '}
                        <Link
                            href="/register"
                            className="text-blue-400 hover:text-blue-300 hover:underline font-medium transition"
                        >
                            Register here
                        </Link>
                    </div>
                </GlassCard>
                {/* Footer */}
                <p className="text-center text-xs text-gray-500 mt-8">
                    For educational purposes only • Not for clinical use
                </p>
            </div>
        </div>
    );
}