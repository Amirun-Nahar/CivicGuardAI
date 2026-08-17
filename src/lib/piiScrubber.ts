/**
 * Client-Side Zero-PII Sanitizer Layer for CIVIC GUARD AI
 * Redacts sensitive personal information before sending payloads to AI models.
 */

export interface SanitizationResult {
  cleanedText: string;
  redactionsCount: number;
  detectedTypes: string[];
}

export function sanitizeClientInput(rawInput: string): string {
  if (!rawInput) return '';
  let cleaned = rawInput;

  // 1. Redact Bangladeshi mobile numbers (+8801... or 01...)
  cleaned = cleaned.replace(/(\+?8801|01)[3-9]\d{8}/g, '[REDACTED_PHONE]');

  // 2. Redact 10, 13, or 17 digit Bangladeshi National ID (NID) numbers
  cleaned = cleaned.replace(/\b\d{10}\b|\b\d{13}\b|\b\d{17}\b/g, '[REDACTED_NID]');

  // 3. Redact OTP sequences, PINs, and verification codes
  cleaned = cleaned.replace(/(OTP|pin|code|verification)\s*:?\s*(\d{4,6})/gi, '$1: [REDACTED_OTP]');

  // 4. Redact 16-digit credit/debit card numbers
  cleaned = cleaned.replace(/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, '[REDACTED_CARD]');

  return cleaned;
}

export function analyzePiiRedactions(rawInput: string): SanitizationResult {
  const detectedTypes: string[] = [];
  let count = 0;

  if (!rawInput) {
    return { cleanedText: '', redactionsCount: 0, detectedTypes: [] };
  }

  // Check phone
  if (/(\+?8801|01)[3-9]\d{8}/.test(rawInput)) {
    detectedTypes.push('Bangladeshi Mobile Number');
    count += (rawInput.match(/(\+?8801|01)[3-9]\d{8}/g) || []).length;
  }

  // Check NID
  if (/\b\d{10}\b|\b\d{13}\b|\b\d{17}\b/.test(rawInput)) {
    detectedTypes.push('National ID Number (10/13/17 Digit)');
    count += (rawInput.match(/\b\d{10}\b|\b\d{13}\b|\b\d{17}\b/g) || []).length;
  }

  // Check OTP
  if (/(OTP|pin|code|verification)\s*:?\s*(\d{4,6})/i.test(rawInput)) {
    detectedTypes.push('OTP / Security PIN');
    count += (rawInput.match(/(OTP|pin|code|verification)\s*:?\s*(\d{4,6})/gi) || []).length;
  }

  // Check Card
  if (/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/.test(rawInput)) {
    detectedTypes.push('Bank Card Number');
    count += (rawInput.match(/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g) || []).length;
  }

  const cleanedText = sanitizeClientInput(rawInput);

  return {
    cleanedText,
    redactionsCount: count,
    detectedTypes,
  };
}
