import Svg, { Rect, Circle, Path } from 'react-native-svg';
import { IconProps } from './types';

export function ImageIcon({ size = 28, color = '#3A414D', strokeWidth = 1.6 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="16" rx="2" stroke={color} strokeWidth={strokeWidth} />
      <Circle cx="8.5" cy="9.5" r="1.5" stroke={color} strokeWidth={strokeWidth} />
      <Path
        d="M4 16.5 8.5 12l3.5 3.5 3-3L21 16"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
