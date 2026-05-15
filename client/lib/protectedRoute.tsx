'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.replace('/login');
        }
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsChecking(false);
    }, [router]);

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
                <p className="text-gray-400">Checking authentication...</p>
            </div>
        );
    }

    return <>{children}</>;
}