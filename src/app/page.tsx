import Link from 'next/link';
import LivePredictionsWidget from '@/components/LivePredictionsWidget';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-black text-white py-20 px-4 text-center border-b-4 border-yellow-500">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-yellow-500 uppercase tracking-tighter">
          Winning Starts Here!
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-300">
          Join the ultimate sports prediction tips subscription platform. Get daily expert predictions and maximize your winnings with Team GOLO golo.
        </p>
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <Link href="/register" className="bg-yellow-500 text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors">
            Get Started
          </Link>
          <Link href="/free-tips" className="bg-transparent border-2 border-yellow-500 text-yellow-500 px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-500 hover:text-black transition-colors">
            View Free Tips
          </Link>
          <a
            href="https://whatsapp.com/channel/0029VbBUJIG0lwgqvIFL1I3r"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-green-400 transition-colors flex items-center gap-2"
          >
            💬 Join WhatsApp
          </a>
        </div>
      </section>

      {/* Live Predictions & WhatsApp Widget Section */}
      <section className="w-full max-w-5xl mx-auto px-4 py-12">
        <LivePredictionsWidget />
      </section>

      {/* Features */}
      <section className="py-16 px-4 max-w-5xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-12 uppercase tracking-wide">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 text-center">
            <div className="w-16 h-16 bg-yellow-500 text-black rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✓</div>
            <h3 className="text-xl font-bold mb-2">High Accuracy</h3>
            <p className="text-gray-600">Our expert analysts provide thoroughly researched predictions for the best results.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 text-center">
            <div className="w-16 h-16 bg-yellow-500 text-black rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✓</div>
            <h3 className="text-xl font-bold mb-2">Multiple Packages</h3>
            <p className="text-gray-600">Choose a package that suits your prediction style, from standard odds to VIP picks.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 text-center">
            <div className="w-16 h-16 bg-yellow-500 text-black rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✓</div>
            <h3 className="text-xl font-bold mb-2">Instant Access</h3>
            <p className="text-gray-600">Get instant access to your predictions immediately after subscribing via Mobile Money.</p>
          </div>
        </div>
      </section>
    </div>
  );
}