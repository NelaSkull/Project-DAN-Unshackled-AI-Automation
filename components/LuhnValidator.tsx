
import React, { useState, useEffect } from 'react';
import { validateLuhn, calculateCheckDigit } from '../services/luhnUtils';
import { CheckCircle, XCircle, Info, Calculator } from 'lucide-react';

export const LuhnValidator: React.FC = () => {
  const [input, setInput] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [checkDigitResult, setCheckDigitResult] = useState<number | null>(null);

  useEffect(() => {
    if (input.length > 1) {
      setIsValid(validateLuhn(input));
    } else {
      setIsValid(null);
    }
  }, [input]);

  const handleCalculateCheck = () => {
    if (input.length > 0) {
      setCheckDigitResult(calculateCheckDigit(input));
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <section className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <Calculator className="text-indigo-400" />
          The Luhn Algorithm Engine
        </h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          The Luhn algorithm or Luhn formula, also known as the "modulus 10" algorithm, is a simple checksum formula used to validate a variety of identification numbers. It is not intended to be a cryptographically secure hash function; it was designed to protect against accidental errors, such as digit mistyping.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Enter Number to Validate
            </label>
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 79927398713"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xl tracking-widest focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {isValid === true && <CheckCircle className="text-emerald-500 w-8 h-8" />}
                {isValid === false && <XCircle className="text-rose-500 w-8 h-8" />}
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Only digits are allowed. The last digit is treated as the checksum.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleCalculateCheck}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Calculate Check Digit
            </button>
            {checkDigitResult !== null && (
              <div className="flex items-center gap-3 px-6 py-3 bg-slate-800 rounded-xl border border-slate-700">
                <span className="text-slate-400">Required Check Digit:</span>
                <span className="text-2xl font-mono text-cyan-400 font-bold">{checkDigitResult}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-400" />
            Step-by-Step Logic
          </h3>
          <ol className="list-decimal list-inside space-y-3 text-slate-400 text-sm">
            <li>From the rightmost digit (which is the check digit) and moving left...</li>
            <li>Double the value of every second digit.</li>
            <li>If doubling results in a number &gt; 9, subtract 9 from it.</li>
            <li>Sum all the digits in the sequence.</li>
            <li>If the total modulo 10 is equal to 0, the number is valid.</li>
          </ol>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-xl font-semibold mb-4">Common Applications</h3>
          <ul className="space-y-3 text-slate-400 text-sm">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Credit Card Numbers (IIN/PAN)
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              IMEI (Mobile Device IDs)
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Canadian Social Insurance Numbers
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Israel ID Numbers
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};
