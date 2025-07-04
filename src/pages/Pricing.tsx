
import { PricingSection } from "@/components/PricingSection";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Start for free, upgrade when you're ready to download. Choose the plan that works best for you.
          </p>
          <div className="flex items-center justify-center gap-1 mb-4">
            <span className="text-green-600 font-medium">✓ No hidden fees</span>
            <span className="mx-2">•</span>
            <span className="text-green-600 font-medium">✓ Instant access</span>
            <span className="mx-2">•</span>
            <span className="text-green-600 font-medium">✓ Money-back guarantee</span>
          </div>
        </div>
      </section>

      <PricingSection />

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Can I use the resume builder for free?</h3>
              <p className="text-gray-600">Yes! You can create and preview your resume completely free. You only need to pay when you want to download the PDF.</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Are the templates ATS-friendly?</h3>
              <p className="text-gray-600">Absolutely! All our templates are designed to pass through Applicant Tracking Systems (ATS) to ensure your resume gets seen by hiring managers.</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major payment methods through Razorpay, including credit cards, debit cards, UPI, and net banking.</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Can I edit my resume after downloading?</h3>
              <p className="text-gray-600">Yes! Your resume data is saved to your account, so you can always come back to edit and download updated versions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who've upgraded their careers with Resumify
          </p>
          <a href="/builder">
            <button className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-8 py-3 rounded-lg font-medium transition-colors">
              Start Building Now
            </button>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
