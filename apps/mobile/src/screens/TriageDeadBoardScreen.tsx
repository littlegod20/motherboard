import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer, ScreenHeader, ContinuousProgressBar, CheckRow, Button } from '../components/common';
import { triageChecks } from '../data/mock';
import type { TriageStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<TriageStackParamList, 'TriageDeadBoard'>;

export function TriageDeadBoardScreen({ navigation }: Props) {
  const completed = triageChecks.filter((check) => check.status !== 'pending').length;
  const total = triageChecks.length;
  const nextCheck = triageChecks.find((check) => check.status === 'pending');

  return (
    <ScreenContainer scroll>
      <ScreenHeader title="Dead Board Triage" subtitle={`${completed} of ${total} checks complete`} />
      <View style={styles.progressWrap}>
        <ContinuousProgressBar percent={(completed / total) * 100} />
      </View>

      <View>
        {triageChecks.map((check, index) => (
          <CheckRow
            key={check.id}
            label={check.label}
            subtitle={check.detail}
            status={check.status}
            showDivider={index < triageChecks.length - 1}
          />
        ))}
      </View>

      <View style={styles.buttonWrap}>
        <Button
          label="Continue Triage"
          variant="primary"
          onPress={() =>
            nextCheck && navigation.navigate('TriageCheckCapture', { checkId: nextCheck.id })
          }
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  progressWrap: {
    marginBottom: 20,
  },
  buttonWrap: {
    marginTop: 24,
    marginBottom: 20,
  },
});
