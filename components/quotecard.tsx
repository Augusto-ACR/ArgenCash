// components/QuoteCard.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { THEME } from '../constants/theme';
import { QuoteData } from '../types/quotes';
import {Ionicons} from '@expo/vector-icons';

interface QuoteCardProps {
  quote: QuoteData;
}

export default function QuoteCard({ quote }: QuoteCardProps) {
  const router = useRouter();


  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => router.push(`/details/${quote.id}`)}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.quoteName}>{quote.name}</Text>
        
        <Text style={styles.quoteValue1}>
          Cotizacion:         <Text style={styles.quoteValueHighlight}>{quote.sell ? formatCurrency(quote.sell) : '---'}</Text>             <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A', 
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
    borderColor: '#CCCCCC', 
  },
  contentContainer: {
    gap: THEME.spacing.md, 
  },
  quoteName: {
    fontSize: 18,
    color: '#ffffff', 

  },
  quoteValue: {
    fontSize: 20,
    color: '#b6b5b5', 
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  quoteValue1: {

    fontSize: 16,
    color: '#b6b5b5',
  },
  quoteValueHighlight: {
    fontSize: 22,
    color: '#ffffff',
    fontWeight: '700',
  },
});