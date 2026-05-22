// services/api.ts
import { QuoteData } from '../types/quotes';

const BASE_URL = 'https://dolarapi.com/v1/dolares';

export const fetchDolarQuotes = async (): Promise<QuoteData[]> => {
  try {
    const response = await fetch(BASE_URL);
    
    if (!response.ok) {
      throw new Error('Error al obtener las cotizaciones');
    }
    
    const data = await response.json();
    
    // Mapeamos la respuesta de DólarApi a nuestra interfaz QuoteData interna
    return data.map((item: any) => ({
      id: item.casa, // 'oficial', 'blue', 'mep', etc.
      name: `Dólar ${item.nombre.toUpperCase()}`,
      buy: item.compra,
      sell: item.venta,
      updatedAt: item.fechaActualizacion,
    }));
  } catch (error) {
    console.error('Error en fetchDolarQuotes:', error);
    throw error;
  }
};