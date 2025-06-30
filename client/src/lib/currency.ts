export function formatCurrency(amount: number | string, currency: string = 'INR'): string {
  // Convert string to number, handle NaN cases
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Return fallback if amount is invalid
  if (isNaN(numericAmount)) {
    return currency === 'INR' ? '₹0.00' : '$0.00';
  }
  
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(numericAmount);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(numericAmount);
}
