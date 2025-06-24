import { forwardRef } from 'react';

const Input = forwardRef(({ 
  type = 'text', 
  className = '', 
  error = false,
  ...props 
}, ref) => {
  const baseClasses = 'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm transition-colors duration-200';
  const normalClasses = 'border-gray-300 focus:ring-accent focus:border-accent';
  const errorClasses = 'border-error focus:ring-error focus:border-error';

  return (
    <input
      ref={ref}
      type={type}
      className={`${baseClasses} ${error ? errorClasses : normalClasses} ${className}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;