const Text = ({ 
  as: Component = 'p', 
  variant = 'body', 
  size = 'base', 
  weight = 'normal',
  color = 'default',
  className = '', 
  children, 
  ...props 
}) => {
  const variants = {
    display: 'font-display',
    heading: 'font-heading',
    body: 'font-body'
  };

  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl'
  };

  const weights = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const colors = {
    default: 'text-secondary',
    primary: 'text-primary',
    accent: 'text-accent',
    muted: 'text-gray-500',
    white: 'text-white'
  };

  return (
    <Component 
      className={`${variants[variant]} ${sizes[size]} ${weights[weight]} ${colors[color]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Text;