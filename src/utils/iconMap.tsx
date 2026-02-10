import { IconType } from 'react-icons';
import {
  BsWind,
  BsHandIndex,
  BsBandaid,
  BsThermometerHalf,
  BsChatDotsFill,
  BsThreeDots,
  BsFillHeartPulseFill,
  BsActivity,
  BsDropletFill,
  BsDroplet,
  BsExclamationTriangle,
  BsEarFill,
  BsEyeFill,
  BsBellFill,
  BsCapsulePill,
  BsExclamationOctagon,
  BsFire,
  BsShieldExclamation,
  BsSpeedometer2,
  BsLightningFill,
  BsQuestionCircle,
  BsLifePreserver,
} from 'react-icons/bs';
import { FaBrain } from 'react-icons/fa';

/**
 * Whitelist mapping of icon names to React components.
 * This is secure because:
 * 1. Only pre-approved icons can be rendered
 * 2. Unknown icon names fall back to a default
 * 3. No dynamic imports or eval() - just a static lookup
 */
const iconMap: Record<string, IconType> = {
  // Bootstrap Icons
  BsWind,
  BsHandIndex,
  BsBandaid,
  BsThermometerHalf,
  BsChatDotsFill,
  BsThreeDots,
  BsFillHeartPulseFill,
  BsActivity,
  BsDropletFill,
  BsDroplet,
  BsExclamationTriangle,
  BsEarFill,
  BsEyeFill,
  BsBellFill,
  BsCapsulePill,
  BsExclamationOctagon,
  BsFire,
  BsShieldExclamation,
  BsSpeedometer2,
  BsLightningFill,
  BsQuestionCircle,
  BsLifePreserver,
  
  // Font Awesome Icons
  FaBrain,
};

// Default icon when the requested icon is not found
const DefaultIcon = BsQuestionCircle;

/**
 * Get an icon component by name from the whitelist.
 * Returns a default icon if the name is not found.
 * 
 * @param iconName - The name of the icon (e.g., "BsWind", "FaBrain")
 * @returns The icon component
 */
export function getIcon(iconName: string | null | undefined): IconType {
  if (!iconName) return DefaultIcon;
  return iconMap[iconName] ?? DefaultIcon;
}

/**
 * Render an icon by name with optional props.
 * 
 * @param iconName - The name of the icon
 * @param props - Optional props to pass to the icon component
 * @returns JSX element
 */
export function renderIcon(
  iconName: string | null | undefined,
  props?: React.SVGAttributes<SVGElement> & { size?: number | string }
) {
  const Icon = getIcon(iconName);
  return <Icon {...props} />;
}

export { iconMap };

