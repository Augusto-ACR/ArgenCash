// app/(tabs)/quotes.tsx
import React from 'react';
import { StyleSheet, FlatList, SafeAreaView, ActivityIndicator, Text, View, TouchableOpacity } from 'react-native';
import QuoteCard from '../../components/quotecard';
import { useFetchQuotes } from '../../hooks/useFetchQuotes';
import { THEME } from '../../constants/theme';

export default function QuotesScreen() {
  const { quotes, loading, error, refreshQuotes } = useFetchQuotes();

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
        <Text style={styles.infoText}>Actualizando cotizaciones...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshQuotes}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={quotes}
        renderItem={({ item }) => <QuoteCard quote={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={refreshQuotes}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: THEME.spacing.md,
  },
  listContent: {
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.xl,
  },
  infoText: {
    color: '#AEAEB2',
    fontSize: 16,
  },
  errorText: {
    color: '#FF453A',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: THEME.spacing.xl,
  },
  retryButton: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.sm,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});