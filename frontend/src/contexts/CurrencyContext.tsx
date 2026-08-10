import React, { createContext, useContext, useState } from 'react';

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

  const convertToCurrency = (price: number) => {
    return (price * rates[currency]).toFixed(2);
  }

  const getCurrencySymbol = () => {
    return currencySymbols[currency];
  }

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      convertToCurrency,
      getCurrencySymbol
    }}>
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


