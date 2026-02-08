fav icon with circle svg code:

<svg 
    viewBox="0 0 200 200" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Background Circle */}
    <circle cx="100" cy="100" r="100" fill="#A78BFA" />

    {/* Camera Group centered visually */}
    <g transform="translate(-10, 5)"> 
      {/* Camera Body (Dark Box) */}
      <rect x="35" y="50" width="110" height="90" rx="25" fill="#0f172a" />
      
      {/* Camera Lens (Trapezoid on the right) */}
      <path d="M155 70 L185 55 V135 L155 120 Z" fill="#0f172a" />

      {/* Face Features (Light Purple to match bg) */}
      {/* Left Eye */}
      <circle cx="70" cy="95" r="10" fill="#A78BFA" />
      {/* Right Eye */}
      <circle cx="110" cy="95" r="10" fill="#A78BFA" />
      {/* Smile */}
    </g>
  </svg>