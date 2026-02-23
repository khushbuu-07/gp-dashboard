import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, User, Loader2, ArrowRight } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useLoginMutation } from '../../redux/api/authApiSlice';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/authSlice';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loginMutation] = useLoginMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await loginMutation({ username, password }).unwrap();

            console.log('Login response:', response);
        
            // Assuming the API returns the user data and token in the response
            // The structure might depend on the backend implementation
            if (response.success || response.token) {
                const userData = response.data || response.user || { username };
                const token = response.token;

                const finalUserData = { ...userData, token };
                

                dispatch(loginSuccess(finalUserData));
                navigate('/');
            } else {
                setError(response.message || 'Invalid credentials');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.data?.message || 'Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-dark-900 overflow-hidden">
            {/* Left Side: Brand & Visuals */}
            <div className="relative bg-gradient-to-br from-dark-800 to-dark-900 hidden lg:flex flex-col items-center justify-center p-12 text-text-primary overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-dark-800/80 mix-blend-overlay" />
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/10 rounded-full blur-3xl animate-pulse" />

                <div className="relative z-10 text-center space-y-6 max-w-lg">
                    <div className="w-20 h-20 bg-primary/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-primary/30 rotate-12 hover:rotate-0 transition-transform duration-500">
                        <span className="text-4xl font-bold bg-gradient-to-br from-yellow to-white bg-clip-text text-transparent">GP</span>
                    </div>

                    <h1 className="text-5xl font-extrabold tracking-tight">
                        Global<span className="text-yellow">Projects</span>
                    </h1>
                    <p className="text-xl text-text-primary/80 font-light leading-relaxed">
                        India's Trusted Platform for New Business Opportunities. Manage outsourcing projects efficiently.
                    </p>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex items-center justify-center p-8 lg:p-12 relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-soft-light"></div>
                <div className="w-full max-w-md bg-dark-800 rounded-3xl shadow-2xl p-8 lg:p-10 border border-dark-600 backdrop-blur-xl animate-slide-in relative z-10">
                    <div className="flex flex-col items-center mb-10">
                        <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded-full mb-4 border border-primary/30">
                            <Lock className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold text-text-primary">Welcome Back</h2>
                        <p className="text-text-muted mt-2 text-sm">Sign in to access your dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary ml-1">Username</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-3.5 h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    className="w-full pl-11 pr-4 py-3 bg-dark-900 border border-dark-600 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none placeholder:text-text-muted font-medium text-text-primary"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full pl-11 pr-4 py-3 bg-dark-900 border border-dark-600 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all outline-none placeholder:text-text-muted font-medium text-text-primary"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-dark-600 bg-dark-900 text-primary focus:ring-primary/30" />
                                <span className="text-text-secondary">Remember me</span>
                            </label>
                            <a href="#" className="text-primary hover:text-yellow font-medium hover:underline transition-all">Forgot password?</a>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 text-red-400 text-sm rounded-lg border border-red-500/30 flex items-center gap-2 animate-pulse">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={twMerge(
                                "w-full py-3.5 px-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-primary/40 flex items-center justify-center gap-2 transform active:scale-95",
                                loading && "opacity-80 cursor-not-allowed"
                            )}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Sign In <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-text-muted">
                        Don't have an account? <a href="#" className="text-primary font-bold hover:text-yellow hover:underline transition-colors">Create Account</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

