import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme/colors';

type FrameVariant = 'neutral' | 'pass' | 'fail' | 'pendingDashed';

interface ViewfinderFrameProps extends PropsWithChildren {
  variant?: FrameVariant;
  height?: number;
}

const variantColor: Record<Exclude<FrameVariant, 'pendingDashed'>, string> = {
  neutral: colors.textMuted,
  pass: colors.green,
  fail: colors.red,
};

const CORNER_SIZE = 22;
const CORNER_THICKNESS = 2;

export function ViewfinderFrame({ variant = 'neutral', height = 320, children }: ViewfinderFrameProps) {
  if (variant === 'pendingDashed') {
    return (
      <View style={[styles.dashedFrame, { height: height * 0.55 }]}>
        <View style={styles.centerContent}>{children}</View>
      </View>
    );
  }

  const color = variantColor[variant];

  return (
    <View style={[styles.container, { height }]}>
      <View style={[styles.corner, styles.cornerTL, { borderColor: color }]} />
      <View style={[styles.corner, styles.cornerTR, { borderColor: color }]} />
      <View style={[styles.corner, styles.cornerBL, { borderColor: color }]} />
      <View style={[styles.corner, styles.cornerBR, { borderColor: color }]} />
      <View style={styles.centerContent}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
  },
  cornerTL: {
    top: '18%',
    left: '10%',
    borderLeftWidth: CORNER_THICKNESS,
    borderTopWidth: CORNER_THICKNESS,
  },
  cornerTR: {
    top: '18%',
    right: '10%',
    borderRightWidth: CORNER_THICKNESS,
    borderTopWidth: CORNER_THICKNESS,
  },
  cornerBL: {
    bottom: '18%',
    left: '10%',
    borderLeftWidth: CORNER_THICKNESS,
    borderBottomWidth: CORNER_THICKNESS,
  },
  cornerBR: {
    bottom: '18%',
    right: '10%',
    borderRightWidth: CORNER_THICKNESS,
    borderBottomWidth: CORNER_THICKNESS,
  },
  dashedFrame: {
    marginHorizontal: '12%',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.amber,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
