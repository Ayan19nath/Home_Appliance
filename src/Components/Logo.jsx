import { Link } from "react-router-dom";

// HomeHub logo. color = house and text color, linkClass / svgClass = the page's own style classes
export default function Logo({ color = "black", linkClass = "logo", svgClass = "homehub-logo" }) {
  return (
    <Link to="/" className={linkClass}>
      <svg className={svgClass} viewBox="0 0 260 70" xmlns="http://www.w3.org/2000/svg">
        {/* house outline */}
        <g fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 30 L38 7 L68 30" />
          <path d="M16 25 V57 H60 V25" />
          <path d="M51 18 V7 H60 V25" />
        </g>
        {/* windows */}
        <g fill={color}>
          <rect x="29" y="31" width="9" height="9" rx="2" />
          <rect x="41" y="31" width="9" height="9" rx="2" />
          <rect x="29" y="43" width="9" height="9" rx="2" />
          <rect x="41" y="43" width="9" height="9" rx="2" />
        </g>
        {/* orange curve and text */}
        <path d="M5 49 C25 68, 65 69, 78 45" fill="none" stroke="#ff9d00" strokeWidth="7" strokeLinecap="round" />
        <text x="82" y="43" fill={color} fontSize="35" fontWeight="700" fontFamily="Arial, Helvetica, sans-serif">Home</text>
        <text x="178" y="43" fill="#ff9d00" fontSize="35" fontWeight="700" fontFamily="Arial, Helvetica, sans-serif">Hub</text>
        <text x="115" y="59" fill={color} fontSize="7" fontWeight="500" fontFamily="Arial, Helvetica, sans-serif" letterSpacing="1">YOUR HOME, OUR APPLIANCES</text>
      </svg>
    </Link>
  );
}