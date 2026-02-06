'use client';

import { AuthProvider } from '@/context/AuthContext';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}
