import { PropsWithChildren, ReactElement } from 'react';
import { RefreshControlProps, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

interface ScreenContainerProps extends PropsWithChildren {
  scroll?: boolean;
  style?: ViewStyle;
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
  refreshControl?: ReactElement<RefreshControlProps>;
}

export function ScreenContainer({
  children,
  scroll = false,
  style,
  edges,
  refreshControl,
}: ScreenContainerProps) {
  if (scroll) {
    return (
      <SafeAreaView style={styles.safeArea} edges={edges}>
        <ScrollView
          contentContainerStyle={[styles.content, style]}
          refreshControl={refreshControl}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={edges}>
      <View style={[styles.content, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});
