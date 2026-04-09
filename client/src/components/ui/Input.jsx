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
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <motion.input
          ref={ref}
          type={inputType}
          className={`
            w-full px-4 py-3 ${Icon ? 'pl-12' : ''} ${isPassword || type === 'email' ? 'pr-12' : ''}
            bg-white dark:bg-slate-800
            border-2 rounded-xl
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-slate-500
            transition-all duration-200
            focus:outline-none
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
              : isFocused 
                ? 'border-blue-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20' 
                : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
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
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;