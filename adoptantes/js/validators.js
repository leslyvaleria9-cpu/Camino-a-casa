// js/validators.js

export function validateRUT(rut) {
  if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rut)) return false;
  
  const tmp = rut.split('-');
  let digv = tmp[1]; 
  const rutNum = tmp[0];
  
  if (digv === 'K') digv = 'k';
  
  return calculateRutDigit(rutNum) === digv;
}

function calculateRutDigit(T) {
  let M = 0, S = 1;
  for (; T; T = Math.floor(T / 10)) {
    S = (S + T % 10 * (9 - M++ % 6)) % 11;
  }
  return S ? String(S - 1) : 'k';
}

export function formatRUT(rut) {
  let cleaned = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  if (cleaned.length < 2) return cleaned;
  
  const dv = cleaned.slice(-1);
  let rutNum = cleaned.slice(0, -1);
  
  // Format with dots
  let formatted = '';
  while (rutNum.length > 3) {
    formatted = '.' + rutNum.slice(-3) + formatted;
    rutNum = rutNum.slice(0, -3);
  }
  formatted = rutNum + formatted + '-' + dv;
  
  return formatted;
}

export function validatePhone(phone) {
  // Ej: +56 9 1234 5678 (permite espacios)
  const phoneRegex = /^\+56\s?9\s?\d{4}\s?\d{4}$/;
  return phoneRegex.test(phone.trim());
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateRequired(value) {
  return value !== null && value !== undefined && value.trim() !== '';
}
