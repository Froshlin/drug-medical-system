'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Home, 
  Search, 
  FileText, 
  History, 
  AlertCircle,
  X 
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ role: 'patient' | 'doctor' } | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isDoctor = user?.role === 'doctor';

  // Doctor Navigation
  const doctorNav = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    {name: 'Check Interaction', href: '/check-interaction', icon: Search},
    { name: 'Interaction Logs', href: '/interaction-logs', icon: Search },
    { name: 'New Prescription', href: '/prescription', icon: FileText },
    { name: 'Prescription History', href: '/history', icon: History },
    { name: 'Patient Complaints', href: '/doctor-complaints', icon: AlertCircle },
  ];

  // Patient Navigation
  const patientNav = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Drug Interaction', href: '/check-interaction', icon: Search },
    { name: 'Clinical Complaint', href: '/complaint', icon: AlertCircle },
    { name: 'My Complaints', href: '/complaint-history', icon: History },
    { name: 'My Prescriptions', href: '/my-prescriptions', icon: FileText },
  ];

  const navItems = isDoctor ? doctorNav : patientNav;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="w-72 glass h-screen fixed left-0 top-0 pt-20 border-r border-white/10 hidden lg:block">
        <div className="px-6 py-8">
          <div className="mb-8 px-4">
            <p className="text-xs uppercase tracking-widest text-gray-400">Logged in as</p>
            <p className="font-semibold capitalize text-white">{user?.role || 'User'}</p>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${
                    isActive 
                      ? 'bg-white/10 text-white font-medium' 
                      : 'hover:bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 glass rounded-2xl text-white"
      >
        {isMobileOpen ? <X size={24} /> : '☰'}
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/70 z-40"
          onClick={() => setIsMobileOpen(false)}
        >
          <div 
            className="glass w-72 h-full pt-20 p-6 overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-8 px-4">
              <p className="text-xs uppercase tracking-widest text-gray-400">Logged in as</p>
              <p className="font-semibold capitalize text-white">{user?.role || 'User'}</p>
            </div>

            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${
                      isActive 
                        ? 'bg-white/10 text-white font-medium' 
                        : 'hover:bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}