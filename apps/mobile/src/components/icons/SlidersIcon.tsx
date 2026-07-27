import Svg, { Circle, Path } from 'react-native-svg';
import { IconProps } from './types';

export function SlidersIcon({ size = 22, color = '#8A93A1', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 6h9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M17 6h3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Circle cx="14" cy="6" r="2.25" stroke={color} strokeWidth={strokeWidth} />

      <Path d="M4 12h3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M11 12h9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Circle cx="8" cy="12" r="2.25" stroke={color} strokeWidth={strokeWidth} />

      <Path d="M4 18h9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M17 18h3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Circle cx="14" cy="18" r="2.25" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}
