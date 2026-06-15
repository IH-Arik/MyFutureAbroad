export function calculateCommission(amount: number, commissionPercentage: number): { commission: number; total: number } {
  const commission = Math.round((amount * commissionPercentage) / 100);
  return {
    commission,
    total: amount + commission,
  };
}

export function formatAmount(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function formatCurrency(cents: number, currency: string = "USD"): string {
  const code = (currency || "USD").toUpperCase();
  const amount = Number(cents ?? 0) / 100;
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: code }).format(amount);
  } catch (e) {
    const currencySymbols: Record<string, string> = {
      USD: "$", EUR: "€", GBP: "£", AUD: "A$", CAD: "C$",
      CHF: "CHF ", SEK: "kr ", NOK: "kr ", DKK: "kr ",
      PLN: "zł", CZK: "Kč", HUF: "Ft", RON: "lei ",
      TRY: "₺", JPY: "¥", CNY: "¥", INR: "₹",
      ZAR: "R ", SGD: "S$", HKD: "HK$",
    };
    const symbol = currencySymbols[code] || "$";
    return `${symbol}${amount.toFixed(2)} ${code}`;
  }
}

export default {} as any;
