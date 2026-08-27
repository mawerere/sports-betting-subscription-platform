/**
 * PaymentProvider.ts
 * ----------------------------------------------------------------
 * Abstract payment provider interface.
 * Both MTN MoMo and Airtel Money must implement this interface
 * so that the rest of the application doesn't need to know
 * which provider it is talking to.
 */

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'EXPIRED';

export interface PaymentRequest {
  userId: string;
  packageId: string;
  amount: number;
  network: 'MTN' | 'AIRTEL';
  phone: string;
  externalReference?: string; // our own unique ID for the transaction
}

export interface PaymentResponse {
  status: PaymentStatus;
  providerReference: string | null;
  message: string;
  rawResponse?: any;
}

export interface PaymentVerification {
  status: PaymentStatus;
  providerReference: string | null;
  message: string;
  rawResponse?: any;
}

export interface PaymentProvider {
  readonly name: string;
  initiate(req: PaymentRequest): Promise<PaymentResponse>;
  verify(reference: string): Promise<PaymentVerification>;
}
