
import React from 'react';

const YouTubeIcon: React.FC<{className?: string}> = ({ className = "h-6 w-6" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        className={className}
        aria-hidden="true"
    >
        <circle cx="12" cy="12" r="12" fill="#FF0000"/>
        <path fill="#FFF" d="M16.2,11.2l-6-3.3c-0.6-0.3-1.2,0-1.2,0.7v6.6c0,0.7,0.6,1,1.2,0.7l6-3.3C16.8,12.2,16.8,11.5,16.2,11.2z"/>
    </svg>
);

export default YouTubeIcon;
