// app/(tabs)/quotes.tsx
import React from 'react';
import { StyleSheet, FlatList, SafeAreaView, ActivityIndicator, Text, View, TouchableOpacity } from 'react-native';
import QuoteCard from '../../components/quotecard';
import { useFetchQuotes } from '../../hooks/useFetchQuotes';
import { THEME } from '../../constants/theme';
import EmptyState from '../../components/EmptyState';

export default function QuotesScreen() {
  const { quotes, loading, error, lastUpdated, refreshQuotes } = useFetchQuotes();

  const formattedLastUpdated = lastUpdated
    ? new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        hourCycle: 'h23',
      }).format(lastUpdated)
    : '---';

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <EmptyState
          title="Cargando cotizaciones..."
          variant="loading"
        />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <EmptyState
          title="Error al cargar cotizaciones"
          description={error}
          variant="error"
          actionLabel="Reintentar"
          onActionPress={refreshQuotes}
        />
      </SafeAreaView>
    );
  }
  if (quotes.length === 0) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <EmptyState
          title="No hay cotizaciones disponibles"
          description="Intenta actualizar más tarde."
          variant="empty"
          actionLabel="Actualizar"
          onActionPress={refreshQuotes}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.lastUpdateContainer}>
        <Text style={styles.lastUpdateText}>Última actualización: {formattedLastUpdated}</Text>
      </View>
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
  lastUpdateContainer: {
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.sm,
  },
  lastUpdateText: {
    color: '#AEAEB2',
    fontSize: 13,
  },
  listContent: {
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.sm,
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