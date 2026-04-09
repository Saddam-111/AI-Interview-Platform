import { motion, AnimatePresence } from 'framer-motion';
import { forwardRef, useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const Select = forwardRef(({ 
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  className = '',
  disabled = false
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  
  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange({ target: { name: ref?.name, value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
          {label}
        </label>
      )}
      <div ref={containerRef} className="relative">
        <button
          type="button"
          ref={ref}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full px-4 py-3 pr-12 rounded-xl border-2 bg-white dark:bg-slate-800 text-left
            transition-all duration-200 flex items-center justify-between
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
              : isOpen 
                ? 'border-blue-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20' 
                : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <span className={selectedOption ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-slate-500'}>
            {selectedOption?.label || placeholder}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 w-full mt-2 py-2 bg-white dark:bg-slate-800 rounded-xl border-2 border-gray-200 dark:border-slate-600 shadow-lg max-h-60 overflow-auto"
            >
              {options.map((option, index) => (
                <motion.button
                  key={option.value}
                  type="button"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleSelect(option.value)}
                  className={`
                    w-full px-4 py-3 text-left flex items-center justify-between
                    transition-colors duration-150
                    ${value === option.value 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700/50'
                    }
                  `}
                >
                  <span>{option.label}</span>
                  {value === option.value && (
                    <Check className="w-4 h-4 text-blue-500" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
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

Select.displayName = 'Select';

export default Select;