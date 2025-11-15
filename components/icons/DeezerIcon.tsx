
import React from 'react';

const DeezerIcon: React.FC<{className?: string}> = ({ className = "h-6 w-6" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
    fill="#9933CC"
  >
    <path d="M2.393 12.508H5.97v3.522h3.577v-3.522h3.576v-3.52H9.547V5.466H5.97v3.522H2.393v3.522zm15.607.001v3.521h-3.576v-3.521h3.576zm0-7.042v3.521h-3.576V5.467h3.576zM9.547 16.03v3.522H5.97v-3.522h3.577z"/>
  </svg>
);

export default DeezerIcon;
