import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  BookOpen, 
  MessageSquare, 
  User, 
  Menu, 
  X,
  Bot,
  GraduationCap,
  LogOut,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/home', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/learning', label: 'Learning', icon: BookOpen },
    { path: '/ai-chat', label: 'AI Chat', icon: MessageSquare },
    { path: '/mock-test', label: 'Mock Test', icon: GraduationCap },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#030303] relative">
      {/* Background ambient effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          className="orb w-[400px] h-[400px] bg-violet-500/10 blur-[80px] absolute top-0 right-1/4"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          className="orb w-[300px] h-[300px] bg-cyan-500/10 blur-[60px] absolute bottom-1/4 left-1/4"
        />
      </div>

      {/* Fixed Navigation Pill */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[672px] px-2 sm:px-4"
      >
        <div className="glass rounded-full px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2 sm:gap-3">
            <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500" />
            <span className="font-serif text-base sm:text-lg text-white">Synapse</span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-1">
            {navItems.slice(0, 4).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  px-4 py-2 rounded-full text-sm transition-all duration-300
                  ${isActive(item.path) 
                    ? 'bg-white/10 text-white' 
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden lg:flex items-center gap-2">
              <Link 
                to="/profile"
                className="p-2 rounded-full text-white/50 hover:text-white hover:bg-white/5 transition-all"
              >
                <Settings className="w-5 h-5" />
              </Link>
              <button
                onClick={logout}
                className="p-2 rounded-full text-white/50 hover:text-white hover:bg-white/5 transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-full text-white/50 hover:text-white hover:bg-white/5 transition-all"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-20 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-[400px] glass rounded-3xl p-4"
          >
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                    ${isActive(item.path) 
                      ? 'bg-white/10 text-white' 
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-28 pb-8 px-4 md:px-8">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;