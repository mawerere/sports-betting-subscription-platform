import { PaymentProvider, PaymentRequest, PaymentResponse, PaymentVerification } from './PaymentProvider';
import { MTNMoMoProvider } from './MTNMoMoProvider';
import { AirtelMoneyProvider } from './AirtelMoneyProvider';

/**
 * PaymentService.ts
 * ----------------------------------------------------------------
 * The single entry point for the rest of the application.
 * Uses the provider abstraction to route payment requests to
 * either MTN MoMo or Airtel Money without the rest of the
 * code needing to know the difference.
 */
export class PaymentService {
  private providers: Record<string, PaymentProvider> = {
    MTN: new MTNMoMoProvider(),
    AIRTEL: new AirtelMoneyProvider(),
  };

  private getProvider(network: string): PaymentProvider {
    const provider = this.providers[network.toUpperCase()];
    if (!provider) {
      throw new Error(`Unsupported payment network: ${network}`);
    }
    return provider;
  }

  async initiate(req: PaymentRequest): Promise<PaymentResponse> {
    const provider = this.getProvider(req.network);
    return await provider.initiate(req);
  }

  async verify(network: string, reference: string): Promise<PaymentVerification> {
    const provider = this.getProvider(network);
    return await provider.verify(reference);
  }
}

export const paymentService = new PaymentService();
