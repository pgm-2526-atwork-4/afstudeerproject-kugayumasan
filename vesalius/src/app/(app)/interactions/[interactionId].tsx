import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function InteractionDetail() {
  const { interactionId } = useLocalSearchParams();

  return (
    <View>
      <Text>Interaction {interactionId}</Text>
    </View>
  );
}