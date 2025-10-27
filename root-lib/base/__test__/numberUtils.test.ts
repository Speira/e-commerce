import { NumberUtils } from '../numberUtils';

describe('NumberUtils', () => {
  describe('formatPrice', () => {
    it('should format a number as USD currency by default', () => {
      expect(NumberUtils.formatPrice(100)).toBe('$100.00');
    });

    it('should format a number with decimals correctly', () => {
      expect(NumberUtils.formatPrice(100.5)).toBe('$100.50');
      expect(NumberUtils.formatPrice(100.99)).toBe('$100.99');
    });

    it('should format a number as EUR currency when specified', () => {
      expect(NumberUtils.formatPrice(100, 'EUR', 'en-US')).toBe('€100.00');
    });

    it('should format a number with German locale', () => {
      // German locale uses non-breaking space before €
      const result = NumberUtils.formatPrice(1000.5, 'EUR', 'de-DE');
      expect(result).toContain('1.000,50');
      expect(result).toContain('€');
    });

    it('should handle zero correctly', () => {
      expect(NumberUtils.formatPrice(0)).toBe('$0.00');
    });

    it('should handle negative numbers', () => {
      expect(NumberUtils.formatPrice(-100)).toBe('-$100.00');
    });

    it('should handle large numbers', () => {
      expect(NumberUtils.formatPrice(1000000)).toBe('$1,000,000.00');
    });
  });

  describe('toIntPrice', () => {
    it('should convert a price to integer cents', () => {
      expect(NumberUtils.toIntPrice(100)).toBe(10000);
    });

    it('should round to nearest cent', () => {
      expect(NumberUtils.toIntPrice(100.123456)).toBe(10012);
    });

    it('should handle zero', () => {
      expect(NumberUtils.toIntPrice(0)).toBe(0);
    });

    it('should handle decimal values', () => {
      expect(NumberUtils.toIntPrice(1.5)).toBe(150);
      expect(NumberUtils.toIntPrice(1.99)).toBe(199);
    });

    it('should handle negative values', () => {
      expect(NumberUtils.toIntPrice(-10.5)).toBe(-1050);
    });

    it('should handle very small decimals', () => {
      expect(NumberUtils.toIntPrice(0.01)).toBe(1);
      expect(NumberUtils.toIntPrice(0.005)).toBe(1);
    });
  });

  describe('toFloatPrice', () => {
    it('should convert integer cents to float price', () => {
      expect(NumberUtils.toFloatPrice(10000)).toBe(100);
    });

    it('should handle zero', () => {
      expect(NumberUtils.toFloatPrice(0)).toBe(0);
    });

    it('should handle small values', () => {
      expect(NumberUtils.toFloatPrice(1)).toBe(0.01);
      expect(NumberUtils.toFloatPrice(50)).toBe(0.5);
    });

    it('should handle negative values', () => {
      expect(NumberUtils.toFloatPrice(-10000)).toBe(-100);
    });

    it('should correctly reverse toIntPrice', () => {
      const original = 123.45;
      const intPrice = NumberUtils.toIntPrice(original);
      const floatPrice = NumberUtils.toFloatPrice(intPrice);
      expect(floatPrice).toBeCloseTo(original, 2);
    });
  });

  describe('formatNumber', () => {
    it('should format a number with default locale', () => {
      expect(NumberUtils.formatNumber(1000)).toBe('1,000');
    });

    it('should format a number with German locale', () => {
      expect(NumberUtils.formatNumber(1000, 'de-DE')).toBe('1.000');
    });

    it('should handle decimals', () => {
      expect(NumberUtils.formatNumber(1000.5)).toBe('1,000.5');
    });

    it('should handle zero', () => {
      expect(NumberUtils.formatNumber(0)).toBe('0');
    });

    it('should handle negative numbers', () => {
      expect(NumberUtils.formatNumber(-1000)).toBe('-1,000');
    });

    it('should handle very large numbers', () => {
      expect(NumberUtils.formatNumber(1000000000)).toBe('1,000,000,000');
    });
  });

  describe('formatPercent', () => {
    it('should format a number as percentage', () => {
      expect(NumberUtils.formatPercent(50)).toBe('50%');
    });

    it('should handle 100%', () => {
      expect(NumberUtils.formatPercent(100)).toBe('100%');
    });

    it('should handle 0%', () => {
      expect(NumberUtils.formatPercent(0)).toBe('0%');
    });

    it('should handle decimals', () => {
      expect(NumberUtils.formatPercent(50.5)).toBe('50.5%');
      expect(NumberUtils.formatPercent(50.123)).toBe('50.12%');
    });

    it('should handle negative percentages', () => {
      expect(NumberUtils.formatPercent(-10)).toBe('-10%');
    });

    it('should format with German locale', () => {
      // German locale uses non-breaking space before %
      const result = NumberUtils.formatPercent(50.5, 'de-DE');
      expect(result).toContain('50,5');
      expect(result).toContain('%');
    });
  });

  describe('round', () => {
    it('should round to 2 decimal places by default', () => {
      expect(NumberUtils.round(100.123456)).toBe(100.12);
    });

    it('should round up correctly', () => {
      expect(NumberUtils.round(100.126)).toBe(100.13);
    });

    it('should round to specified decimal places', () => {
      expect(NumberUtils.round(100.123456, 0)).toBe(100);
      expect(NumberUtils.round(100.123456, 1)).toBe(100.1);
      expect(NumberUtils.round(100.123456, 3)).toBe(100.123);
      expect(NumberUtils.round(100.123456, 4)).toBe(100.1235);
    });

    it('should handle negative numbers', () => {
      expect(NumberUtils.round(-100.126)).toBe(-100.13);
    });

    it('should handle zero', () => {
      expect(NumberUtils.round(0)).toBe(0);
    });

    it('should handle whole numbers', () => {
      expect(NumberUtils.round(100)).toBe(100);
    });
  });

  describe('clamp', () => {
    it('should return value when within range', () => {
      expect(NumberUtils.clamp(50, 0, 100)).toBe(50);
    });

    it('should return min when value is below min', () => {
      expect(NumberUtils.clamp(-10, 0, 100)).toBe(0);
    });

    it('should return max when value is above max', () => {
      expect(NumberUtils.clamp(110, 0, 100)).toBe(100);
    });

    it('should handle value equal to min', () => {
      expect(NumberUtils.clamp(0, 0, 100)).toBe(0);
    });

    it('should handle value equal to max', () => {
      expect(NumberUtils.clamp(100, 0, 100)).toBe(100);
    });

    it('should handle negative ranges', () => {
      expect(NumberUtils.clamp(-50, -100, -10)).toBe(-50);
      expect(NumberUtils.clamp(-150, -100, -10)).toBe(-100);
      expect(NumberUtils.clamp(-5, -100, -10)).toBe(-10);
    });

    it('should handle decimal values', () => {
      expect(NumberUtils.clamp(5.5, 0, 10)).toBe(5.5);
      expect(NumberUtils.clamp(10.5, 0, 10)).toBe(10);
    });
  });

  describe('random', () => {
    it('should generate a number between min and max', () => {
      for (let i = 0; i < 100; i++) {
        const result = NumberUtils.random(0, 100);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(100);
      }
    });

    it('should handle negative ranges', () => {
      for (let i = 0; i < 100; i++) {
        const result = NumberUtils.random(-100, -10);
        expect(result).toBeGreaterThanOrEqual(-100);
        expect(result).toBeLessThanOrEqual(-10);
      }
    });

    it('should handle decimal ranges', () => {
      for (let i = 0; i < 100; i++) {
        const result = NumberUtils.random(0.5, 1.5);
        expect(result).toBeGreaterThanOrEqual(0.5);
        expect(result).toBeLessThanOrEqual(1.5);
      }
    });
  });

  describe('randomInt', () => {
    it('should generate an integer between min and max inclusive', () => {
      for (let i = 0; i < 100; i++) {
        const result = NumberUtils.randomInt(0, 10);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(10);
        expect(Number.isInteger(result)).toBe(true);
      }
    });

    it('should include both min and max values', () => {
      const results = new Set();
      for (let i = 0; i < 1000; i++) {
        results.add(NumberUtils.randomInt(0, 1));
      }
      expect(results.has(0)).toBe(true);
      expect(results.has(1)).toBe(true);
    });

    it('should handle negative ranges', () => {
      for (let i = 0; i < 100; i++) {
        const result = NumberUtils.randomInt(-10, -5);
        expect(result).toBeGreaterThanOrEqual(-10);
        expect(result).toBeLessThanOrEqual(-5);
        expect(Number.isInteger(result)).toBe(true);
      }
    });

    it('should return same value when min equals max', () => {
      expect(NumberUtils.randomInt(5, 5)).toBe(5);
    });
  });

  describe('checkIsEven', () => {
    it('should return true for even numbers', () => {
      expect(NumberUtils.checkIsEven(0)).toBe(true);
      expect(NumberUtils.checkIsEven(2)).toBe(true);
      expect(NumberUtils.checkIsEven(100)).toBe(true);
      expect(NumberUtils.checkIsEven(-2)).toBe(true);
      expect(NumberUtils.checkIsEven(-100)).toBe(true);
    });

    it('should return false for odd numbers', () => {
      expect(NumberUtils.checkIsEven(1)).toBe(false);
      expect(NumberUtils.checkIsEven(3)).toBe(false);
      expect(NumberUtils.checkIsEven(99)).toBe(false);
      expect(NumberUtils.checkIsEven(-1)).toBe(false);
      expect(NumberUtils.checkIsEven(-99)).toBe(false);
    });
  });

  describe('checkIsOdd', () => {
    it('should return true for odd numbers', () => {
      expect(NumberUtils.checkIsOdd(1)).toBe(true);
      expect(NumberUtils.checkIsOdd(3)).toBe(true);
      expect(NumberUtils.checkIsOdd(99)).toBe(true);
      expect(NumberUtils.checkIsOdd(-1)).toBe(true);
      expect(NumberUtils.checkIsOdd(-99)).toBe(true);
    });

    it('should return false for even numbers', () => {
      expect(NumberUtils.checkIsOdd(0)).toBe(false);
      expect(NumberUtils.checkIsOdd(2)).toBe(false);
      expect(NumberUtils.checkIsOdd(100)).toBe(false);
      expect(NumberUtils.checkIsOdd(-2)).toBe(false);
      expect(NumberUtils.checkIsOdd(-100)).toBe(false);
    });
  });

  describe('factorial', () => {
    it('should return 1 for 0 and 1', () => {
      expect(NumberUtils.factorial(0)).toBe(1);
      expect(NumberUtils.factorial(1)).toBe(1);
    });

    it('should calculate factorial correctly', () => {
      expect(NumberUtils.factorial(5)).toBe(120);
      expect(NumberUtils.factorial(3)).toBe(6);
      expect(NumberUtils.factorial(4)).toBe(24);
      expect(NumberUtils.factorial(6)).toBe(720);
    });

    it('should return NaN for negative numbers', () => {
      expect(NumberUtils.factorial(-1)).toBe(NaN);
      expect(NumberUtils.factorial(-5)).toBe(NaN);
    });

    it('should handle larger numbers', () => {
      expect(NumberUtils.factorial(10)).toBe(3628800);
    });
  });

  describe('fibonacci', () => {
    it('should return 0 for fibonacci(0)', () => {
      expect(NumberUtils.fibonacci(0)).toBe(0);
    });

    it('should return 1 for fibonacci(1)', () => {
      expect(NumberUtils.fibonacci(1)).toBe(1);
    });

    it('should calculate fibonacci sequence correctly', () => {
      expect(NumberUtils.fibonacci(2)).toBe(1);
      expect(NumberUtils.fibonacci(3)).toBe(2);
      expect(NumberUtils.fibonacci(4)).toBe(3);
      expect(NumberUtils.fibonacci(5)).toBe(5);
      expect(NumberUtils.fibonacci(6)).toBe(8);
      expect(NumberUtils.fibonacci(7)).toBe(13);
      expect(NumberUtils.fibonacci(10)).toBe(55);
    });

    it('should return NaN for negative numbers', () => {
      expect(NumberUtils.fibonacci(-1)).toBe(NaN);
      expect(NumberUtils.fibonacci(-5)).toBe(NaN);
    });
  });
});
