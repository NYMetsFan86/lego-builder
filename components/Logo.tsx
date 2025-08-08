export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Base brick shape */}
      <rect
        x="10"
        y="40"
        width="80"
        height="40"
        rx="2"
        fill="#e74c3c"
        stroke="#c0392b"
        strokeWidth="2"
      />
      
      {/* Studs on top */}
      <circle cx="25" cy="40" r="8" fill="#c0392b" />
      <circle cx="50" cy="40" r="8" fill="#c0392b" />
      <circle cx="75" cy="40" r="8" fill="#c0392b" />
      
      {/* Highlight on studs */}
      <circle cx="25" cy="40" r="6" fill="#e74c3c" />
      <circle cx="50" cy="40" r="6" fill="#e74c3c" />
      <circle cx="75" cy="40" r="6" fill="#e74c3c" />
      
      {/* Side brick (blue) */}
      <rect
        x="30"
        y="20"
        width="40"
        height="25"
        rx="2"
        fill="#3498db"
        stroke="#2980b9"
        strokeWidth="2"
      />
      
      {/* Studs on blue brick */}
      <circle cx="40" cy="20" r="5" fill="#2980b9" />
      <circle cx="60" cy="20" r="5" fill="#2980b9" />
      <circle cx="40" cy="20" r="3.5" fill="#3498db" />
      <circle cx="60" cy="20" r="3.5" fill="#3498db" />
      
      {/* 3D effect shadows */}
      <path
        d="M10 78 L10 80 L90 80 L90 78"
        fill="#00000020"
      />
      <path
        d="M88 40 L90 40 L90 80 L88 80"
        fill="#00000020"
      />
    </svg>
  );
}