/**
 * Currency formatting utilities for Rwanda
 * Supports both Rwandan Franc (RWF) and US Dollar (USD)
 */

// Approximate exchange rate (update as needed)
const RWF_TO_USD = 0.00078; // 1 RWF ≈ 0.00078 USD

export function formatRWF(amount: number): string {
  return new Intl.NumberFormat('rw-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function convertRWFToUSD(rwf: number): number {
  return rwf * RWF_TO_USD;
}

export function convertUSDToRWF(usd: number): number {
  return usd / RWF_TO_USD;
}

/**
 * Format currency showing both RWF and USD
 */
export function formatDualCurrency(rwfAmount: number): string {
  const usdAmount = convertRWFToUSD(rwfAmount);
  return `${formatRWF(rwfAmount)} (${formatUSD(usdAmount)})`;
}

/**
 * Format currency for display (defaults to RWF)
 */
export function formatCurrency(amount: number, showDual: boolean = false): string {
  if (showDual) {
    return formatDualCurrency(amount);
  }
  return formatRWF(amount);
}




