import Svg, { Path, Line } from 'react-native-svg';
import { IconProps } from './types';

export function WarningTriangleIcon({ size = 20, color = '#F0625F', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3.5 21.5 20h-19L12 3.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Line x1="12" y1="10" x2="12" y2="14.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Line x1="12" y1="17" x2="12" y2="17" stroke={color} strokeWidth={strokeWidth + 0.5} strokeLinecap="round" />
    </Svg>
  );
}
