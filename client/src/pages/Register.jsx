import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'cse',
    stream: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        stream: formData.role === 'non-cse' ? formData.stream : null
      });

      if (result.success) {
        navigate('/home', { replace: true });
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Register error:', err);
    }

    setLoading(false);
  };

  const streams = [
    { value: 'mechanical', label: 'Mechanical' },
    { value: 'civil', label: 'Civil' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#030303] py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="orb w-[500px] h-[500px] bg-violet-500/20 blur-[100px] absolute top-1/4 -left-1/4"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="orb w-[400px] h-[400px] bg-cyan-500/15 blur-[80px] absolute bottom-1/4 right-1/4"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="orb w-[350px] h-[350px] bg-violet-500/10 blur-[60px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md px-6"
      >
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500" />
            <span className="font-serif text-2xl text-white">Synapse</span>
          </Link>
          <h1 className="font-serif text-4xl text-white mb-2">Create Account</h1>
          <p className="text-white/40 text-sm">Start your interview preparation journey</p>
        </motion.div>

        {/* Register Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="glass rounded-3xl p-8"
        >
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/40 mb-3">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-violet-500/50 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-white/40 mb-3">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-violet-500/50 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-white/40 mb-3">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-violet-500/50 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-white/40 mb-3">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-violet-500/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/40 mb-3">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'cse' })}
                  className={`py-4 rounded-xl border-2 transition-all duration-300 ${
                    formData.role === 'cse'
                      ? 'border-violet-500 bg-violet-500/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <span className="text-white font-medium">CSE/IT</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'non-cse' })}
                  className={`py-4 rounded-xl border-2 transition-all duration-300 ${
                    formData.role === 'non-cse'
                      ? 'border-violet-500 bg-violet-500/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <span className="text-white font-medium">Non-CSE</span>
                </button>
              </div>
            </div>

            {/* Stream Selection */}
            {formData.role === 'non-cse' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <label className="block text-xs uppercase tracking-widest text-white/40 mb-3">
                  Stream
                </label>
                <select
                  name="stream"
                  value={formData.stream}
                  onChange={handleChange}
                  className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500/50 focus:outline-none transition-colors"
                >
                  <option value="" className="bg-[#030303]">Select your stream</option>
                  {streams.map((stream) => (
                    <option key={stream.value} value={stream.value} className="bg-[#030303]">
                      {stream.label}
                    </option>
                  ))}
                </select>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-4 rounded-xl bg-white text-black font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/40">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-white/60 hover:text-white transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-sm text-white/20 mt-8">
          © 2024 Synapse. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default Register;