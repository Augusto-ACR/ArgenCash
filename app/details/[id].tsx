// app/details/[id].tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useFetchQuotes } from '../../hooks/useFetchQuotes';
import { THEME } from '../../constants/theme';


// Diccionario enriquecido con los campos exactos de tu nuevo diseño (Gráfico, Definición y Curiosidad)
const DETAIL_CONTENT: Record<string, { 
  definition: string; 
  didYouKnow: string; 
  variation: number;
}> = {
  oficial: {
    definition: 'Es el valor determinado por el Banco Central de la República Argentina. Sirve como base impositiva y de referencia para la liquidación de exportaciones e importaciones oficiales.',
    didYouKnow: 'Tiene fuertes restricciones y sobre su valor se calculan otros tipos de cambio como el tarjeta o el ahorro aplicando recargos impositivos.',
    variation: 0.75, 
  },
  blue: {
    definition: 'Es el tipo de cambio que opera en el mercado informal o paralelo, fuera del circuito bancario legal. Su valor se determina libremente por la oferta y la demanda cotidiana.',
    didYouKnow: 'Suele tener mayor volatilidad que los dólares financieros y su brecha con el oficial es un termómetro clave de la economía argentina.',
    variation: 2.10,
  },
  mayorista: {
    definition: 'Es el tipo de cambio gestionado por el Banco Central que regula las operaciones a gran escala. Lo utilizan los bancos, empresas multinacionales y el comercio exterior.',
    didYouKnow: 'Su cotización se mueve por centavos día a día mediante la intervención directa del BCRA y es el valor real al que se liquidan las importaciones y exportaciones del país.',
    variation: 0.05,
  },
  bolsa: {
    definition: 'Es el tipo de cambio financiero que se obtiene a través de la compra de un bono soberano en pesos y su posterior venta en dólares dentro del mercado local. Es el término popular para el Dólar MEP (Mercado Electrónico de Pagos).',
    didYouKnow: 'Al ser una operación que se realiza a través de la bolsa de valores, requiere tener una cuenta de inversión (cuenta comitente) en un banco o un broker (ALyC) autorizado.',
    variation: -0.45,
  },
  liqui: {
    definition: 'Dólar Contado con Liquidación (CCL). Consiste en la compra de un activo que cotiza en Argentina en pesos (como acciones o CEDEARs) y su posterior venta en el exterior en dólares.',
    didYouKnow: 'Es el canal legal que utilizan las empresas e inversores mayoristas para transferir divisas al extranjero o dolarizar carteras de gran volumen sin pasar por el Mercado Único de Cambios.',
    variation: 1.15,
  },
  mep: {
    definition: 'Es una forma legal de comprar dólares usando el mercado de inversiones. Comprás un bono en pesos y lo vendés en dólares. También se lo conoce como "dólar bolsa".',
    didYouKnow: 'Es legal y formal. A diferencia del blue, se opera de forma digital dentro del mercado financiero y no tiene límites ni cupos mensuales de compra.',
    variation: -0.45,
  },
  tarjeta: {
    definition: 'Es el valor que se aplica a los consumos realizados con tarjetas de crédito o débito en moneda extranjera, incluyendo servicios digitales del exterior.',
    didYouKnow: 'Incluye el Impuesto PAIS y percepciones de Ganancias. Si tu resumen cierra en dólares, podés pagarlo directamente con dólares billete para evitar estos impuestos.',
    variation: 0.00,
  },
  cripto: {
    definition: 'Representa el valor implícito de las monedas estables (stablecoins como USDT o USDC) en las plataformas de intercambio P2P.',
    didYouKnow: 'Es el único mercado cambiario que opera las 24 horas del día, los 7 días de la semana, reflejando movimientos incluso durante feriados o fines de semana.',
    variation: 0.85,
  },
};

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { quotes, loading } = useFetchQuotes();

  // Traemos los valores de tiempo real de la API
  const quote = quotes.find((q) => q.id === id);
  // Traemos los textos estéticos y gráficos locales de nuestro diseño
  const content = DETAIL_CONTENT[id || ''] || DETAIL_CONTENT['oficial'];

    if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
      </SafeAreaView>
    );
  }

    if (!quote) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>No se encontró información para esta divisa.</Text>
      </SafeAreaView>
    );
  }

  const buyPrice = quote.buy > 0 ? quote.buy : quote.sell; // Salvaguarda por si compra es 0
  const sellPrice = quote.sell;
  // Fórmula: ((Venta - Compra) / Compra) * 100
  const calculatedVariation = ((sellPrice - buyPrice) / buyPrice) * 100;
  // Lo limitamos a 2 decimales para que no quede un número gigante
  const variationValue = parseFloat(calculatedVariation.toFixed(2));


  
