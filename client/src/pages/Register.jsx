import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Bot, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';

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
  const { theme } = useTheme();
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

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-slate-900 py-8">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl" />
        <div className={`absolute inset-0 bg-grid-pattern opacity-50 ${theme === 'dark' ? 'opacity-30' : ''}`} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md px-4"
      >
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 mb-4 shadow-lg shadow-purple-500/30">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold gradient-text">AI Interview</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Platform</p>
        </motion.div>

        {/* Register Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-100 dark:border-slate-700 shadow-xl"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h2>
            <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">Start your interview preparation journey</p>
          </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              icon={User}
              placeholder="John Doe"
              required
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              placeholder="you@example.com"
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              icon={Lock}
              placeholder="••••••••"
              required
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={Lock}
              placeholder="••••••••"
              required
            />

            {/* Role Selection */}
            <Select
              label="I am a"
              name="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              options={[
                { value: 'cse', label: 'CSE/IT Student' },
                { value: 'non-cse', label: 'Non-CSE (Engineering)' }
              ]}
            />

            {/* Stream Selection (only for non-cse) */}
            {formData.role === 'non-cse' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <Select
                  label="Stream"
                  name="stream"
                  value={formData.stream}
                  onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                  placeholder="Select your stream"
                  options={[
                    { value: 'mechanical', label: 'Mechanical Engineering' },
                    { value: 'civil', label: 'Civil Engineering' },
                    { value: 'electrical', label: 'Electrical Engineering' },
                    { value: 'electronics', label: 'Electronics Engineering' },
                    { value: 'other', label: 'Other' }
                  ]}
                />
              </motion.div>
            )}

            <Button
              type="submit"
              loading={loading}
              className="w-full mt-2"
              icon={ArrowRight}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 dark:text-slate-500 mt-6">
          © 2024 AI Interview Platform. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default Register;