// components/QuoteCard.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { THEME } from '../constants/theme';
import { QuoteData } from '../types/quotes';

interface QuoteCardProps {
  quote: QuoteData;
}

export default function QuoteCard({ quote }: QuoteCardProps) {
  const router = useRouter();

  // Función para formatear los números a moneda argentina ($ 1.243,34)
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
        
        <Text style={styles.quoteValue}>
          {quote.sell ? formatCurrency(quote.sell) : '---'}
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
    fontSize: 16,
    color: '#AEAEB2', 
    fontWeight: '500',
  },
  quoteValue: {
    fontSize: 22,
    color: '#FFFFFF', 
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});