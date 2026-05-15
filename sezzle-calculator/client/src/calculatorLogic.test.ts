import { describe, it, expect } from 'vitest';
import { getNewDisplay } from './calculatorLogic';

describe('Calculator Logic', () => {
  it('should replace 0 with a number', () => {
    expect(getNewDisplay('0', '5', false)).toBe('5');
  });

  it('should add implicit multiplication before sqrt', () => {
    expect(getNewDisplay('4', 'sqrt(', false)).toBe('4*sqrt(');
  });

  it('should handle percentage correctly as string', () => {
    expect(getNewDisplay('50', '/100', false)).toBe('50/100');
  });

  it('should start a new calculation if a number is pressed after result', () => {
    expect(getNewDisplay('100', '5', true)).toBe('5');
  });
});
