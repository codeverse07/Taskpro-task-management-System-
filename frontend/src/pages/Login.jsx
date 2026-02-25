import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const result = await login(email, password);

        if (result.success) {
            if (result.role === 'Admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/employee/dashboard');
            }
        } else {
            setError(result.message);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative z-10">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-cyan-500/30 transform hover:rotate-12 transition-transform duration-300">
                        <LogIn className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-4xl font-extrabold text-slate-300 tracking-tight text-glow">
                    Welcome Back
                </h2>
                <p className="mt-2 text-center text-sm text-slate-400">
                    Sign in to your centralized workspace
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="glass-panel py-8 px-4 sm:rounded-2xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-900/50 border-l-4 border-red-500 p-4 mb-4 rounded-md shadow-lg">
                                <p className="text-sm text-red-200">{error}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Authenticating...' : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-700/20" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className={`px-3 rounded-full text-slate-500 border border-slate-700/20 ${localStorage.getItem('theme') === 'light' ? 'bg-white' : 'bg-slate-950'}`}>
                                    New to the network?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <Link to="/register" className="font-semibold text-primary hover:text-cyan-300 transition-colors drop-shadow-lg shadow-cyan-500/30">
                                Initialize an account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
