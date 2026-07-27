import Svg, { Circle, Path } from 'react-native-svg';
import { IconProps } from './types';

export function CheckIcon({ size = 16, color = '#0A0D12', strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Circle cx="12" cy="12" r="12" fill="#2DD4BF" />
      <Path
        d="M7.5 12.5 10 15l6.5-7"
        stroke={color}
        strokeWidth={strokeWidth + 1}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}
