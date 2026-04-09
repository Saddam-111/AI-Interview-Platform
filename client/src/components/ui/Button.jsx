import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  loading = false,
  icon: Icon,
  ...props 
}, ref) => {
  const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40",
    secondary: "bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700 focus:ring-purple-500 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40",
    accent: "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-600 hover:to-cyan-700 focus:ring-cyan-500 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40",
    outline: "border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 bg-transparent",
    ghost: "text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500 shadow-lg shadow-red-500/25"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
    icon: "p-2.5"
  };

  return (
    <motion.button
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {loading ? (
        <motion.div
          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5 mr-2" />}
          {children}
        </>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;