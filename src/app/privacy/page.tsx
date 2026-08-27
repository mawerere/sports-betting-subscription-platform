import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 px-4 max-w-4xl mx-auto w-full">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-extrabold mb-6">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-bold mb-3 text-black">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you register for an account, including your full name, 
              email address, phone number, and password. We also collect transaction data when you subscribe to our packages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-black">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to operate and maintain the Team GOLO golo platform, 
              process your transactions, communicate with you about your account and our services, 
              and to comply with our legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-black">3. Information Sharing</h2>
            <p>
              We do not share your personal information with third parties except as necessary to process your payments 
              (e.g., mobile money operators) or when required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-black">4. Data Security</h2>
            <p>
              We take reasonable measures to help protect your personal information from loss, theft, misuse, 
              and unauthorized access, disclosure, alteration, and destruction. 
              Passwords are securely hashed before being stored in our database.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-black">5. Your Choices</h2>
            <p>
              You may update or correct your account information at any time by logging into your account. 
              You may also contact us to request deletion of your account and personal information.
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
