import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export function ActivityIcon({ size = 22, color = '#8A93A1', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 12h4l2.5-7 4 14 2.5-7H21"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
