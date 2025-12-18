import React, { createContext, useState, useEffect, useContext } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

const EXCHANGE_RATES = {
  USD: 1,    // Base
  CAD: 1.36,
  AUD: 1.52,
  EUR: 0.92,
  GBP: 0.79,
  BDT: 110.00, // Example for Bangladesh since phone number was +880
};

const COUNTRIES = [
    { name: "Bangladesh", code: "BD", flag: "https://flagcdn.com/16x12/bd.png", currency: "BDT" },
  { name: "United States", code: "US", flag: "https://flagcdn.com/16x12/us.png", currency: "USD" },
  { name: "Canada", code: "CA", flag: "https://flagcdn.com/16x12/ca.png", currency: "CAD" },
  { name: "Australia", code: "AU", flag: "https://flagcdn.com/16x12/au.png", currency: "AUD" },
  { name: "Germany", code: "DE", flag: "https://flagcdn.com/16x12/de.png", currency: "EUR" },
  { name: "France", code: "FR", flag: "https://flagcdn.com/16x12/fr.png", currency: "EUR" },
  { name: "Italy", code: "IT", flag: "https://flagcdn.com/16x12/it.png", currency: "EUR" },
  { name: "Spain", code: "ES", flag: "https://flagcdn.com/16x12/es.png", currency: "EUR" },
];

export const CurrencyProvider = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState(() => {
    const saved = localStorage.getItem("selectedCountry");
    return saved ? JSON.parse(saved) : COUNTRIES[0];
  });

  const [currency, setCurrency] = useState(selectedCountry.currency);

  useEffect(() => {
    localStorage.setItem("selectedCountry", JSON.stringify(selectedCountry));
    setCurrency(selectedCountry.currency);
  }, [selectedCountry]);

  const formatPrice = (priceInUSD) => {
    const rate = EXCHANGE_RATES[currency] || 1;
    const converted = priceInUSD * rate;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(converted);
  };

  const updateCountry = (country) => {
    setSelectedCountry(country);
  };

  return (
    <CurrencyContext.Provider
      value={{
        selectedCountry,
        currency,
        updateCountry,
        formatPrice,
        countries: COUNTRIES
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
