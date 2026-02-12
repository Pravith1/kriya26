'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService';

export default function VerifyEmailComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get('token');

            if (!token) {
                setError('Invalid verification link');
                setLoading(false);
                return;
            }

            try {
                const response = await authService.verifyEmail(token);

                if (response.email) {
                    localStorage.setItem('registration_email', response.email);
                }

                setSuccess(true);
                setLoading(false);

                setTimeout(() => {
                    router.push('/auth?type=complete-registration&source=email');
                }, 2000);
            } catch (err) {
                console.error('Verification error:', err);
                setError(err.response?.data?.message || 'Email verification failed');
                setLoading(false);
            }
        };

        verifyEmail();
    }, [searchParams, router]);

    if (loading) {
        return (
            <div className="w-full max-w-md">
                <div className="bg-black/80 backdrop-blur-md border border-white/10 shadow-xl rounded-lg p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#edff66] mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold font-general text-[#dfdff2] mb-2">Verifying</h2>
                    <p className="text-gray-400">Please wait...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-md">
                <div className="bg-black/80 backdrop-blur-md border border-white/10 shadow-xl rounded-lg p-8 text-center">
                    <div className="mb-4">
                        <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold font-general text-[#dfdff2] mb-2">Verification Failed</h2>
                    <p className="text-red-300 mb-4">{error}</p>
                    <button
                        onClick={() => router.push('/auth?type=send-email')}
                        className="bg-[#dfdff2] text-black rounded-full hover:bg-white font-general text-xs uppercase py-2 px-4"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="w-full max-w-md">
                <div className="bg-black/80 backdrop-blur-md border border-white/10 shadow-xl rounded-lg p-8 text-center">
                    <div className="mb-4">
                        <svg className="mx-auto h-12 w-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold font-general text-[#dfdff2] mb-2">Verified!</h2>
                    <p className="text-gray-400">Redirecting...</p>
                </div>
            </div>
        );
    }

    return null;
}
