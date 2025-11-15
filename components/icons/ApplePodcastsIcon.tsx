import React from 'react';

const ApplePodcastsIcon: React.FC<{className?: string}> = ({ className = "h-6 w-6" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 100 100"
        className={className}
        aria-hidden="true"
    >
        <defs>
            <linearGradient id="apple-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#c165dd'}} />
                <stop offset="100%" style={{stopColor: '#5c2c90'}} />
            </linearGradient>
        </defs>
        <rect width="100" height="100" rx="22" fill="url(#apple-gradient)" />
        <g fill="#FFFFFF">
            <path d="M50 58.3c-4.6 0-8.3 3.7-8.3 8.3s3.7 8.3 8.3 8.3 8.3-3.7 8.3-8.3-3.7-8.3-8.3-8.3zm0 12.5c-2.3 0-4.2-1.9-4.2-4.2s1.9-4.2 4.2-4.2 4.2 1.9 4.2 4.2-1.9 4.2-4.2 4.2z" />
            <path d="M50 41.7c-10.4 0-18.8 8.4-18.8 18.8s8.4 18.8 18.8 18.8 18.8-8.4 18.8-18.8-8.4-18.8-18.8-18.8zm0 33.3c-8 0-14.6-6.5-14.6-14.6s6.5-14.6 14.6-14.6 14.6 6.5 14.6 14.6-6.5 14.6-14.6 14.6z" />
            <path d="M50 25c-19.8 0-35.8 16-35.8 35.8s16 35.8 35.8 35.8 35.8-16 35.8-35.8-16-35.8-35.8-35.8zm0 67.5c-17.5 0-31.7-14.2-31.7-31.7s14.2-31.7 31.7-31.7 31.7 14.2 31.7 31.7-14.2 31.7-31.7 31.7z" />
        </g>
    </svg>
);

export default ApplePodcastsIcon;