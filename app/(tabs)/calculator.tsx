// app/(tabs)/calculator.tsx
import React, { useState } from 'react'; 
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import { useFetchQuotes } from '../../hooks/useFetchQuotes'; 
import { THEME } from '../../constants/theme';
import AppButton from '../../components/AppButton';

export default function CalculatorScreen() {
  const { quotes } = useFetchQuotes()
  const [sourceCurrency, setSourceCurrency] = useState('blue'); 
  const [targetCurrency, setTargetCurrency] = useState('ars'); 
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState('0.00');

  const handleCalculate = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setResult('0.00');
      return;
    }

    
    if (sourceCurrency === 'ars') {
      const selectedQuote = quotes.find((q) => q.id === targetCurrency);
      if (selectedQuote && selectedQuote.sell > 0) {
        const conversion = parsedAmount / selectedQuote.sell;
        setResult(conversion.toFixed(2));
      }
    } 
    else {
      const selectedQuote = quotes.find((q) => q.id === sourceCurrency);
      if (selectedQuote) {
        // Salvaguarda: Si el tipo de dólar no tiene precio de compra (como el tarjeta), usamos el de venta
        const rate = selectedQuote.buy > 0 ? selectedQuote.buy : selectedQuote.sell;
        const conversion = parsedAmount * rate;
        setResult(conversion.toFixed(2));
      }
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Moneda de origen</Text>
          
          <Text style={styles.inputLabel}>Seleccioná el tipo de cambio</Text>
          
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={sourceCurrency}
              onValueChange={(itemValue) => {
                setSourceCurrency(itemValue);
                
                if (itemValue !== 'ars') setTargetCurrency('ars');
                else setTargetCurrency('blue'); 
              }}
              dropdownIconColor="#000000"
            >
              <Picker.Item label="Pesos Argentinos (ARS)" value="ars" />
              
              {quotes.map((quote) => (
                <Picker.Item key={quote.id} label={quote.name} value={quote.id} />
              ))}
            </Picker>
          </View>

          <Text style={styles.inputLabel}>Ingresá el importe</Text>
          <TextInput 
            style={styles.textInput}
            placeholder="0.00"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={amount}
            onChangeText={(text) => {
              setAmount(text);          
              if (text === '') setResult('0.00'); 
            }}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Moneda destino</Text>
          <Text style={styles.inputLabel}>Seleccioná el tipo de cambio</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={targetCurrency}
              onValueChange={(itemValue) => {
                setTargetCurrency(itemValue);
                // Si el usuario cambia el destino a un dólar, el origen se transforma en pesos
                if (itemValue !== 'ars') setSourceCurrency('ars');
                else setSourceCurrency('blue');
              }}
              dropdownIconColor="#000000"
            >
              <Picker.Item label="Pesos Argentinos (ARS)" value="ars" />
              {quotes.map((quote) => (
                <Picker.Item key={quote.id} label={quote.name} value={quote.id} />
              ))}
            </Picker>
          </View>

          <Text style={styles.inputLabel}>Importe convertido</Text>
          <TextInput 
            style={[styles.textInput, styles.disabledInput]}
            placeholder="0.00"
            placeholderTextColor="#666"
            editable={false}
            value={result}
          />
        </View>

        <AppButton 
          title="Calcular"
          variant="primary"
          onPress={handleCalculate}
        >
          <Text style={styles.buttonText}>Calcular</Text>
        </AppButton>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
    paddingBottom: THEME.spacing.xl,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    color: THEME.colors.primary,
    fontWeight: '700',
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 5,
  },
pickerContainer: {
    backgroundColor: '#E5E5EA', 
    borderRadius: THEME.borderRadius.sm,
    marginBottom: 12,
    overflow: 'hidden', 
    justifyContent: 'center',
  },
  dropdownText: {
    color: '#000000',
    fontSize: 15,
  },
  dropdownArrow: {
    color: '#555',
    fontSize: 14,
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: '#E5E5EA', 
    borderRadius: THEME.borderRadius.sm,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000000',
    marginBottom: 10,
  },
  disabledInput: {
    backgroundColor: '#C7C7CC', 
    color: '#555',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});