let trendColor = '#8E8E93'; // Gris por defecto (si da 0)
  let trendIcon = '■';        // Estable
  
  if (variationValue > 0) {
    trendColor = '#ff453A';   // Rojo si la brecha es positiva ▲
    trendIcon = '▲';          
  } else if (variationValue < 0) {
    trendColor = '#34C759';   // verde si da negativo ▼
    trendIcon = '▼';          
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(value);
  };





  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: quote ? quote.name : 'Detalle', 
           headerTintColor: '#FFFFFF',
          headerStyle: {
           
            backgroundColor: '#1E1E1E',
            
          },
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
{/* 1. Bloque de Tendencia Dinámico */}
        <View style={styles.trendContainer}>
          <Text style={styles.trendTitle}>Spread Comercial</Text>
          
          <View style={styles.trendBadge}>
            {/* Usamos el color e ícono dinámico que calculamos en el Paso 2 */}
            <Text style={[styles.trendIcon, { color: trendColor }]}>
              {trendIcon}
            </Text>
            <Text style={[styles.trendPercentage, { color: trendColor }]}>
              {variationValue > 0 ? `+${variationValue}` : variationValue}%
            </Text>
          </View>
        </View>

        {/* 2. Bloque de Precios en Amarillo (Compra / Venta) */}
        <View style={styles.pricesRow}>
          <View style={styles.priceBlock}>
            <Text style={styles.priceLabel}>Compra</Text>
            <Text style={styles.priceValue}>
              {quote.buy > 0 ? formatCurrency(quote.buy) : '---'}
            </Text>
          </View>
          
          <View style={styles.priceBlock}>
            <Text style={styles.priceLabel}>Venta</Text>
            <Text style={styles.priceValue}>{formatCurrency(quote.sell)}</Text>
          </View>
        </View>

        {/* 3. Sección Informativa: ¿Qué es? */}
        <View style={styles.textSection}>
          <Text style={styles.sectionTitle}>¿Qué es el {quote.name}?</Text>
          <Text style={styles.sectionBody}>{content.definition}</Text>
        </View>

        {/* 4. Sección Interactiva: ¿Sabías qué...? */}
        <View style={styles.textSection}>
          <Text style={styles.sectionTitle}>¿Sabías qué...?</Text>
          <Text style={styles.sectionBody}>{content.didYouKnow}</Text>
        </View>

      </ScrollView>
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
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.xl,
    alignItems: 'center',
  },
  chartContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#151515',
    borderRadius: THEME.borderRadius.md,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#222',
  },
  chartImage: {
    width: '95%',
    height: '90%',
  },
  pricesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: THEME.spacing.xl,
    marginBottom: 40,
  },
  priceBlock: {
    alignItems: 'center',
    flex: 1,
  },
  priceLabel: {
    fontSize: 16,
    color: '#FFC928', 
    fontWeight: '600',
    marginBottom: 8,
  },
  priceValue: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  textSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 35,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FFC928', 
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  sectionBody: {
    fontSize: 15,
    color: '#D1D1D6', 
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: THEME.spacing.sm,
  },
  errorText: {
    color: '#FF453A',
    fontSize: 16,
  },
  trendContainer: {
    width: '100%',
    backgroundColor: '#1C1C1E', 
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  trendTitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trendIcon: {
    fontSize: 20,
    color: '#34C759', 
  },
  trendPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34C759',
  },
});