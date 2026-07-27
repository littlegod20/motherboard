import Svg, { Circle } from 'react-native-svg';
import { IconProps } from './types';

export function CircleIcon({ size = 20, color = '#5C6472', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}
