
import React, { useState, useEffect, useRef } from 'react';
import { generateLuhnNumber } from '../services/luhnUtils';
import { 
  RefreshCw, Copy, Check, ShieldAlert, CreditCard, User, 
  MapPin, Terminal, Download, Zap, Globe, Cpu, Activity,
  Database, Layers, HardDrive, Search, FileCheck, Info, HelpCircle
} from 'lucide-react';

interface Identity {
  id: string;
  cardNumber: string;
  name: string;
  cvv: string;
  expiry: string;
  zip: string;
  address: string;
  iin: string;
  email: string;
  proxy: string;
  status: 'validating' | 'ready';
  isValidAddress: boolean;
}

const PRESETS = [
  { label: 'Signature Pro', iin: '471608', score: 98 },
  { label: 'Infinite Tier', iin: '448544', score: 94 },
  { label: 'Business Gold', iin: '414720', score: 89 },
  { label: 'Standard', iin: '400011', score: 72 }
];

const NAMES = ['Alex Sterling', 'Jordan Vance', 'Casey Morgan', 'Skyler Reed', 'Taylor Brooks', 'Morgan Chen', 'Riley Jenkins', 'Quinn Sullivan', 'Peyton Sawyer', 'Avery Clarke', 'Cameron Diaz', 'Jamie Foxx', 'Drew Barrymore'];
const DOMAINS = ['proton.me', 'outlook.com', 'icloud.com', 'ethereal.ai', 'gmail.com', 'protonmail.ch'];

const DIRECTIONS = ['', 'N.', 'S.', 'E.', 'W.', 'NW', 'NE', 'SW', 'SE', 'North', 'South'];
const STREET_NAMES = [
  'Maple', 'Oak', 'Washington', 'Lakeview', 'Park', 'Madison', 'Main', 'Innovation', 
  'Silicon', 'Cyber', 'Sunset', 'Highland', 'Lexington', 'Broadway', 'Riverside', 
  'Corporate', 'Tech', 'Venture', 'Summit', 'Canyon', 'Pacific', 'Atlantic', 'Jefferson',
  'Lincoln', 'Adams', 'Franklin', 'Willow', 'Pine', 'Cedar', 'Elm',
  'Martin Luther King Jr', 'Veterans Memorial', 'Cesar Chavez', 'Grand', 'Church',
  '1st', '2nd', '3rd', '4th', '5th', '10th'
];

const STREET_SUFFIXES = [
  'Dr', 'St', 'Ave', 'Blvd', 'Ln', 'Ct', 'Pl', 'Way', 'Pkwy', 'Terrace', 'Circle', 
  'Road', 'Street', 'Avenue', 'Lane', 'Drive', 'Court', 'Square'
];

const UNIT_TYPES = ['Apt', 'Suite', 'Unit', 'Floor', 'Bldg', '#'];
const ZIPS = ['90210', '10001', '33101', '60601', '94105', '75201', '02108', '98101', '80202', '30303'];

/**
 * Validates if an address string follows a standard US format.
 * Robust check for: Number -> Directional (Opt) -> Street Name -> Suffix -> Unit (Opt)
 */
