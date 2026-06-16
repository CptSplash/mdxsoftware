import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAUD(cents: number): string {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(cents / 100)
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function daysUntil(iso: string): number {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000)
}

export function validateABN(abn: string): boolean {
  const weights = [10,1,3,5,7,9,11,13,15,17,19]
  const digits = abn.replace(/\s/g,'').split('').map(Number)
  if (digits.length !== 11) return false
  digits[0] -= 1
  return weights.reduce((s,w,i) => s + w*digits[i], 0) % 89 === 0
}
