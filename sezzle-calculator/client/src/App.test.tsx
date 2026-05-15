import { describe, it, expect } from 'vitest';

// Simulating the append logic to verify "Smart Input"
const simulateAppend = (current: string, val: string, hasResult: boolean) => {
  if (hasResult) {
    if (!isNaN(Number(val)) || val === '00' || val === '.') return val;
    return current + (val === '(' || val === 'sqrt(' ? '*' : '') + val;
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

describe('Calculator Frontend Logic', () => {
  it('should replace 0 with the first number pressed', () => {
    expect(simulateAppend('0', '7', false)).toBe('7');
  });

  it('should add implicit multiplication before parentheses', () => {
    expect(simulateAppend('5', '(', false)).toBe('5*(');
  });

  it('should not add extra zeros if current is 0', () => {
    expect(simulateAppend('0', '00', false)).toBe('0');
  });

  it('should handle sqrt after a number with implicit multiplication', () => {
    expect(simulateAppend('16', 'sqrt(', false)).toBe('16*sqrt(');
  });
});