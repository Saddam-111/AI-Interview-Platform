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
        relative rounded-2xl 
        bg-white/[0.02] border border-white/[0.05]
        ${paddingSizes[padding]}
        ${hover ? 'hover:border-violet-500/30 hover:bg-white/[0.04] transition-all duration-300' : ''}
        ${glow ? 'shadow-lg shadow-violet-500/20' : ''}
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
  <h3 className={`text-xl font-serif text-white ${className}`}>{children}</h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`mt-1 text-sm text-white/50 ${className}`}>{children}</p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-white/5 ${className}`}>{children}</div>
);

export default Card;