
import React, { useState } from 'react';
import { LuhnValidator } from './components/LuhnValidator';
import { SecurityExplainer } from './components/SecurityExplainer';
import { IdentityGenerator } from './components/IdentityGenerator';
import { Shield, BookOpen, Code, Terminal } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'validator' | 'explainer' | 'generator'>('explainer');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-indigo-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                SecureSystems Edu
              </span>
            </div>
            <nav className="flex space-x-2 sm:space-x-4">
              <button
                onClick={() => setActiveTab('explainer')}
                className={`px-3 py-2 rounded-lg transition-all text-sm sm:text-base flex items-center space-x-2 ${
                  activeTab === 'explainer' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Concepts</span>
              </button>
              <button
                onClick={() => setActiveTab('validator')}
                className={`px-3 py-2 rounded-lg transition-all text-sm sm:text-base flex items-center space-x-2 ${
                  activeTab === 'validator' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Code className="w-4 h-4" />
                <span className="hidden sm:inline">Validator</span>
              </button>
              <button
                onClick={() => setActiveTab('generator')}
                className={`px-3 py-2 rounded-lg transition-all text-sm sm:text-base flex items-center space-x-2 ${
                  activeTab === 'generator' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span className="hidden sm:inline">QA Generator</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'explainer' && <SecurityExplainer />}
        {activeTab === 'validator' && <LuhnValidator />}
        {activeTab === 'generator' && <IdentityGenerator />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            Educational Resource for Frontend Engineers & Security Enthusiasts. 
            Demonstrating data integrity principles and testing methodologies.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
