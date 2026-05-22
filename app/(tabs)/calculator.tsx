// app/(tabs)/calculator.tsx
import { THEME } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function CalculatorScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pantalla de Calculadora (Próximamente)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: THEME.colors.background },
  text: { fontSize: 18, color: '#fff' },
});