import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'ZWL' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertAmount: (amount: number) => string;
  exchangeRate: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('ZWL');
  const [exchangeRate, setExchangeRate] = useState(1);

  // In a real app, you would fetch this from an API
  useEffect(() => {
    // Simulate fetching exchange rate
    const fetchExchangeRate = async () => {
      // This is a mock rate - in production, fetch from an API
      setExchangeRate(0.0028); // 1 ZWL = 0.0028 USD
    };
    fetchExchangeRate();
  }, []);

  const convertAmount = (amount: number) => {
    if (currency === 'ZWL') {
      return `ZWL ${amount.toLocaleString()}`;
    } else {
      const usdAmount = amount * exchangeRate;
      return `$${usdAmount.toFixed(2)}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertAmount, exchangeRate }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
} 