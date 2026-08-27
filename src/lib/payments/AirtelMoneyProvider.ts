import { PaymentProvider, PaymentRequest, PaymentResponse, PaymentVerification } from './PaymentProvider';

/**
 * AirtelMoneyProvider.ts
 * ----------------------------------------------------------------
 * Airtel Money provider implementation.
 *
 * To enable real Airtel Money API integration:
 * 1. Register at https://developers.airtel.africa/
 * 2. Create an application and subscribe to the Collections API.
 * 3. Get a Client ID and Client Secret.
 * 4. Add the following to your .env:
 *      AIRTEL_API_URL=https://openapiuat.airtel.africa
 *      AIRTEL_CLIENT_ID=your-client-id
 *      AIRTEL_CLIENT_SECRET=your-client-secret
 * 5. Implement the body of initiate() and verify() with real API calls.
 */
export class AirtelMoneyProvider implements PaymentProvider {
  readonly name = 'AIRTEL_MONEY';

  private apiUrl = process.env.AIRTEL_API_URL || '';
  private clientId = process.env.AIRTEL_CLIENT_ID || '';
  private clientSecret = process.env.AIRTEL_CLIENT_SECRET || '';

  async initiate(req: PaymentRequest): Promise<PaymentResponse> {
    // TODO: Replace this mock with a real API call to Airtel Money's
    // /merchant/v1/payments/ endpoint.

    console.log(`[Airtel Money] Initiating payment of ${req.amount} for ${req.phone}`);

    return {
      status: 'PENDING',
      providerReference: `MOCK-AIRTEL-${Date.now()}`,
      message: 'Airtel Money payment request initiated. Awaiting customer confirmation.',
    };
  }

  async verify(reference: string): Promise<PaymentVerification> {
    // TODO: Replace this mock with a real API call to Airtel Money's
    // transaction status endpoint.

    return {
      status: 'SUCCESS',
      providerReference: reference,
      message: 'Payment successfully confirmed.',
    };
  }
}
