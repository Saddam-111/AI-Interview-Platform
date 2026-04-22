import { motion } from 'framer-motion';
import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({ 
  label, 
  error, 
  icon: Icon,
  type = 'text',
  className = '',
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <motion.input
          ref={ref}
          type={inputType}
          className={`
            w-full px-4 py-3 ${Icon ? 'pl-12' : ''} ${isPassword ? 'pr-12' : ''}
            bg-white/5 rounded-xl
            border border-white/10
            text-white placeholder-white/30
            transition-all duration-300
            focus:outline-none
            ${error 
              ? 'border-red-500/50 focus:border-red-500/50' 
              : isFocused 
                ? 'border-violet-500/50 bg-white/[0.08]' 
                : 'hover:border-white/20'
            }
            ${className}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/50 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;