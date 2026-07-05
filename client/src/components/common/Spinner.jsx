import React from 'react';

export default function Spinner({ size = 16, color = 'currentColor', style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        animation: 'spin 1s linear infinite',
        display: 'inline-block',
        verticalAlign: 'middle',
        ...style,
      }}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" opacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" />
    </svg>
  );
}
