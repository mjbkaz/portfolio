import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function ThankYou() {
  return (
    <main className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#22C55E]/20 mb-6">
          <CheckCircle size={40} className="text-[#22C55E]" />
        </div>
        <h1 className="text-3xl md:text-5xl font-heading font-bold text-[#F8FAFC] mb-4">
          Message Sent! 🎉
        </h1>
        <p className="text-[#94A3B8] text-lg mb-8">
          Thank you for reaching out! I'll get back to you as soon as possible.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#22C55E] text-[#0F172A] font-semibold rounded-xl hover:bg-[#16A34A] transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
