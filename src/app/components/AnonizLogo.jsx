const AnonizLogo = ({ className }) => (
  <svg
    viewBox="40 0 170 200"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Front Camera/Bubble (Stroked, with Background Fill to "Cut" Back Bubble) */}
    <g transform="translate(60, 60)">
      {/* Main Body Masking Background */}
      <rect x="0" y="0" width="100" height="80" rx="25" fill="#0f172a" stroke="#0f172a" strokeWidth="12" />
      {/* Lens Masking Background */}
      <path
        d="M110 20 L135 10 V70 L110 60 V20 Z"
        fill="#0f172a"
        stroke="#0f172a"
        strokeWidth="12"
        strokeLinejoin="round"
      />

      {/* Main Body Stroke */}
      <rect x="0" y="0" width="100" height="80" rx="25" fill="#0f172a" stroke="#A78BFA" strokeWidth="8" />

      {/* Camera Lens Stroke */}
      <path
        d="M110 20 L135 10 V70 L110 60 V20 Z"
        fill="none"
        stroke="#A78BFA"
        strokeWidth="8"
        strokeLinejoin="round"
      />

      {/* Face */}
      <circle cx="30" cy="39" r="8" fill="#A78BFA" />
      <circle cx="70" cy="39" r="8" fill="#A78BFA" />
    </g>
  </svg>
);

export default AnonizLogo;

