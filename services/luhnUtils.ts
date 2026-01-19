
/**
 * Implementation of the Luhn Algorithm (Mod 10).
 * Used for validation of various identification numbers like Credit Cards, 
 * IMEI numbers, and National Provider Identifiers.
 */
export const validateLuhn = (value: string): boolean => {
  const sanitized = value.replace(/\D/g, '');
  if (!sanitized || sanitized.length < 2) return false;

  let sum = 0;
  let shouldDouble = false;

  // Loop through values starting from the rightmost digit
  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

export const calculateCheckDigit = (partialNumber: string): number => {
  const sanitized = partialNumber.replace(/\D/g, '');
  let sum = 0;
  let shouldDouble = true; 

  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  const remainder = sum % 10;
  return remainder === 0 ? 0 : 10 - remainder;
};

/**
 * Generates a Luhn-compliant number string of a specified length
 * starting with the provided prefix.
 */
export const generateLuhnNumber = (prefix: string, length: number = 16): string => {
  let result = prefix;
  
  // Generate random digits up to length - 1
  while (result.length < length - 1) {
    result += Math.floor(Math.random() * 10).toString();
  }
  
  // Calculate and append the check digit
  const checkDigit = calculateCheckDigit(result);
  return result + checkDigit.toString();
};
