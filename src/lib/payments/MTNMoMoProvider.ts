import { PaymentProvider, PaymentRequest, PaymentResponse, PaymentVerification } from './PaymentProvider';

/**
 * MTNMoMoProvider.ts
 * ----------------------------------------------------------------
 * MTN Mobile Money provider implementation.
 *
 * To enable real MTN MoMo API integration:
 * 1. Register at https://momodeveloper.mtn.com/
 * 2. Subscribe to the Collections product.
 * 3. Get a Subscription Key (API Key) and an OIDC Client ID/Secret.
 * 4. Add the following to your .env:
 *      MTN_MOMO_API_URL=https://sandbox.momodeveloper.mtn.com
 *      MTN_MOMO_API_KEY=your-subscription-key
 *      MTN_MOMO_API_SECRET=your-client-secret
 * 5. Implement the body of initiate() and verify() with real API calls.
 */
export class MTNMoMoProvider implements PaymentProvider {
  readonly name = 'MTN_MOMO';

  private apiUrl = process.env.MTN_MOMO_API_URL || '';
  private apiKey = process.env.MTN_MOMO_API_KEY || '';
  private apiSecret = process.env.MTN_MOMO_API_SECRET || '';

  async initiate(req: PaymentRequest): Promise<PaymentResponse> {
    // TODO: Replace this mock with a real API call to MTN MoMo's
    // /collection/v1_0/requesttopay endpoint.

    console.log(`[MTN MoMo] Initiating payment of ${req.amount} for ${req.phone}`);

    return {
      status: 'PENDING',
      providerReference: `MOCK-MTN-${Date.now()}`,
      message: 'MTN MoMo payment request initiated. Awaiting customer confirmation.',
    };
  }

  async verify(reference: string): Promise<PaymentVerification> {
    // TODO: Replace this mock with a real API call to MTN MoMo's
    // /collection/v1_0/requesttopay/{reference} endpoint.

    return {
      status: 'SUCCESS',
      providerReference: reference,
      message: 'Payment successfully confirmed.',
    };
  }
}
