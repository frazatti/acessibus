import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

export const AcessiBusLogo: React.FC<IconProps> = ({ size = 24, color = '#2563eb', ...props }) => (
  <svg
    width={size * 2.5}
    height={size}
    viewBox="0 0 100 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x="0" y="0" width="100" height="40" fill="white" />
    <g>
      {/* Bus Icon */}
      <path
        d="M3 15H9C10.1046 15 11 15.8954 11 17V26C11 27.1046 10.1046 28 9 28H3C1.89543 28 1 27.1046 1 26V17C1 15.8954 1.89543 15 3 15Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 20H15L17 22H21V20H23V25C23 26.1046 22.1046 27 21 27H17L15 25H11"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="5" cy="27" r="2" fill={color} />
      <circle cx="19" cy="27" r="2" fill={color} />
      <path
        d="M17 19H23"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Wi-Fi/Signal Icon */}
      <path
        d="M14 9C17.866 9 21 12.134 21 16"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 1C22.2843 1 29 7.71573 29 16"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="14" cy="16" r="1" fill={color} />
      {/* Text "AcessiBus" */}
      <text x="35" y="28" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="bold" fill={color}>
        AcessiBus
      </text>
    </g>
  </svg>
);


export const MicIcon: React.FC<IconProps> = ({ size = 24, color = 'white', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 1A3 3 0 0 0 9 4v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>
);

export const HeartIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color === 'currentColor' ? 'none' : color}
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

export const FilledHeartIcon: React.FC<IconProps> = ({ size = 24, color = '#ef4444', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5.52 19c.64-2.2 1.84-3.57 3.32-4.31 1.24-.62 2.68-.93 4.16-.93s2.92.31 4.16.93c1.48.73 2.68 2.11 3.32 4.31"></path>
    <circle cx="12" cy="8" r="4"></circle>
  </svg>
);

export const HomeIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

export const HistoryIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

export const BusIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="1" y="5" width="22" height="14" rx="2"></rect>
    <path d="M7 19v-6"></path>
    <path d="M17 19v-6"></path>
    <line x1="1" y1="10" x2="23" y2="10"></line>
    <line x1="17" y1="5" x2="17" y2="19"></line>
    <line x1="7" y1="5" x2="7" y2="19"></line>
    <line x1="12" y1="5" x2="12" y2="10"></line>
  </svg>
);

export const FacebookIcon: React.FC<IconProps> = ({ size = 24, color = '#1877F2', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

export const GoogleIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M22.44 12.292C22.44 11.464 22.378 10.643 22.251 9.838H12V14.168H18.665C18.397 15.655 17.51 16.945 16.14 17.798V20.627H19.957C22.109 18.647 23.333 15.632 23.333 12.292C23.333 11.536 23.23 10.793 23.033 10.081L22.44 12.292Z"
      fill="#4285F4"
    />
    <path
      d="M12 23.001C14.996 23.001 17.585 22.031 19.537 20.404L16.14 17.798C15.228 18.411 14.155 18.795 12.999 18.795C10.155 18.795 7.73 16.892 6.891 14.37H2.92V17.29C4.846 20.938 8.784 23.001 12 23.001Z"
      fill="#34A853"
    />
    <path
      d="M2.92 14.37V11.459H6.891C6.678 10.793 6.564 10.081 6.564 9.293C6.564 8.505 6.678 7.793 6.891 7.127H2.92V4.298H6.772C4.757 7.076 3.666 10.536 3.666 14.293C3.666 14.319 3.666 14.346 3.666 14.37H2.92Z"
      fill="#FBBC04"
    />
    <path
      d="M12 5.207C13.687 5.207 15.228 5.86 16.425 7.05L19.537 4.298C17.585 2.569 14.996 1.667 12 1.667C8.784 1.667 4.846 3.73 2.92 7.378L6.772 10.207C7.73 7.696 10.155 5.793 12.999 5.793C13.626 5.793 14.225 5.895 14.777 6.082L15.908 4.958L17.291 3.575L12 5.207Z"
      fill="#EA4335"
    />
  </svg>
);
