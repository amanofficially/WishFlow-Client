// Central place for the WishFlow logo so every page renders the exact
// same asset at the exact same crop. We ship three pre-cropped variants
// (see src/assets) instead of squeezing one big image into small spots:
//   - "icon"  → just the star/ribbon mark, for tight spaces (navbar, favicon-ish use)
//   - "mark"  → icon + "WishFlow" wordmark, no tagline (auth pages, dashboard header)
//   - "full"  → icon + wordmark + tagline (hero sections, splash/illustration panels)
import logoIcon from "../assets/logo-icon.png";
import logoMark from "../assets/logo-mark.png";
import logoFull from "../assets/logo-full.png";

const SOURCES = {
  icon: logoIcon,
  mark: logoMark,
  full: logoFull,
};

// className controls sizing from the outside (e.g. "h-8 w-auto").
const Logo = ({ variant = "mark", className = "h-8 w-auto", alt = "WishFlow" }) => (
  <img
    src={SOURCES[variant]}
    alt={alt}
    className={className}
    draggable={false}
  />
);

export default Logo;
