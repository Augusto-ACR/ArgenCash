// app/index.tsx
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { THEME } from '../../constants/theme';
import AppButton from '../../components/AppButton';

export default function HomeScreen() {
  
  const router = useRouter();


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.brandContainer}>
        <Image 
          source={require('../../assets/images/LogoArgenCash.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>Tu brújula financiera en Argentina</Text>
      </View>

      <View style={styles.buttonContainer}>
        <AppButton 
          title="Cotizaciones"
          variant="primary"
          onPress={() => router.push('/quotes')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonTextPrimary}>Cotizaciones</Text>
        </AppButton>

        <AppButton 
          title="Calculadora"
          variant="primary"
          onPress={() => router.push('/calculator')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonTextPrimary}>Calculadora</Text>
        </AppButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    justifyContent: 'center',
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.xl,
  },
  brandContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: THEME.spacing.xl,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: THEME.spacing.md,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: THEME.colors.primary,
    letterSpacing: 1.5,
    marginBottom: THEME.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: THEME.spacing.md,
  },
  buttonContainer: {
    width: '100%',
    gap: THEME.spacing.md,
    marginBottom: 160,
  },
  buttonTextPrimary: {
    color: THEME.colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },

});