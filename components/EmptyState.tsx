import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import AppButton from './AppButton'; 


type EmptyStateVariant = 'loading' | 'error' | 'empty'; 

interface EmptyStateProps {
  title: string;              
  description?: string;       
  variant?: EmptyStateVariant; 
  actionLabel?: string;       
  onActionPress?: () => void; 
  style?: ViewStyle;          
}

export default function EmptyState({
  title,
  description,
  variant = 'empty', 
  actionLabel,
  onActionPress,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      
      
      {variant === 'loading' && (
        <ActivityIndicator size="large" color="#FFC928" style={styles.spinner} /> 
      )}

   
      <Text style={styles.title}>{title}</Text>
      
      
      {description && <Text style={styles.description}>{description}</Text>}

      
      {actionLabel && onActionPress && (
        <AppButton 
          title={actionLabel} 
          onPress={onActionPress} 
          style={styles.button}
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  spinner: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff', 
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#8E8E93', 
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  button: {
    marginTop: 8,
    minWidth: 160, 
  },
});