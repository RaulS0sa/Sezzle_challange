import React, { useState } from 'react';
import { History, Delete, X } from 'lucide-react';

const App: React.FC = () => {
  const [display, setDisplay] = useState<string>('0');
  const [expression, setExpression] = useState<string>('');
  const [hasResult, setHasResult] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

const append = (val: string) => {
  setError(null);

  // 1. Handle state after a result was just calculated
  if (hasResult) {
    setHasResult(false);
    if (!isNaN(Number(val)) || val === '00' || val === '.') {
      // Starting a brand new calculation
      setDisplay(val === '00' ? '0' : val);
      setExpression('');
      return;
    } else {
      // Continuing the calculation using the result as the first operand
      setExpression(display);
      // If we continue with a parenthesis, add implicit multiplication: "10" -> "10*("
      if (display == '0' && (val === '(' || val === 'sqrt(')) {
        setDisplay(val);
      }
      else if (val === '(' || val === 'sqrt(') {
        setDisplay(display + '*' + val);
      } else {
        setDisplay(display + val);
      }
      return;
    }
  }

  // 2. Handle standard input
  setDisplay((prev) => {
    // Case: Starting fresh (display is "0")
    if (prev === '0') {
      if (val === '.') return '0.';
      if (val === '00') return '0';
      if (val === 'sqrt(') return 'sqrt(';
      if (val === '(') return '(';
      // Replace "0" with "(" or "sqrt(" or "7"
      return val;
    }

    // Case: Implicit Multiplication
    // If last character is a digit and user clicks "(" or "sqrt(", insert "*" automatically
    const lastChar = prev.slice(-1);
    const isLastCharDigit = !isNaN(Number(lastChar)) || lastChar === ')'; 
    if (isLastCharDigit && (val === '(' || val === 'sqrt(')) {
      return prev + '*' + val;
    }

    return prev + val;
  });
};

  const calculate = async () => {
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
    } catch (err) {
      setError("Server Error");
    }
  };

  const CalcButton = ({ label, onClick, variant = "num", icon: Icon, className = "" }: any) => {
    const styles: any = {
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

  return (
    <div className="min-h-screen bg-[#171717] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg bg-[#202124] rounded-3xl shadow-2xl overflow-hidden border border-[#3c4043]">
        <div className="p-8 text-right flex flex-col justify-end min-h-[160px]">
          <div className="text-[#9aa0a6] text-xl font-medium h-8">{expression}</div>
          <div className={`text-6xl font-bold mt-2 truncate ${error ? 'text-red-400 text-2xl' : 'text-[#e8eaed]'}`}>
            {error || display}
          </div>
        </div>

        <div className="p-6 grid grid-cols-6 gap-3 border-t border-[#3c4043] bg-[#28292c]">
          {/* Row 1 */}
          <CalcButton label="7" onClick={() => append('7')} />
          <CalcButton label="8" onClick={() => append('8')} />
          <CalcButton label="9" onClick={() => append('9')} />
          <CalcButton label="×" variant="op" onClick={() => append('*')} />
          <CalcButton label="pow" variant="op" onClick={() => append('^')} />
          <CalcButton icon={Delete} variant="action" onClick={() => setDisplay(d => d.length > 1 ? d.slice(0,-1) : '0')} />

          {/* Row 2 */}
          <CalcButton label="4" onClick={() => append('4')} />
          <CalcButton label="5" onClick={() => append('5')} />
          <CalcButton label="6" onClick={() => append('6')} />
          <CalcButton label="-" variant="op" onClick={() => append('-')} />
          <CalcButton label="√" variant="op" onClick={() => append('sqrt(')} />
          <CalcButton label="AC" variant="action" onClick={() => { setDisplay('0'); setExpression(''); setError(null); }} />

          {/* Row 3 */}
          <CalcButton label="1" onClick={() => append('1')} />
          <CalcButton label="2" onClick={() => append('2')} />
          <CalcButton label="3" onClick={() => append('3')} />
          <CalcButton label="+" variant="op" onClick={() => append('+')} />
          <CalcButton label="%" variant="op" onClick={() => append('/100')} />
          <CalcButton label="(" variant="op" onClick={() => append('(')} />

          {/* Row 4 */}
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