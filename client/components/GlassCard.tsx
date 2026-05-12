import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
}

export default function GlassCard({ children, className = "" }: GlassCardProps) {
    return (
        <div className={`glass rounded-3xl p-6 ${className}`}>
            {children}
        </div>
    );
}