import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Rates = Record<string, number>;

interface CurrencyContextValue {
  currency: string;
  setCurrency: (c: string) => void;
  rates: Rates | null;
  loading: boolean;
  formatPrice: (amountUsd: number | null | undefined) => string;
  formatAmount: (amount: number | null | undefined, fromCurrency?: string) => string;
  formatVisaAmount: (baseAmount: number | null | undefined, baseCurrency: string | null | undefined) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const DEFAULT = {
  currency: "USD",
};

// Currency symbols and metadata
export const CURRENCY_SYMBOLS: Record<string, { symbol: string; name: string }> = {
  USD: { symbol: "$", name: "US Dollar" },
  EUR: { symbol: "€", name: "Euro" },
  GBP: { symbol: "£", name: "British Pound" },
  AUD: { symbol: "A$", name: "Australian Dollar" },
  CAD: { symbol: "C$", name: "Canadian Dollar" },
  JPY: { symbol: "¥", name: "Japanese Yen" },
  CHF: { symbol: "₣", name: "Swiss Franc" },
  CNY: { symbol: "¥", name: "Chinese Yuan" },
  INR: { symbol: "₹", name: "Indian Rupee" },
  SGD: { symbol: "S$", name: "Singapore Dollar" },
  HKD: { symbol: "HK$", name: "Hong Kong Dollar" },
  NZD: { symbol: "NZ$", name: "New Zealand Dollar" },
};

async function fetchRates(): Promise<Rates | null> {
  try {
    // ExchangeRate-API: https://www.exchangerate-api.com/docs/free
    // Returns { result: "success", base_code: "USD", rates: { EUR: 0.92, ... } }
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    if (!res.ok) return null;
    const json = await res.json();
    return (json.rates ?? null) as Rates;
  } catch (e) {
    return null;
  }
}

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<string>(() => {
    try {
      return localStorage.getItem("mfa_currency") || DEFAULT.currency;
    } catch {
      return DEFAULT.currency;
    }
  });
  const [rates, setRates] = useState<Rates | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setFetching(true);
      const r = await fetchRates();
      if (!mounted) return;
      setRates(r);
      setLoading(false);
      setFetching(false);
    };
    load();
    return () => { mounted = false; };
  }, []);

  const setCurrency = (c: string) => {
    setCurrencyState(c);
    try { localStorage.setItem("mfa_currency", c); } catch {}
  };

  // Ensure rates are available when user changes currency
  useEffect(() => {
    if (currency === DEFAULT.currency) return;
    if (rates && rates[currency]) return; // have rate for selected currency
    if (fetching) return; // already fetching

    let mounted = true;
    const ensureRates = async () => {
      setFetching(true);
      const r = await fetchRates();
      if (!mounted) return;
      setRates(r);
      setFetching(false);
    };
    ensureRates();
    return () => { mounted = false; };
  }, [currency, rates, fetching]);

  const formatPrice = (amountUsd: number | null | undefined) => {
    return formatAmount(amountUsd, "USD");
  };

  const formatAmount = (amount: number | null | undefined, fromCurrency: string = "USD") => {
    const amt = Number(amount ?? 0);
    if (!isFinite(amt)) return "";
    
    // If rates exist and have the target and source currency, convert
    let converted = amt;
    if (rates && rates[currency] && rates[fromCurrency]) {
      const fromRate = rates[fromCurrency] ?? 1;
      const amountInUsd = amt / fromRate;
      const targetRate = rates[currency] ?? 1;
      converted = amountInUsd * targetRate;
      try {
        return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(converted);
      } catch {
        return `${currency} ${converted.toFixed(2)}`;
      }
    }

    // Fallback: format using the selected currency symbol (no conversion)
    try {
      return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(converted);
    } catch {
      return `${currency} ${converted.toFixed(2)}`;
    }
  };

  // Format visa fee: if viewing in base currency, show base amount directly (no conversion)
  // Otherwise convert from base currency to selected currency
  const formatVisaAmount = (baseAmount: number | null | undefined, baseCurrency: string | null | undefined) => {
    const amt = Number(baseAmount ?? 0);
    if (!isFinite(amt)) return "";

    const base = baseCurrency || "USD";

    // If viewing in the same currency as base, return the base amount directly (no conversion)
    if (currency === base) {
      try {
        return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amt);
      } catch {
        return `${currency} ${amt.toFixed(2)}`;
      }
    }

    // Otherwise, convert using the existing formatAmount logic
    return formatAmount(amt, base);
  };

  const ctx = useMemo(() => ({ currency, setCurrency, rates, loading, formatPrice, formatAmount, formatVisaAmount }), [currency, rates, loading, formatPrice, formatAmount, formatVisaAmount]);

  return <CurrencyContext.Provider value={ctx}>{children}</CurrencyContext.Provider>;
};

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}

export default CurrencyProvider;
