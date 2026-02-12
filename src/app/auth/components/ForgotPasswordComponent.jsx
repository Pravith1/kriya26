'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { TiLocationArrow } from "react-icons/ti";
import Button from '@/components/Button';

export default function ForgotPasswordComponent() {
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
            localStorage.setItem('reset_password_email', email);
            await authService.forgotPassword({ email });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <form>
                <h1 className="font-zentry uppercase text-4xl mb-4">Check Email</h1>

                <div className="mb-4 flex justify-center">
                    <svg className="h-12 w-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <span className="font-general block mb-6 text-center">
                    We've sent a reset link to <strong className="text-white">{email}</strong>
                </span>

                <Button
                    title="Back to Login"
                    onClick={() => router.push('/auth?type=login')}
                    containerClass="bg-blue-400 flex-center gap-2 !px-6 !py-2 rounded-full font-zentry font-semibold transition-all duration-300 transform hover:scale-105 w-full mt-4"
                    titleClass="font-semibold !text-xs"
                    leftIcon={<TiLocationArrow className="w-4 h-4 group-hover:animate-bounce" />}
                />
            </form>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1 className="font-zentry uppercase text-4xl mb-4">Forgot Password</h1>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <span className="font-general block mb-6">Enter your email to receive a reset link</span>

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
                title={loading ? 'Sending...' : 'Send Reset Link'}
                type="submit"
                disabled={loading}
                containerClass="bg-blue-400 flex-center gap-2 !px-6 !py-2 rounded-full font-zentry font-semibold transition-all duration-300 transform hover:scale-105 w-full mt-4"
                titleClass="font-semibold !text-xs"
                leftIcon={<TiLocationArrow className="w-4 h-4 group-hover:animate-bounce" />}
            />

            <p className="mt-4 font-general text-sm">
                Remember your password?{' '}
                <span
                    className="text-[#512da8] font-bold cursor-pointer hover:underline"
                    onClick={() => router.push('/auth?type=login')}
                >
                    Back to Login
                </span>
            </p>
        </form>
    );
}
