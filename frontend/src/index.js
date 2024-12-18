import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/style.css';
import "./fetchWrapper"; // Override global fetch


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
