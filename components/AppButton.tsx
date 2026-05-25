import React from "react";
import { StyleSheet, Text, TouchableOpacity,TouchableOpacityProps,ViewStyle,TextStyle,} from "react-native";

type AppButtonVariant = "primary" | "secondary";


interface AppButtonProps extends TouchableOpacityProps {
  title: string; 
  variant?: AppButtonVariant; 
  style?: ViewStyle; 
  textStyle?: TextStyle; 
}

export default function AppButton({
  title,
  variant = "primary", 
  style,
  textStyle,
  ...rest 
}: AppButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.button,
        variant === "primary" ? styles.buttonPrimary : styles.buttonSecondary,
        style,
      ]}
      {...rest} 
    >
      <Text
        style={[
          styles.text,
          variant === "primary" ? styles.textPrimary : styles.textSecondary,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPrimary: {
    backgroundColor: "#00AEEF", 
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#48484A", 
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  textPrimary: {
    color: "#ffffff", 
  },
  textSecondary: {
    color: "#ffffff", 
  },
});
