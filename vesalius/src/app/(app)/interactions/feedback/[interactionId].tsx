import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function RecordingFeedback() {
  const { interactionId } = useLocalSearchParams();

  return (
    <View>
      <Text>Feedback for interaction {interactionId}</Text>
    </View>
  );
}