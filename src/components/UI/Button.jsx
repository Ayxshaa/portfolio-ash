// src/components/ui/Button.jsx
import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  className = '', 
  onClick,
  ...props 
}) => {
  const baseStyles = "rounded-full font-medium transition-all duration-300 tracking-wide";
  
  const variants = {
    primary: "bg-gradient-to-r from-gray-400 to-gray-300 hover:from-purple-500 hover:to-indigo-500 text-black hover:text-white hover:shadow-glow",
    secondary: "bg-transparent border border-gray-400 text-white hover:border-purple-500 hover:text-purple-200",
    ghost: "bg-transparent text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10"
  };
  
  const sizes = {
    small: "px-3 py-1 text-sm",
    medium: "px-5 py-2",
    large: "px-7 py-3 text-lg"
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;