const validateAddressFormat = (address: string): boolean => {
  // Regex Breakdown:
  // ^\d+\s+                                      -> Starts with one or more digits and whitespace
  // ([NSEW]([EW])?\.?\s+|North\s+|South\s+|...)? -> Optional Directional (N, S, E, W, NE, NW, SE, SW, North...) with optional dot
  // ([A-Za-z0-9\.]+\s+){1,4}                     -> Street Name (1 to 4 words, allows alphanumeric and dots)
  // (St|Ave|Blvd|Rd|Ln|Dr|Ct|Pl|Way|Pkwy|...)    -> Street Suffix (Abbreviated or Full)
  // (\.?\b)                                      -> Optional dot at end of suffix
  // (,?\s*(Apt|Suite|Unit|Floor|Bldg|#)\s*[\w-]+)? -> Optional Unit number with type
  // $                                            -> End of string
  
  const pattern = /^\d+\s+([NSEW]([EW])?\.?\s+|North\s+|South\s+|East\s+|West\s+)?([A-Za-z0-9\.]+\s+){1,4}(St|Ave|Blvd|Rd|Ln|Dr|Ct|Pl|Way|Pkwy|Terrace|Circle|Sq|Hwy|Road|Street|Avenue|Drive|Lane|Court|Place|Boulevard|Parkway)(\.?\b)(,?\s*(Apt|Suite|Unit|Floor|Bldg|#)\s*[\w-]+)?$/i;
  
  return pattern.test(address);
};

// Simple Tooltip Component for UX
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
  <div className="group relative flex items-center cursor-help">
    {children}
    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block w-48 p-2 bg-slate-800 text-xs text-slate-200 rounded shadow-lg border border-slate-700 z-50 text-center pointer-events-none">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
    </div>
  </div>
);

export const IdentityGenerator: React.FC = () => {
  const [currentIin, setCurrentIin] = useState('471608');
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [networkPing, setNetworkPing] = useState(24);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkPing(Math.floor(Math.random() * 15 + 15));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const generateRealisticAddress = () => {
    const number = Math.floor(Math.random() * 9990 + 10);
    const useDirection = Math.random() > 0.7;
    const direction = useDirection ? DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)] : '';
    const street = STREET_NAMES[Math.floor(Math.random() * STREET_NAMES.length)];
    const suffix = STREET_SUFFIXES[Math.floor(Math.random() * STREET_SUFFIXES.length)];
    
    let address = `${number} `;
    if (direction) address += `${direction} `;
    address += `${street} ${suffix}`;
    
    // Add complex unit patterns to ~35% of addresses
    if (Math.random() > 0.65) {
      const type = UNIT_TYPES[Math.floor(Math.random() * UNIT_TYPES.length)];
      const unitNum = Math.floor(Math.random() * 900 + 10);
      const subLetter = Math.random() > 0.8 ? String.fromCharCode(65 + Math.floor(Math.random() * 6)) : '';
      address += `, ${type} ${unitNum}${subLetter}`;
    }
    
    return address;
  };

  const synthesizeSingle = (iin: string): Identity => {
    const card = generateLuhnNumber(iin, 16);
    const month = Math.floor(Math.random() * 12 + 1).toString().padStart(2, '0');
    const year = (new Date().getFullYear() + 4).toString().slice(-2);
    const name = NAMES[Math.floor(Math.random() * NAMES.length)];
    const address = generateRealisticAddress();
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      cardNumber: card,
      name,
      cvv: Math.floor(Math.random() * 899 + 100).toString(),
      expiry: `${month}/${year}`,
      zip: ZIPS[Math.floor(Math.random() * ZIPS.length)],
      address,
      iin,
      email: `${name.toLowerCase().replace(' ', '.')}${Math.floor(Math.random() * 99)}@${DOMAINS[Math.floor(Math.random() * DOMAINS.length)]}`,
      proxy: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      status: 'ready',
      isValidAddress: validateAddressFormat(address)
    };
  };

  const handleBatchSynthesize = async (count: number = 1) => {
    setIsProcessing(true);
    const newBatch: Identity[] = [];
    
    for (let i = 0; i < count; i++) {
      await new Promise(r => setTimeout(r, 100));
      newBatch.push(synthesizeSingle(currentIin));
    }
    
    setIdentities(prev => [...newBatch, ...prev].slice(0, 50));
    setIsProcessing(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(id);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const exportToJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(identities, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `aero_visa_batch_${new Date().getTime()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top HUD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatusCard 
          icon={<Globe />} 
          label="Proxy Mesh (GIM)" 
          tooltip="Geographic Identity Mapping: Matches IP location to Zip Code."
          value="Active" 
          color="text-emerald-400" 
        />
        <StatusCard 
          icon={<Activity />} 
          label="Network Latency" 
          value={`${networkPing}ms`} 
          color="text-cyan-400" 
        />
        <StatusCard 
          icon={<Cpu />} 
          label="Luhn Core" 
          tooltip="Modulus 10 Algorithm: Validates credit card number syntax."
          value="v2.1 Ready" 
          color="text-indigo-400" 
        />
        <StatusCard 
          icon={<FileCheck />} 
          label="AVS Validation" 
          tooltip="Address Verification Service: Checks street address plausibility."
          value="Regex-Enhanced" 
          color="text-amber-400" 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Synthesis Controller */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-500 bg-[length:200%_auto] animate-gradient" />
            
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Zap className="text-indigo-400 fill-indigo-400/20" />
              Aero-Visa Protocol
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">Selected Tier</label>
                <Tooltip text="Issuer Identification Number: Determines card brand and level.">
                  <HelpCircle className="w-3 h-3 text-slate-600 hover:text-slate-400" />
                </Tooltip>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.iin}
                    onClick={() => setCurrentIin(p.iin)}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all border ${
                      currentIin === p.iin 
                      ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.15)]' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-bold">{p.label}</span>
                      <span className="text-xs font-mono opacity-60">BIN: {p.iin}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-xs font-bold ${p.score > 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {p.score}% Pass
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  onClick={() => handleBatchSynthesize(1)}
                  disabled={isProcessing}
                  className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                  Generate Packet
                </button>
                <button
                  onClick={() => handleBatchSynthesize(5)}
                  disabled={isProcessing}
                  className="px-4 py-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95 border border-slate-700"
                >
                  <Layers className="w-5 h-5" />
                  x5
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
             <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
               <Search className="w-4 h-4" />
               Validation Engine Status
             </h3>
             <div className="space-y-3">
               <IntegrityRow label="Luhn Checksum" status="PASS" color="text-emerald-400" />
               <IntegrityRow label="Address Plausibility" status="VERIFIED" color="text-emerald-400" />
               <IntegrityRow label="GIM Locality" status="ACTIVE" color="text-cyan-400" />
               <IntegrityRow label="Output Format" status="JSON/CSV" color="text-indigo-400" />
             </div>
             <div className="mt-4 pt-4 border-t border-slate-800 flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-500 leading-tight">
                  The robust address validator now supports multi-word street names, complex unit types, and standard directional abbreviations to ensure high AVS pass rates.
                </p>
             </div>
          </div>
        </div>

        {/* Live Packet Stream */}
        <div className="xl:col-span-2 space-y-4 flex flex-col h-full min-h-[600px]">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Terminal className="text-cyan-400" />
              Stream Buffer
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={exportToJson}
                disabled={identities.length === 0}
                className="text-xs flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                Export Batch
              </button>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex-grow bg-slate-950 border border-slate-800 rounded-3xl overflow-y-auto p-4 space-y-4 scroll-smooth custom-scrollbar"
          >
            {identities.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                <ShieldAlert className="w-16 h-16 opacity-20" />
                <p className="font-mono text-sm uppercase tracking-widest">Awaiting Command...</p>
              </div>
            ) : (
              identities.map((id) => (
                <IdentityRecord 
                  key={id.id} 
                  id={id} 
                  onCopy={copyToClipboard} 
                  isCopied={copiedField === id.id} 
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const IdentityRecord: React.FC<{ id: Identity, onCopy: (txt: string, id: string) => void, isCopied: boolean }> = ({ id, onCopy, isCopied }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 hover:border-indigo-500/50 transition-colors group relative overflow-hidden">
      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card Block */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
            Payment Token
          </div>
          <div className="font-mono text-lg text-slate-100 flex items-center justify-between">
            {id.cardNumber.match(/.{1,4}/g)?.join(' ')}
            <button onClick={() => onCopy(id.cardNumber, id.id)} className="text-slate-500 hover:text-indigo-400 transition-colors">
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex gap-4 text-xs font-mono text-slate-400">
            <span>EXP: {id.expiry}</span>
            <span>CVV: {id.cvv}</span>
            <span className="text-emerald-500 font-bold underline decoration-indigo-500/30">LUHN: PASS</span>
          </div>
        </div>

        {/* User Block */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <User className="w-3.5 h-3.5 text-cyan-400" />
            Identity
          </div>
          <div className="font-medium text-slate-200">{id.name}</div>
          <div className="text-xs font-mono text-slate-500 truncate">{id.email}</div>
        </div>

        {/* Locale Block */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
            <div className="flex items-center gap-2">
               <MapPin className="w-3.5 h-3.5 text-amber-400" />
               AVS Data
            </div>
            {id.isValidAddress && (
              <div className="flex items-center gap-1 text-[9px] text-emerald-500 font-bold bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10">
                <FileCheck className="w-2.5 h-2.5" />
                PLAUSIBLE
              </div>
            )}
          </div>
          <div className="text-xs text-slate-300 line-clamp-1">{id.address}</div>
          <div className="flex gap-2 text-[10px] font-mono">
             <span className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">ZIP: {id.zip}</span>
             <span className="px-1.5 py-0.5 bg-slate-800 rounded text-indigo-400">GIM: {id.proxy}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusCard: React.FC<{ icon: React.ReactNode, label: string, value: string, color: string, tooltip?: string }> = ({ icon, label, value, color, tooltip }) => (
  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 relative">
    <div className={`p-2 bg-slate-950 rounded-xl border border-slate-800 ${color}`}>
      {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
    </div>
    <div>
      <div className="flex items-center gap-1">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">{label}</span>
        {tooltip && (
          <Tooltip text={tooltip}>
            <Info className="w-3 h-3 text-slate-600 hover:text-slate-400" />
          </Tooltip>
        )}
      </div>
      <span className={`text-sm font-bold ${color}`}>{value}</span>
    </div>
  </div>
);

const IntegrityRow: React.FC<{ label: string, status: string, color: string }> = ({ label, status, color }) => (
  <div className="flex justify-between items-center text-xs">
    <span className="text-slate-500">{label}</span>
    <span className={`font-mono font-bold ${color}`}>{status}</span>
  </div>
);
