import React from 'react';

const AnimatedCard = ({ children, delay = 0, className = '' }) => {
  return (
    <div 
      className={`animate-slide-up ${className}`}
      style={{ animationDelay: `${delay * 100}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;
