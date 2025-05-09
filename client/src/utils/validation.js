/**
 * Form Validation Utility
 * Provides reusable validation functions for forms across the application
 */

// Email validation with regex
export const isValidEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// Password validation (min 8 chars, at least one letter and one number)
export const isValidPassword = (password) => {
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return re.test(String(password));
};

// Phone number validation (simple format check)
export const isValidPhone = (phone) => {
  const re = /^\+?[0-9]{10,15}$/;
  return re.test(String(phone).replace(/\s+/g, ''));
};

// URL validation
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Required field validation
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

// Min/max length validation
export const hasMinLength = (value, min) => {
  if (!value) return false;
  return String(value).length >= min;
};

export const hasMaxLength = (value, max) => {
  if (!value) return true; // Empty is valid for max length
  return String(value).length <= max;
};

// Numeric value validation
export const isNumeric = (value) => {
  if (!value && value !== 0) return false;
  return !isNaN(parseFloat(value)) && isFinite(value);
};

// Min/max value validation for numbers
export const isMinValue = (value, min) => {
  if (!isNumeric(value)) return false;
  return parseFloat(value) >= min;
};

export const isMaxValue = (value, max) => {
  if (!isNumeric(value)) return false;
  return parseFloat(value) <= max;
};

// Credit card validation
export const isValidCreditCard = (number) => {
  // Remove spaces and dashes
  number = String(number).replace(/\s+|-/g, '');
  
  // Check if only digits
  if (!/^\d+$/.test(number)) return false;
  
  // Check length (13-19 digits for major cards)
  if (number.length < 13 || number.length > 19) return false;
  
  // Luhn algorithm (checksum)
  let sum = 0;
  let double = false;
  
  // Loop from right to left
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number.charAt(i));
    
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    double = !double;
  }
  
  return sum % 10 === 0;
};

export default {
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidUrl,
  isRequired,
  hasMinLength,
  hasMaxLength,
  isNumeric,
  isMinValue,
  isMaxValue,
  isValidCreditCard
}; 