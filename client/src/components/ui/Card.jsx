import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const Card = forwardRef(({ 
  children, 
  className = '', 
  hover = false,
  glow = false,
  padding = 'md',
  ...props 
}, ref) => {
  const paddingSizes = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <motion.div
      ref={ref}
      className={`
        relative rounded-2xl bg-white dark:bg-slate-800 
        border border-gray-100 dark:border-slate-700
        ${paddingSizes[padding]}
        ${hover ? 'hover:border-blue-200 dark:hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300' : 'shadow-card'}
        ${glow ? 'shadow-glow' : ''}
        ${className}
      `}
      whileHover={hover ? { y: -4 } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';

export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-semibold text-gray-900 dark:text-white ${className}`}>{children}</h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`mt-1 text-sm text-gray-500 dark:text-slate-400 ${className}`}>{children}</p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 ${className}`}>{children}</div>
);

export default Card;