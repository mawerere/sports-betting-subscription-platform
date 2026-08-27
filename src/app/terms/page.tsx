import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="py-12 px-4 max-w-4xl mx-auto w-full">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-extrabold mb-6">Terms of Service</h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-bold mb-3 text-black">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Team GOLO golo platform, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-black">2. Description of Service</h2>
            <p>
              Team GOLO golo provides users with access to sports prediction tips and related content. 
              The service is provided on a subscription basis, and specific features available depend on the package selected.
              We do not guarantee the accuracy or success of any predictions provided.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-black">3. Registration and Accounts</h2>
            <p>
              To use certain features of the service, you must register for an account. 
              You agree to provide accurate, current, and complete information during the registration process 
              and to update such information to keep it accurate, current, and complete.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-black">4. Subscription and Payments</h2>
            <p>
              Subscriptions are billed in advance on a recurring basis as per the package selected (e.g., monthly, bi-weekly). 
              Payments are processed via integrated mobile money platforms. 
              All fees are non-refundable once the service has been accessed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-black">5. No Gambling or Betting</h2>
            <p>
              Team GOLO golo is an informational and entertainment service only. 
              We do not accept bets, and we are not a gambling operator. 
              Any predictions or chances provided are for informational purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-black">6. Modifications to Service</h2>
            <p>
              Team GOLO golo reserves the right at any time to modify or discontinue, temporarily or permanently, 
              the Service (or any part thereof) with or without notice.
            </p>
          </section>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
