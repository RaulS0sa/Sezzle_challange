import React, { useState, useEffect, useCallback } from 'react';
import { Delete } from 'lucide-react';
import { getNewDisplay } from './calculatorLogic';

interface CalcButtonProps {
  label?: string;
  onClick: () => void;
  variant?: "num" | "op" | "action" | "eq";
  icon?: React.ElementType;
  className?: string;
}

const CalcButton: React.FC<CalcButtonProps> = ({ label, onClick, variant = "num", icon: Icon, className = "" }) => {
  const styles = {
    num: "bg-[#3c4043] text-[#e8eaed] hover:bg-[#4d5053]",
    op: "bg-[#303134] text-[#8ab4f8] hover:bg-[#3c4043]",
    action: "bg-[#303134] text-[#f28b82] hover:bg-[#3c4043]",
    eq: "bg-[#8ab4f8] text-[#202124] hover:bg-[#aecbfa]",
  };

  return (
    <button
      onClick={onClick}
      className={`h-14 rounded-xl flex items-center justify-center text-lg font-semibold transition-all active:scale-95 shadow-lg ${styles[variant]} ${className}`}
    >
      {Icon ? <Icon size={20} /> : label}
    </button>
  );
};

const App: React.FC = () => {
  const [display, setDisplay] = useState<string>('0');
  const [expression, setExpression] = useState<string>('');
  const [hasResult, setHasResult] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const append = useCallback((val: string) => {
    setError(null);
    const nextDisplay = getNewDisplay(display, val, hasResult);
    
    if (hasResult) {
      if (!isNaN(Number(val)) || val === '00' || val === '.') {
        setExpression('');
      } else {
        setExpression(display);
      }
      setHasResult(false);
    }
    
    setDisplay(nextDisplay);
  }, [display, hasResult]);

  const calculate = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression: display }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setExpression(display + ' =');
        setDisplay(data.result.toString());
        setHasResult(true);
      }
    } catch {
      setError("Server Error");
    }
  }, [display]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') append(e.key);
      if (e.key === '.') append('.');
      if (e.key === '+') append('+');
      if (e.key === '-') append('-');
      if (e.key === '*') append('*');
      if (e.key === '/') append('/');
      if (e.key === '^') append('^');
      if (e.key === 'Enter' || e.key === '=') calculate();
      if (e.key === 'Backspace') setDisplay(d => d.length > 1 ? d.slice(0, -1) : '0');
      if (e.key === 'Escape') { 
        setDisplay('0'); 
        setExpression(''); 
        setError(null); 
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [append, calculate]);

  return (
    <div className="min-h-screen bg-[#171717] flex items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-lg bg-[#202124] rounded-3xl shadow-2xl overflow-hidden border border-[#3c4043]">
        <div className="p-8 text-right flex flex-col justify-end min-h-[160px]">
          <div className="text-[#9aa0a6] text-xl font-medium h-8">{expression}</div>
          <div className={`text-6xl font-bold mt-2 truncate ${error ? 'text-red-400 text-2xl' : 'text-[#e8eaed]'}`}>
            {error || display}
          </div>
        </div>

        <div className="p-6 grid grid-cols-6 gap-3 border-t border-[#3c4043] bg-[#28292c]">
          <CalcButton label="7" onClick={() => append('7')} />
          <CalcButton label="8" onClick={() => append('8')} />
          <CalcButton label="9" onClick={() => append('9')} />
          <CalcButton label="×" variant="op" onClick={() => append('*')} />
          <CalcButton label="pow" variant="op" onClick={() => append('^')} />
          <CalcButton icon={Delete} variant="action" onClick={() => setDisplay(d => d.length > 1 ? d.slice(0, -1) : '0')} />

          <CalcButton label="4" onClick={() => append('4')} />
          <CalcButton label="5" onClick={() => append('5')} />
          <CalcButton label="6" onClick={() => append('6')} />
          <CalcButton label="-" variant="op" onClick={() => append('-')} />
          <CalcButton label="√" variant="op" onClick={() => append('sqrt(')} />
          <CalcButton label="AC" variant="action" onClick={() => { setDisplay('0'); setExpression(''); setError(null); }} />

          <CalcButton label="1" onClick={() => append('1')} />
          <CalcButton label="2" onClick={() => append('2')} />
          <CalcButton label="3" onClick={() => append('3')} />
          <CalcButton label="+" variant="op" onClick={() => append('+')} />
          <CalcButton label="%" variant="op" onClick={() => append('/100')} />
          <CalcButton label="(" variant="op" onClick={() => append('(')} />

          <CalcButton label="0" onClick={() => append('0')} />
          <CalcButton label="." onClick={() => append('.')} />
          <CalcButton label="00" onClick={() => append('00')} />
          <CalcButton label="=" variant="eq" onClick={calculate} />
          <CalcButton label="÷" variant="op" onClick={() => append('/')} />
          <CalcButton label=")" variant="op" onClick={() => append(')')} />
        </div>
      </div>
    </div>
  );
};

export default App;