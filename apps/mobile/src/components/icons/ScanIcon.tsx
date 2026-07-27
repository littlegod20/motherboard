import Svg, { Circle, Path } from 'react-native-svg';
import { IconProps } from './types';

export function ScanIcon({ size = 22, color = '#8A93A1', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 8V6a2 2 0 0 1 2-2h2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M20 8V6a2 2 0 0 0-2-2h-2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M4 16v2a2 2 0 0 0 2 2h2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M20 16v2a2 2 0 0 1-2 2h-2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Circle cx="12" cy="12" r="2.75" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}
