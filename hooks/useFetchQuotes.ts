import { useState, useEffect } from 'react';
import { QuoteData } from '../types/quotes';
import { fetchDolarQuotes } from '../services/api';

export function useFetchQuotes() {
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDolarQuotes();
      setQuotes(data);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error de red');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes();
  }, []);

  return { quotes, loading, error, refreshQuotes: loadQuotes };
}