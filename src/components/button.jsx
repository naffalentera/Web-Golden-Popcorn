import React from 'react';
import '../styles/detail.css';

const Button = ({ className, onClick, text, children }) => {
  return (
    <button className={`btn ${className}`} onClick={onClick}>
      {children || text}
    </button>
  );
};

export default Button;