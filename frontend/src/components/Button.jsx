import React from 'react';

function Button({ text, className, onClick, children }) {
  return (
    <button className={`btn ${className}`} onClick={onClick}>
      {children ? children : text}
    </button>
  );
}

export default Button;
