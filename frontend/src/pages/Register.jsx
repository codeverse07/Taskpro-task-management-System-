import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Employee'
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const result = await register(formData.name, formData.email, formData.password, formData.role);

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
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-lg shadow-cyan-500/30 transform hover:-rotate-12 transition-transform duration-300">
                        <UserPlus className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-4xl font-extrabold text-slate-300 tracking-tight text-glow">
                    Join the Network
                </h2>
                <p className="mt-2 text-center text-sm text-slate-400">
                    Initialize your presence in the system
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="glass-panel py-8 px-4 sm:rounded-2xl sm:px-10">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-900/50 border-l-4 border-red-500 p-4 mb-4 rounded-md shadow-lg">
                                <p className="text-sm text-red-200">{error}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Enter your name"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Email address</label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="yourid@network.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Role Configuration</label>
                            <div className="mt-1">
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="input-field"
                                >
                                    <option value="Employee" className="bg-slate-900/50">Standard User (Employee)</option>
                                    <option value="Admin" className="bg-slate-900/50">System Administrator</option>
                                </select>
                            </div>
                            <p className="mt-2 text-xs text-slate-500">Note: Demo environment allows admin registration.</p>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-lg shadow-cyan-500/30 text-sm font-semibold text-white bg-gradient-to-r from-secondary to-fuchsia-500 hover:from-fuchsia-500 hover:to-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary focus:ring-offset-slate-900 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isSubmitting ? 'Initializing...' : 'Establish Connection'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-700/20" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className={`px-3 rounded-full text-slate-500 border border-slate-700/20 ${localStorage.getItem('theme') === 'light' ? 'bg-white' : 'bg-slate-950'}`}>Already registered?</span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <Link to="/login" className="font-semibold text-secondary hover:text-fuchsia-400 transition-colors drop-shadow-lg shadow-cyan-500/30">
                                Return to Access Portal
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
