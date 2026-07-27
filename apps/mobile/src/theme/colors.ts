// Color tokens lifted from the finalized BoardScan screen designs.
export const colors = {
  background: '#0A0D12',
  surface: '#12161D',
  surfaceVariant: '#171C24',
  surfaceRaised: '#1A1F28',
  border: '#242A33',
  borderSubtle: '#1B2027',

  textPrimary: '#F4F6F8',
  textSecondary: '#8A93A1',
  textMuted: '#5C6472',

  teal: '#2DD4BF',
  tealMuted: '#1B4E4A',
  green: '#34D399',
  greenMuted: '#1E4436',
  amber: '#F5A93B',
  amberMuted: '#4A3A1E',
  red: '#F0625F',
  redMuted: '#4A2224',

  onAmber: '#1A1206',
} as const;

export type AppColors = typeof colors;
