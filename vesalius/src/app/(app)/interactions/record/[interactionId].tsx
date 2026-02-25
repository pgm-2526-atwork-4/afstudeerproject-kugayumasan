import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function RecordInteraction() {
  const { interactionId } = useLocalSearchParams();

  return (
    <View>
      <Text>Record interaction {interactionId}</Text>
    </View>
  );
}