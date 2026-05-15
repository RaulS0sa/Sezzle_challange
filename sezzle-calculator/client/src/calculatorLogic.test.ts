import { describe, it, expect } from 'vitest';
import { getNewDisplay } from './calculatorLogic';

describe('Calculator Logic', () => {
  it('should replace 0 with sqrt( instead of multiplying it', () => {
    expect(getNewDisplay('0', 'sqrt(', false)).toBe('sqrt(');
  });

  it('should handle implicit multiplication after a result', () => {
    expect(getNewDisplay('10', '(', true)).toBe('10*(');
  });

  it('should start fresh if a number follows a result', () => {
    expect(getNewDisplay('10', '5', true)).toBe('5');
  });

  it('should append /100 when percentage is clicked', () => {
    expect(getNewDisplay('50', '/100', false)).toBe('50/100');
  });
});