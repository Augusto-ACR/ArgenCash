// app/details/[id].tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, ScrollView, FlatList, Dimensions, Image } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useFetchQuotes } from '../../hooks/useFetchQuotes';
import { THEME } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 60;


// Diccionario enriquecido con los campos exactos de tu nuevo diseño (Gráfico, Definición y Curiosidad)
const DETAIL_CONTENT: Record<string, { 
  definition: string; 
  didYouKnow: string[]; 
  variation: number;
}> = {
  oficial: {
    definition: 'Es el valor del dólar dentro del sistema formal: bancos, casas de cambio y entidades autorizadas. Sirve como referencia para calcular otros dólares, como el tarjeta o el ahorro.',
    didYouKnow: [
      'Es el dólar base. Muchos otros tipos de dólar se calculan tomando el oficial y sumando impuestos, percepciones o costos.',
      'Hay precio de compra y de venta. El banco te compra dólares a un valor y te los vende a otro más alto.',
      'Cambia según el banco. Cada banco puede mostrar una cotización un poco distinta.',
      'Sirve para comparar. Mirarlo junto al blue, MEP o cripto te ayuda a entender la brecha cambiaria.',
      'Es formal, pero no el único. Está dentro del sistema bancario, aunque mucha gente también mira otros valores para tomar decisiones.'
    ],
    variation: 0.00, 
  },
  blue: {
    definition: 'Es el dólar que se compra y vende fuera del sistema formal. Su precio surge del mercado informal y suele usarse como referencia para saber cuánto vale el dólar “en la calle”.',
    didYouKnow: [
      'No es oficial. No lo fijan bancos ni organismos públicos. Es una cotización informal.',
      'Mucha gente lo usa como referencia. Aunque no sea formal, suele mirarse para medir la situación económica.',
      'No tiene una única fuente. Distintas páginas pueden mostrar valores diferentes porque no hay una cotización oficial única.',
      'Tiene más riesgos. Al estar fuera del sistema formal, no tenés el mismo respaldo que en una operación bancaria.',
      'No sirve para todo. Puede ser referencia de precios, pero no te sirve para pagar tarjeta, apps o servicios digitales.',
      'Muestra la brecha. Compararlo con el oficial ayuda a ver la diferencia entre el mercado formal y el informal.'
    ],
    variation: 0.00,
  },
  mayorista: {
    definition: 'Es el tipo de cambio gestionado por el Banco Central que regula las operaciones a gran escala. Lo utilizan los bancos, empresas multinacionales y el comercio exterior.',
    didYouKnow: [
      'Su cotización se mueve por centavos día a día mediante la intervención directa del BCRA y es el valor real al que se liquidan las importaciones y exportaciones del país.'
    ],
    variation: 0.00,
  },
  bolsa: {
    definition: 'Es el tipo de cambio financiero que se obtiene a través de la compra de un bono soberano en pesos y su posterior venta en dólares dentro del mercado local. Es el término popular para el Dólar MEP (Mercado Electrónico de Pagos).',
     didYouKnow: [
      'Es legal y formal. A diferencia del blue, se opera dentro del mercado financiero.',
      'No comprás dólares directo. La operación se hace usando bonos u otros activos financieros.',
      'Puede tener comisiones. El broker o la plataforma pueden cobrar costos por operar.',
      'A veces no es inmediato. Según la normativa, puede haber una demora antes de poder vender el bono en dólares.',
      'También sirve para vender dólares. Podés hacer el camino inverso: vender dólares y recibir pesos.',
      'Es útil para ahorrar. Muchas personas lo usan para dolarizarse sin salir del sistema formal.'
    ],
    variation: -0.00,
  },
  liqui: {
    definition: 'El dólar CCL, o contado con liquidación, es un dólar financiero. Se usa para convertir pesos en dólares mediante inversiones, pero con liquidación vinculada al exterior.',
    didYouKnow: [
      'Se parece al MEP. Ambos usan bonos o activos financieros, pero el CCL está relacionado con dólares fuera del país.',
      'Es más avanzado. No suele ser la primera opción para usuarios principiantes.',
      'Lo miran mucho los mercados. Sirve como referencia para entender expectativas financieras y movimientos de capital.',
      'Puede necesitar una cuenta afuera. Según la operación, puede requerir una cuenta vinculada al exterior.',
      'Tiene costos y riesgos. Como depende de activos financieros, el precio puede cambiar mientras operás.',
      'También funciona al revés. Puede usarse para traer dólares del exterior y convertirlos a pesos.',
    ],
    variation: 0.00,
  },
  mep: {
    definition: 'Es una forma legal de comprar dólares usando el mercado de inversiones. Comprás un bono en pesos y lo vendés en dólares. También se lo conoce como “dólar bolsa”.',
         didYouKnow: [
      'Es legal y formal. A diferencia del blue, se opera dentro del mercado financiero.',
      'No comprás dólares directo. La operación se hace usando bonos u otros activos financieros.',
      'Puede tener comisiones. El broker o la plataforma pueden cobrar costos por operar.',
      'A veces no es inmediato. Según la normativa, puede haber una demora antes de poder vender el bono en dólares.',
      'También sirve para vender dólares. Podés hacer el camino inverso: vender dólares y recibir pesos.',
      'Es útil para ahorrar. Muchas personas lo usan para dolarizarse sin salir del sistema formal.'
    ],
    variation: 0.00,
  },
  tarjeta: {
    definition: 'Es el valor del dólar dentro del sistema formal: bancos, casas de cambio y entidades autorizadas. Sirve como referencia para calcular otros dólares, como el tarjeta o el ahorro.',
        didYouKnow: [
      'Podés pagar con dólares propios. Si tenés consumos en dólares y una caja de ahorro en dólares, muchas veces podés pagar esa parte del resumen directamente con dólares.',
      'Revisá los débitos automáticos. Netflix, Spotify, apps, juegos o servicios cloud pueden venir en dólares y sumarse al resumen sin que te des cuenta.',
      'Crédito y débito no funcionan igual. Cuando comprás con tarjeta de débito, se descuenta casi en el momento. Con tarjeta de crédito, depende del cierre, vencimiento y forma de pago.',
      'El resumen puede venir mixto. Podés tener gastos en pesos y en dólares en la misma tarjeta. Miralo bien antes de pagar.',
      'Puede tener percepciones. Algunos consumos pueden incluir percepciones impositivas. En ciertos casos, después se pueden recuperar, por ejemplo: adelantos del impuesto a las ganancias.',
      'Ojo antes de pagar el resumen. Antes de pagar en pesos, fijate si te conviene cancelar los consumos en dólares con dólares que ya tenés.'
    ],
    variation: 0.00,
  },
  cripto: {
    definition: 'Es el valor de stablecoins como USDT, USDC o DAI. Son criptomonedas que intentan mantener un valor parecido al dólar.',
            didYouKnow: [
      'No es un dólar bancario. Tener USDT o USDC no es lo mismo que tener dólares en una caja de ahorro.',
      'Funciona todo el día. El mercado cripto opera 24/7, incluso fines de semana y feriados.',
      'Cambia según la plataforma. Cada exchange o billetera puede tener una cotización distinta.',
      'Hay varias stablecoins. USDT, USDC y DAI buscan valer cerca de 1 dólar, pero no funcionan exactamente igual.',
      'Cuidá dónde lo guardás. Si usás un exchange, dependés de esa plataforma. Si usás una wallet propia, tenés que cuidar tus claves.',
      'Es rápido, pero tiene riesgos. Puede ser práctico para moverte rápido, pero no está libre de riesgo. Siempre investigá antes de usarlo.'
    ],
    variation: 0.00,
  },
};

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { quotes, loading } = useFetchQuotes();


  const quote = quotes.find((q) => q.id === id);
  const content = DETAIL_CONTENT[id || ''] || DETAIL_CONTENT['oficial'];

  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const totalItems = content.didYouKnow.length;

  useEffect(() => {
    if (totalItems <= 1) return;

    const interval = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= totalItems) {
        nextIndex = 0;
      }
      
      setActiveIndex(nextIndex);
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [activeIndex, totalItems]);

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


  
let trendColor = '#8E8E93'; 
  let trendIcon = '■';       
  
  if (variationValue > 0) {
    trendColor = '#ff453A';   
    trendIcon = '▲';          
  } else if (variationValue < 0) {
    trendColor = '#34C759';  
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
        
        <View style={styles.trendContainer}>
          <Text style={styles.trendTitle}>Spread Comercial</Text>
          
          <View style={styles.trendBadge}>
            <Text style={[styles.trendIcon, { color: trendColor }]}>
              {trendIcon}
            </Text>
            <Text style={[styles.trendPercentage, { color: trendColor }]}>
              {variationValue > 0 ? `+${variationValue}` : variationValue}%
            </Text>
          </View>
        </View>

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

        <View style={styles.textSection}>
          <Text style={styles.sectionTitle}>¿Qué es el {quote.name}?</Text>
          <Text style={styles.sectionBody}>{content.definition}</Text>
        </View>

       <View style={styles.textSection}>
          <Text style={styles.sectionTitle}>¿Sabías qué...?</Text>
          
          <FlatList
            ref={flatListRef}
            data={content.didYouKnow}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled 
            snapToInterval={CARD_WIDTH + 16} 
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContainer}
            keyExtractor={(_, index) => index.toString()}
            
            
            onMomentumScrollEnd={(event) => {
              const viewSize = event.nativeEvent.layoutMeasurement.width;
              const contentOffset = event.nativeEvent.contentOffset.x;
              const currentIndex = Math.floor(contentOffset / (CARD_WIDTH + 16));
              if (currentIndex >= 0 && currentIndex < totalItems) {
                setActiveIndex(currentIndex);
              }
            }}
            
            renderItem={({ item, index }) => (
              <View style={styles.factCard}>
                <View style={styles.factBadge}>
                  <Text style={styles.factBadgeText}>{index + 1}</Text>
                </View>
                <Text style={styles.factText}>{item}</Text>
              </View>
            )}
          />

          <View style={styles.dotsRow}>
            {content.didYouKnow.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.dot, 
                  index === activeIndex ? styles.activeDot : styles.inactiveDot
                ]} 
              />
            ))}
          </View>
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

  carouselContainer: {
    paddingHorizontal: 16, 
    paddingBottom: 8,
  },
  factCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    width: CARD_WIDTH,         
    marginRight: 16,           
    minHeight: 110,           
  },
  factBadge: {
    backgroundColor: '#FFC928',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  factBadgeText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  factText: {
    color: '#E5E5EA',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 16,               
    backgroundColor: '#FFC928',
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#48484A',
  },
});