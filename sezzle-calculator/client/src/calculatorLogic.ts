export const getNewDisplay = (current: string, val: string, hasResult: boolean): string => {
  if (hasResult) {
    if (!isNaN(Number(val)) || val === '00' || val === '.') return val === '00' ? '0' : val;
    const needsMult = (val === '(' || val === 'sqrt(');
    return current + (needsMult ? '*' : '') + val;
  }

  if (current === '0') {
    if (val === '.') return '0.';
    if (val === '00') return '0';
    return val;
  }

  const lastChar = current.slice(-1);
  const isLastCharDigit = !isNaN(Number(lastChar)) || lastChar === ')'; 
  if (isLastCharDigit && (val === '(' || val === 'sqrt(')) {
    return current + '*' + val;
  }

  return current + val;
};