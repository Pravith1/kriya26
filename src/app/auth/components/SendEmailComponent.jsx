'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { TiLocationArrow } from "react-icons/ti";
import Button from '@/components/Button';

export default function SendEmailComponent() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.sendVerificationEmail({ email });
            localStorage.setItem('registration_email', email);
            setSuccess(true);
            setTimeout(() => {
                router.push('/auth?type=login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send verification email');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <form>
                <div className="mb-4 text-center">
                    <svg className="mx-auto h-12 w-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1 className="font-zentry uppercase text-4xl mb-4">Check Your Email</h1>
                <span className="font-general">
                    We've sent a verification link to <strong>{email}</strong>
                </span>
                <p className="text-sm text-gray-400 mt-4 font-general">Redirecting to login...</p>
            </form>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1 className="font-zentry uppercase text-4xl mb-4">Verify Email</h1>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <span className="font-general block mb-6">Enter your email to receive a verification link</span>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="font-general"
            />

            <Button
                title={loading ? 'Sending...' : 'Send Verification Email'}
                onClick={handleSubmit}
                type="submit"
                disabled={loading}
                containerClass="bg-blue-400 flex-center gap-2 !px-6 !py-2 rounded-full font-zentry font-semibold transition-all duration-300 transform hover:scale-105 w-full mt-4"
                titleClass="font-semibold !text-xs"
                leftIcon={<TiLocationArrow className="w-4 h-4 group-hover:animate-bounce" />}
            />

            <p className="mt-4 font-general text-sm">
                <span
                    className="text-[#512da8] font-bold cursor-pointer hover:underline"
                    onClick={() => router.push('/auth?type=register')}
                >
                    ← Back to registration
                </span>
            </p>
        </form>
    );
}
