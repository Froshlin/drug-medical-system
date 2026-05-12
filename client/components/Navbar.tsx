'use client';
import { LogOut, User } from 'lucide-react';
import Image from 'next/image';
import Logo from '@/public/medical-logo.png'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; role: 'patient' | 'doctor' } | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    const isDoctor = user?.role === 'doctor';

    return (
        <nav className="glass fixed top-0 left-0 right-0 z-50 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Image
                            src={Logo}
                            alt='medical logo'
                            width={60}
                            height={60}
                            className='object-contain'
                        />
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">MediGuard</h1>
                        <p className="text-xs text-gray-400 -mt-1">Nigeria Healthcare System</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {user && (
                        <div className="flex items-center gap-3 bg-white/5 px-5 py-2.5 rounded-2xl">
                            <User size={18} />
                            <div>
                                <p className="text-sm font-medium">
                                    {isDoctor ? 'Dr. ' : ''}{user.name.split(' ')[0]}
                                </p>
                                <p className="text-xs text-gray-500 -mt-1 capitalize">{user.role}</p>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-5 py-2.5 text-red-400 hover:bg-red-500/10 rounded-2xl transition"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}