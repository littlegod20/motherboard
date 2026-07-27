import Svg, { Circle, Path } from 'react-native-svg';
import { IconProps } from './types';

export function CheckCircleIcon({ size = 20, color = '#34D399', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
      <Path
        d="M8.5 12.5l2.2 2.2L15.5 9.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
