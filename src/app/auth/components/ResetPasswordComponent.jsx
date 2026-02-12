'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService';
import { TiLocationArrow } from "react-icons/ti";
import Button from '@/components/Button';

export default function ResetPasswordComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const storedEmail = localStorage.getItem('reset_password_email');
        if (storedEmail) {
            setEmail(storedEmail);
        }

        if (!token) {
            setError('Invalid or missing reset token');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await authService.resetPassword({ token, newPassword: password });
            localStorage.removeItem('reset_password_email');
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="w-full max-w-3xl relative z-10 bg-black/85 border border-white/10 shadow-2xl rounded-none p-8 my-8">
                <div className="text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="w-20 h-20 border-2 border-green-500 flex items-center justify-center">
                            <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-xl font-zentry font-thin text-white mb-4 uppercase tracking-wider">
                        Password R<b>e</b>s<b>e</b>t
                    </h1>
                    <p className="text-gray-400 text-sm font-general mb-8">Your password has been successfully reset.</p>
                    <Button
                        title="Go to Login"
                        onClick={() => router.push('/auth?type=login')}
                        containerClass="bg-blue-400 flex-center gap-2 !px-6 !py-2 rounded-full font-zentry font-semibold transition-all duration-300 transform hover:scale-105 w-full"
                        titleClass="font-semibold !text-xs"
                        leftIcon={<TiLocationArrow className="w-4 h-4 group-hover:animate-bounce" />}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl relative z-10 bg-black/85 border border-white/10 shadow-2xl rounded-none p-8 my-8">
            <div className="mb-4 text-center">
                <h1 className="text-xl font-zentry font-thin text-white mb-1 uppercase tracking-wider">
                    Reset P<b>a</b>ssw<b>o</b>rd
                </h1>
                <p className="text-gray-400 text-[10px] font-general tracking-[0.2em] uppercase">
                    CREATE_NEW_PASSWORD
                </p>
            </div>

            {error && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-300 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Email Display */}
                <div className="mb-8">
                    <h2 className="text-sm font-zentry font-thin text-white/60 mb-6 uppercase tracking-widest border-b border-white/10 pb-4">
                        Account Email
                    </h2>
                    <div>
                        <label htmlFor="email" className="block text-[10px] font-bold text-white/40 mb-2 uppercase tracking-[0.2em] font-general">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            readOnly
                            className="w-full h-12 px-4 py-3 bg-white/5 border border-white/10 text-white/30 cursor-not-allowed rounded-none outline-none font-general"
                        />
                    </div>
                </div>

                {/* Password Fields */}
                <div className="mb-8">
                    <h2 className="text-sm font-zentry font-thin text-white/60 mb-6 uppercase tracking-widest border-b border-white/10 pb-4">
                        New Password
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="password" className="block text-[10px] font-bold text-white/40 mb-2 uppercase tracking-[0.2em] font-general">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min. 6 characters"
                                    required
                                    minLength={6}
                                    className="w-full h-12 px-4 py-3 bg-white/5 border border-white/20 text-white rounded-none outline-none focus:border-blue-400 transition-colors font-general placeholder:text-[10px]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs uppercase font-general"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-[10px] font-bold text-white/40 mb-2 uppercase tracking-[0.2em] font-general">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter password"
                                    required
                                    minLength={6}
                                    className="w-full h-12 px-4 py-3 bg-white/5 border border-white/20 text-white rounded-none outline-none focus:border-blue-400 transition-colors font-general placeholder:text-[10px]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs uppercase font-general"
                                >
                                    {showConfirmPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                    <button
                        type="button"
                        onClick={() => router.push('/auth?type=login')}
                        className="w-full sm:w-auto px-10 py-3 border border-white/20 text-white uppercase tracking-widest hover:bg-white/10 transition-colors rounded-full font-zentry text-xs"
                    >
                        Cancel
                    </button>
                    <Button
                        title={loading ? 'Resetting...' : 'Reset Password'}
                        type="submit"
                        disabled={loading || !token}
                        containerClass="bg-blue-400 flex-center gap-2 !px-6 !py-2 rounded-full font-zentry font-semibold transition-all duration-300 transform hover:scale-105 w-full sm:flex-1"
                        titleClass="font-semibold !text-xs"
                        leftIcon={<TiLocationArrow className="w-4 h-4 group-hover:animate-bounce" />}
                    />
                </div>
            </form>
        </div>
    );
}
