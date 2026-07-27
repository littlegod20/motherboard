import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

interface ChevronIconProps extends IconProps {
  direction?: 'left' | 'right';
}

export function ChevronIcon({
  size = 20,
  color = '#8A93A1',
  strokeWidth = 2,
  direction = 'right',
}: ChevronIconProps) {
  const d = direction === 'left' ? 'M14.5 5.5 8 12l6.5 6.5' : 'M9.5 5.5 16 12l-6.5 6.5';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d={d} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
