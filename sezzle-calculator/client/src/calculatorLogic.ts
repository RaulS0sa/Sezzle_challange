export const getNewDisplay = (current: string, val: string, hasResult: boolean): string => {
  // 1. Handle state after a result was just calculated
  if (hasResult) {
    if (!isNaN(Number(val)) || val === '00' || val === '.') {
      return val === '00' ? '0' : val;
    } else {
      // Continuing the calculation using the result
      if (current === '0' && (val === '(' || val === 'sqrt(')) {
        return val;
      }
      if (val === '(' || val === 'sqrt(') {
        return current + '*' + val;
      }
      return current + val;
    }
  }

  // 2. Handle standard input
  if (current === '0') {
    if (val === '.') return '0.';
    if (val === '00') return '0';
    if (val === 'sqrt(') return 'sqrt(';
    if (val === '(') return '(';
    return val;
  }

  // Implicit Multiplication check
  const lastChar = current.slice(-1);
  const isLastCharDigit = !isNaN(Number(lastChar)) || lastChar === ')'; 
  if (isLastCharDigit && (val === '(' || val === 'sqrt(')) {
    return current + '*' + val;
  }

  return current + val;
};