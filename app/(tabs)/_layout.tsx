// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { THEME } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Platform } from 'react-native';

export default function TabLayout() {
  const router = useRouter();

  const BackButton = () => (
    <TouchableOpacity 
      onPress={() => router.replace('/')}
      style={{ 
        marginLeft: Platform.OS === 'ios' ? 8 : 0, 
        padding: 8 
      }}
      activeOpacity={0.7}
    >
      <Ionicons 
        name={Platform.OS === 'ios' ? "chevron-back" : "arrow-back"} 
        size={24} 
        color="#FFFFFF" 
      />
    </TouchableOpacity>
  );
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: THEME.colors.primary,
        tabBarInactiveTintColor: THEME.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: THEME.colors.background,
          borderTopWidth: 1,
          borderTopColor: THEME.colors.border ,
        },
        headerStyle: {
          backgroundColor: THEME.colors.background,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerLeft: () => <BackButton />,
      }}
    >
      
      <Tabs.Screen
        name="index"
        options={{
          href: null,
          headerShown: false,
          tabBarStyle: { display: 'none' }
        }}
      />
      
      <Tabs.Screen
        name="quotes"
        options={{
          title: 'Cotizaciones',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "cash" : "cash-outline"} 
              size={size + 2} 
              color={color}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="calculator"
        options={{
          title: 'Calculadora',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "calculator" : "calculator-outline"} 
              size={size + 2} 
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}