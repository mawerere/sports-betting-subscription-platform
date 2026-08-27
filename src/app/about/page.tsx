import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="py-12 px-4 max-w-4xl mx-auto w-full">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-black uppercase tracking-tight">About Team GOLO golo</h1>
        <h2 className="text-2xl font-bold mb-8 text-center text-yellow-600">Winning Starts Here!</h2>
        
        <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
          <p>
            Welcome to <strong>Team GOLO golo</strong>, your ultimate destination for premium sports prediction tips. 
            We are dedicated to providing our subscribers with highly researched, expertly analyzed, and incredibly accurate sports predictions.
          </p>
          <p>
            Our mission is simple: to help you maximize your winnings. Whether you are a casual fan looking for some free daily tips 
            or a serious bettor seeking high-chance VIP tickets, we have a package perfectly tailored for your strategy.
          </p>
          <h3 className="text-2xl font-bold text-black mt-8 mb-4">Why Choose Us?</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Expert Analysis:</strong> Our team of seasoned sports analysts work around the clock to find the best value chances.</li>
            <li><strong>Transparency:</strong> We keep a public record of all our predictions. Your dashboard tracks our real-time performance.</li>
            <li><strong>Affordability:</strong> With packages starting as low as UGX 45,000 per month, premium advice has never been more accessible.</li>
            <li><strong>Convenience:</strong> Integrated with MTN Mobile Money and Airtel Money, getting started takes less than 60 seconds.</li>
          </ul>
        </div>

        <div className="mt-12 text-center">
          <Link href="/register" className="inline-block bg-black text-white px-8 py-4 rounded-full font-extrabold text-lg hover:bg-gray-800 transition-colors shadow-xl">
            Join Team GOLO golo Today
          </Link>
        </div>
      </div>
    </div>
  );
}
