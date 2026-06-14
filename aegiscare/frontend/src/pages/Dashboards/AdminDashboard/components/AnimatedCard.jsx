import React from 'react';

const AnimatedCard = ({ children, delay = 0, className = '', style = {} }) => {
  return (
    <div
      className={`animate-slide-up ${className}`}
      style={{ animationDelay: `${delay * 100}ms`, ...style }}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;
