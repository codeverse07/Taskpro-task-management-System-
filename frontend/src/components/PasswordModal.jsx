import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { X, Lock, Save, ShieldCheck } from 'lucide-react';

const PasswordModal = ({ isOpen, onClose }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setPassword('');
            setConfirmPassword('');
            setMessage('');
            setError('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setMessage('');
        setError('');

        try {
            await api.put('/users/password', { password });
            setMessage('Security credentials updated successfully.');
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-500 ease-in-out"
                    aria-hidden="true"
                    onClick={onClose}
                ></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom glass-panel border border-white/10 rounded-3xl text-left overflow-hidden shadow-2xl shadow-fuchsia-500/10 transform transition-all duration-300 sm:my-8 sm:align-middle sm:max-w-md w-[95%] sm:w-full animate-in fade-in zoom-in-95">
                    <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
                        <button
                            type="button"
                            className="bg-slate-900/10 rounded-lg text-slate-500 hover:text-fuchsia-400 hover:bg-slate-800/10 transition-all"
                            onClick={onClose}
                        >
                            <span className="sr-only">Close</span>
                            <X className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>

                    <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 relative">
                        <div className="absolute top-0 left-0 -ml-16 -mt-16 w-32 h-32 rounded-full bg-fuchsia-500/10 blur-3xl pointer-events-none"></div>

                        <div className="sm:flex sm:items-start relative z-10">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/50 sm:mx-0 sm:h-10 sm:w-10">
                                <ShieldCheck className="h-6 w-6 text-fuchsia-400" aria-hidden="true" />
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-xl sm:text-2xl font-black text-slate-300 tracking-tight text-glow" id="modal-title">
                                    Security Override
                                </h3>
                                <p className="text-xs text-fuchsia-400 mt-1 uppercase tracking-wider font-semibold">
                                    Update Authentication Key
                                </p>

                                {message && (
                                    <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500 text-emerald-400 rounded-lg text-sm text-center font-medium">
                                        {message}
                                    </div>
                                )}
                                {error && (
                                    <div className="mt-4 p-3 bg-red-500/20 border border-red-500 text-red-400 rounded-lg text-sm text-center font-medium">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-fuchsia-500 uppercase tracking-widest mb-2">New Password</label>
                                        <div className="relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-4 w-4 text-slate-500" />
                                            </div>
                                            <input
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="input-field pl-10 h-11"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-fuchsia-500 uppercase tracking-widest mb-2">Confirm Password</label>
                                        <div className="relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-4 w-4 text-slate-500" />
                                            </div>
                                            <input
                                                type="password"
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="input-field pl-10 h-11"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-8 border-t border-slate-700/30 pt-4 flex flex-col sm:flex-row justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="btn-secondary w-full sm:w-auto py-3 sm:py-2 px-6 active:scale-95 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn-primary w-full sm:w-auto shadow-lg shadow-fuchsia-500/20 py-3 sm:py-2 px-6 active:scale-95 transition-all bg-gradient-to-r from-fuchsia-600 to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? 'Updating...' : (
                                                <>
                                                    <Save className="h-4 w-4 mr-2" />
                                                    Secure Account
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordModal;
