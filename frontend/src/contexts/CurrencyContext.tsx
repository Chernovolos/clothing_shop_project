import React, { createContext, useContext, useMemo, useState } from 'react';

type Currency = "USD" | "EUR" | "JPY"

type CurrencyContextValue = {
  currency: Currency,
  setCurrency: (currency: Currency) => void,
  convertToCurrency: (price: number) => string,
  getCurrencySymbol: () => string,
}

const rates = {
  USD: 1,
  EUR: 0.92,
  JPY: 159,
};

const currencySymbols = {
  USD: "$",
  EUR: "€",
  JPY: "¥",
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

export const CurrencyProvider  = ({children}: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>('USD');

  const value = useMemo<CurrencyContextValue>(() => ({
    currency,
    setCurrency,
    convertToCurrency: (price: number) => (price * rates[currency]).toFixed(2),
    getCurrencySymbol: () => currencySymbols[currency],
  }), [currency]);

  return (
    <CurrencyContext.Provider value={value}>
      { children }
    </CurrencyContext.Provider>
  )
}

export const useCurrencyContext = () => {
  const context = useContext(CurrencyContext);

  if(!context){
    throw new Error('useCurrency must be used inside CurrencyConvert')
  }

  return context;
}


