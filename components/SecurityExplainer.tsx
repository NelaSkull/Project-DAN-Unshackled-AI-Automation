
import React from 'react';
// Added BookOpen to the imports from lucide-react
import { Lock, ShieldCheck, Database, Server, AlertTriangle, BookOpen } from 'lucide-react';

const SecurityCard: React.FC<{ 
  title: string; 
  icon: React.ReactNode; 
  description: string;
  points: string[];
}> = ({ title, icon, description, points }) => (
  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-indigo-500 transition-colors">
    <div className="mb-4 flex items-center gap-3">
      <div className="p-2 bg-slate-800 rounded-lg text-indigo-400">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
    </div>
    <p className="text-slate-400 text-sm mb-4 leading-relaxed">{description}</p>
    <ul className="space-y-2">
      {points.map((point, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
          <span className="mt-1.5 w-1 h-1 rounded-full bg-indigo-500 shrink-0" />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  </div>
);

export const SecurityExplainer: React.FC = () => {
  return (
    <div className="space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Modern Payment <span className="text-indigo-500">Defense Architecture</span>
        </h1>
        <p className="text-slate-400 text-lg">
          Understanding the multi-layered systems that financial institutions use to prevent unauthorized transactions and verify identities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SecurityCard
          title="AVS Verification"
          icon={<Database className="w-6 h-6" />}
          description="The Address Verification System compares the numeric portion of the billing address and ZIP code provided by the customer against data on file at the issuing bank."
          points={[
            "Partial matches can trigger manual reviews.",
            "Helps verify that the user is the legitimate owner.",
            "Often used in CNP (Card Not Present) transactions."
          ]}
        />
        <SecurityCard
          title="Authorization Holds"
          icon={<Lock className="w-6 h-6" />}
          description="A temporary hold placed on a customer's account balance by the bank to verify that sufficient funds exist for a transaction."
          points={[
            "Used for $0.00 or $1.00 trial verifications.",
            "Ensures the account is active and hasn't been closed.",
            "Automatically released after a few days."
          ]}
        />
        <SecurityCard
          title="Risk Scoring"
          icon={<AlertTriangle className="w-6 h-6" />}
          description="Sophisticated AI models analyze hundreds of parameters in milliseconds to determine the likelihood of fraud."
          points={[
            "Geolocation and IP address matching.",
            "Device fingerprinting (browser type, OS, etc.).",
            "Behavioral analysis of the checkout process."
          ]}
        />
        <SecurityCard
          title="3-D Secure"
          icon={<ShieldCheck className="w-6 h-6" />}
          description="A protocol designed to be an additional security layer for online credit and debit card transactions."
          points={[
            "Requires an additional verification step (OTP/Biometric).",
            "Known as Verified by Visa or Mastercard Identity Check.",
            "Significantly reduces fraudulent chargebacks."
          ]}
        />
        <SecurityCard
          title="PCI Compliance"
          icon={<Server className="w-6 h-6" />}
          description="The Payment Card Industry Data Security Standard (PCI DSS) is a set of security standards designed to ensure that ALL companies that accept, process, store or transmit credit card information maintain a secure environment."
          points={[
            "Mandates strong encryption for data in transit.",
            "Requires regular vulnerability scans.",
            "Strict access control for cardholder data."
          ]}
        />
        <SecurityCard
          title="Bin Lists (IIN)"
          icon={<BookOpen className="w-6 h-6" />}
          description="Issuer Identification Numbers (the first 6-8 digits) allow merchants to identify the bank that issued the card."
          points={[
            "Identifies card type (Debit, Credit, Prepaid).",
            "Identifies the issuing country.",
            "Merchants use this to block high-risk card types."
          ]}
        />
      </div>

      <section className="bg-slate-900 border border-slate-800 p-8 rounded-3xl mt-12">
        <h2 className="text-2xl font-bold mb-4">Architectural Integrity</h2>
        <div className="prose prose-invert max-w-none text-slate-400">
          <p>
            The robustness of financial systems relies on layered security. While simple algorithms like Luhn can validate the 
            syntactical correctness of a number, true transactional security involves cryptographic verification, multi-factor 
            authentication, and real-time behavioral monitoring.
          </p>
          <p className="mt-4">
            For engineers, building secure payment integrations means relying on trusted providers (like Stripe or Adyen) that 
            handle the complexity of PCI compliance and leverage vast datasets to stop sophisticated evasion techniques.
          </p>
        </div>
      </section>
    </div>
  );
};
