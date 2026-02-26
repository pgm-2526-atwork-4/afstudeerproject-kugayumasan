import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

const COLORS = {
  primary: "#20BBC0",
  bgTint: "#EBF6F8",
  text: "#2A3A51",
  border: "#E7E7E7",
  white: "#FFFFFF",
  destructive: "#D64545",
};

type ButtonVariant =
  | "default"
  | "outline"
  | "ghost"
  | "destructive"
  | "link"
  | "secondary";
type ButtonSize = "sm" | "default" | "lg" | "icon";

type Props = {
  title?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
};

export function Button({
  title,
  children,
  onPress,
  disabled,
  loading,
  variant = "default",
  size = "default",
  style,
  textStyle,
  accessibilityLabel,
}: Props) {
  const isDisabled = disabled || loading;

  const renderChildren = () => {
    // Wrap raw strings/numbers inside Text so old usage still works:
    // <Button>Annuleren</Button>
    return React.Children.map(children, (child) => {
      if (typeof child === "string" || typeof child === "number") {
        return (
          <Text style={[styles.textBase, stylesByVariant[variant].text, textStyle]}>
            {child}
          </Text>
        );
      }
      return child;
    });
  };

  const hasChildren = children !== undefined && children !== null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        accessibilityLabel ?? (typeof title === "string" ? title : undefined)
      }
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        stylesBySize[size],
        stylesByVariant[variant].container,
        pressed && !isDisabled ? styles.pressed : null,
        isDisabled ? styles.disabled : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator />
      ) : hasChildren ? (
        <View style={styles.contentRow}>{renderChildren()}</View>
      ) : (
        <Text style={[styles.textBase, stylesByVariant[variant].text, textStyle]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  textBase: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "500",
  },
});

const stylesBySize: Record<ButtonSize, ViewStyle> = {
  sm: { height: 32, paddingHorizontal: 12 },
  default: { height: 40, paddingHorizontal: 16 },
  lg: { height: 44, paddingHorizontal: 20 },
  icon: { height: 40, width: 40 },
};

const stylesByVariant: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
  default: {
    container: { backgroundColor: COLORS.primary, borderWidth: 1, borderColor: COLORS.primary },
    text: { color: COLORS.white },
  },
  outline: {
    container: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border },
    text: { color: COLORS.text },
  },
  ghost: {
    container: { backgroundColor: "transparent", borderWidth: 0 },
    text: { color: COLORS.text },
  },
  secondary: {
    container: { backgroundColor: COLORS.bgTint, borderWidth: 1, borderColor: COLORS.border },
    text: { color: COLORS.text },
  },
  destructive: {
    container: { backgroundColor: COLORS.destructive, borderWidth: 1, borderColor: COLORS.destructive },
    text: { color: COLORS.white },
  },
  link: {
    container: { backgroundColor: "transparent", borderWidth: 0, paddingHorizontal: 0 },
    text: { color: COLORS.primary, textDecorationLine: "underline" },
  },
};