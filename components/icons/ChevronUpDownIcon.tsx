
import React from 'react';

const ChevronUpDownIcon: React.FC = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="48" 
    height="48" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5"
    strokeLinecap="round" 
    strokeLinejoin="round"
    aria-hidden="true"
    className="w-8 h-8"
  >
    <polyline points="17 11 12 6 7 11" className="animate-pulse-up"></polyline>
    <polyline points="7 13 12 18 17 13" className="animate-pulse-down"></polyline>
  </svg>
);

export default ChevronUpDownIcon;