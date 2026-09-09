// src/lib/email-validation.ts
import dns from 'dns/promises';
import disposableDomains from 'disposable-email-domains';

const DISPOSABLE_SET = new Set<string>(disposableDomains);

export interface ValidationResult {
  isValid: boolean;
  reason?: string;
}

/**
 * Validates syntax, disposable list, and active MX DNS records for an email address.
 */
export async function validateEmailDomain(email: string): Promise<ValidationResult> {
  const trimmed = email.trim().toLowerCase();
  
  // 1. Basic Syntax Check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, reason: 'Invalid email format' };
  }

  const domain = trimmed.split('@')[1];
  if (!domain) {
    return { isValid: false, reason: 'Invalid email domain' };
  }

  // 2. Check Disposable Domain List
  if (DISPOSABLE_SET.has(domain)) {
    return { isValid: false, reason: 'Temporary or disposable emails are not permitted' };
  }

  // 3. Perform DNS MX Record Lookup
  try {
    const mxRecords = await dns.resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      return { isValid: false, reason: 'Email domain does not accept incoming messages' };
    }
  } catch (error) {
    return { isValid: false, reason: 'Mail server for this domain could not be found' };
  }

  return { isValid: true };
}