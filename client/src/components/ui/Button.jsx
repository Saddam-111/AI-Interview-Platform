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
  const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-300 rounded-xl focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-white text-black hover:bg-white/90 focus:ring-2 focus:ring-white/20",
    secondary: "bg-violet-500/20 text-white hover:bg-violet-500/30 border border-violet-500/30 focus:ring-2 focus:ring-violet-500/20",
    accent: "bg-cyan-500/20 text-white hover:bg-cyan-500/30 border border-cyan-500/30 focus:ring-2 focus:ring-cyan-500/20",
    outline: "border border-white/10 text-white hover:bg-white/5 focus:ring-2 focus:ring-white/10",
    ghost: "text-white/60 hover:text-white hover:bg-white/5",
    danger: "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
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
          className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
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