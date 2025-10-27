import ObjectUtils from '../objectUtils';

describe('ObjectUtils', () => {
  describe('keysToString', () => {
    it('should convert object keys with truthy values to string', () => {
      const obj = { header: true, blue: 3, warning: false };
      expect(ObjectUtils.keysToString(obj)).toBe('header blue');
    });

    it('should handle empty objects', () => {
      expect(ObjectUtils.keysToString({})).toBe('');
    });

    it('should handle objects with all falsy values', () => {
      const obj = { a: false, b: 0, c: null, d: undefined };
      expect(ObjectUtils.keysToString(obj)).toBe('');
    });

    it('should add prefix to keys', () => {
      const obj = { header: true, blue: true };
      const result = ObjectUtils.keysToString(obj, { prefix: 'pre_' });
      expect(result).toBe('pre_header pre_blue');
    });

    it('should add suffix to keys', () => {
      const obj = { header: true, blue: true };
      const result = ObjectUtils.keysToString(obj, { suffix: '_suf' });
      expect(result).toBe('header_suf blue_suf');
    });

    it('should add both prefix and suffix', () => {
      const obj = { header: true, blue: true };
      const result = ObjectUtils.keysToString(obj, {
        prefix: 'pre_',
        suffix: '_suf',
      });
      expect(result).toBe('pre_header_suf pre_blue_suf');
    });

    it('should skip keys with falsy values', () => {
      const obj = { a: true, b: false, c: true, d: 0 };
      expect(ObjectUtils.keysToString(obj)).toBe('a c');
    });

    it('should handle single key object', () => {
      expect(ObjectUtils.keysToString({ single: true })).toBe('single');
    });
  });

  describe('displayValue', () => {
    it('should display string values', () => {
      const item = { name: 'Alice' };
      expect(ObjectUtils.displayValue(item, 'name')).toBe('Alice');
    });

    it('should display number values', () => {
      const item = { age: 30 };
      expect(ObjectUtils.displayValue(item, 'age')).toBe(30);
    });

    it('should display "yes" for true boolean', () => {
      const item = { active: true };
      expect(ObjectUtils.displayValue(item, 'active')).toBe('yes');
    });

    it('should display "no" for false boolean', () => {
      const item = { active: false };
      expect(ObjectUtils.displayValue(item, 'active')).toBe('no');
    });

    it('should return empty string for non-existent keys', () => {
      const item = { name: 'Alice' };
      expect(ObjectUtils.displayValue(item, 'age')).toBe('');
    });

    it('should return empty string for object values', () => {
      const item = { data: { nested: 'value' } };
      expect(ObjectUtils.displayValue(item, 'data')).toBe('');
    });

    it('should return empty string for array values', () => {
      const item = { items: [1, 2, 3] };
      expect(ObjectUtils.displayValue(item, 'items')).toBe('');
    });

    it('should handle zero as a number value', () => {
      const item = { count: 0 };
      expect(ObjectUtils.displayValue(item, 'count')).toBe(0);
    });

    it('should handle empty string', () => {
      const item = { text: '' };
      expect(ObjectUtils.displayValue(item, 'text')).toBe('');
    });
  });

  describe('pick', () => {
    it('should pick specified keys from object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = ObjectUtils.pick(obj, ['a', 'c']);
      expect(result).toEqual({ a: 1, c: 3 });
    });

    it('should handle empty keys array', () => {
      const obj = { a: 1, b: 2 };
      const result = ObjectUtils.pick(obj, []);
      expect(result).toEqual({});
    });

    it('should handle non-existent keys gracefully', () => {
      const obj = { a: 1, b: 2 };
      const result = ObjectUtils.pick(obj, ['a', 'c' as keyof typeof obj]);
      expect(result).toEqual({ a: 1 });
    });

    it('should handle empty objects', () => {
      const obj = {};
      const result = ObjectUtils.pick(obj, []);
      expect(result).toEqual({});
    });

    it('should pick single key', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = ObjectUtils.pick(obj, ['b']);
      expect(result).toEqual({ b: 2 });
    });

    it('should handle objects with various value types', () => {
      const obj = { a: 1, b: 'string', c: true, d: null, e: undefined };
      const result = ObjectUtils.pick(obj, ['a', 'b', 'c', 'd']);
      expect(result).toEqual({ a: 1, b: 'string', c: true, d: null });
    });

    it('should not mutate original object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const original = { ...obj };
      ObjectUtils.pick(obj, ['a']);
      expect(obj).toEqual(original);
    });
  });

  describe('mergeDeepPartial', () => {
    it('should merge two flat objects', () => {
      const target = { a: 1, b: 2 };
      const modifier = { c: 3 };
      const result = ObjectUtils.mergeDeepPartial(target, modifier);
      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should override values in target', () => {
      const target = { a: 1, b: 2 };
      const modifier = { a: 3, c: 4 };
      const result = ObjectUtils.mergeDeepPartial(target, modifier);
      expect(result).toEqual({ a: 3, b: 2, c: 4 });
    });

    it('should merge nested objects deeply', () => {
      const target = { foo: { bar: 1, baz: 2 } };
      const modifier = { foo: { bar: 3 } };
      const result = ObjectUtils.mergeDeepPartial(target, modifier);
      expect(result).toEqual({ foo: { bar: 3, baz: 2 } });
    });

    it('should handle arrays by replacing them', () => {
      const target = { arr: [1, 2] };
      const modifier = { arr: [3] };
      const result = ObjectUtils.mergeDeepPartial(target, modifier);
      expect(result).toEqual({ arr: [3] });
    });

    it('should merge multiple modifiers in order', () => {
      const target = { a: 1, b: 2 };
      const modifier1 = { a: 3, c: 4 };
      const modifier2 = { a: 5, d: 6 };
      const result = ObjectUtils.mergeDeepPartial(target, modifier1, modifier2);
      expect(result).toEqual({ a: 5, b: 2, c: 4, d: 6 });
    });

    it('should handle empty modifiers', () => {
      const target = { a: 1, b: 2 };
      const result = ObjectUtils.mergeDeepPartial(target);
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should skip undefined values', () => {
      const target = { a: 0, b: 2 };
      const modifier = { a: undefined, c: 3 };
      const result = ObjectUtils.mergeDeepPartial(target, modifier);
      expect(result).toEqual({ a: 0, b: 2, c: 3 });
    });

    it('should handle deeply nested objects', () => {
      const target = { a: { b: { c: 1, d: 2 } } };
      const modifier = { a: { b: { c: 3 } } };
      const result = ObjectUtils.mergeDeepPartial(target, modifier);
      expect(result).toEqual({ a: { b: { c: 3, d: 2 } } });
    });

    it('should not mutate the original target', () => {
      const target = { a: 1, b: 2 };
      const modifier = { c: 3 };
      const original = JSON.parse(JSON.stringify(target));
      ObjectUtils.mergeDeepPartial(target, modifier);
      expect(target).toEqual(original);
    });

    it('should handle null values', () => {
      const target = { a: 1, b: 2 };
      const modifier = { a: null };
      const result = ObjectUtils.mergeDeepPartial(target, modifier);
      expect(result).toEqual({ a: null, b: 2 });
    });

    it('should replace nested object when modifier has non-object value', () => {
      const target = { a: { b: 1 } };
      const modifier = { a: 'string' };
      const result = ObjectUtils.mergeDeepPartial(target, modifier);
      expect(result).toEqual({ a: 'string' });
    });

    it('should handle boolean values', () => {
      const target = { a: false };
      const modifier = { a: true };
      const result = ObjectUtils.mergeDeepPartial(target, modifier);
      expect(result).toEqual({ a: true });
    });

    it('should handle zero values', () => {
      const target = { a: 1 };
      const modifier = { a: 0 };
      const result = ObjectUtils.mergeDeepPartial(target, modifier);
      expect(result).toEqual({ a: 0 });
    });

    it('should handle empty string values', () => {
      const target = { a: 'hello' };
      const modifier = { a: '' };
      const result = ObjectUtils.mergeDeepPartial(target, modifier);
      expect(result).toEqual({ a: '' });
    });

    it('should merge complex nested structures', () => {
      const target = {
        user: {
          name: 'John',
          address: {
            street: '123 Main St',
            city: 'Boston',
            zip: '02101',
          },
          preferences: {
            theme: 'dark',
            notifications: true,
          },
        },
      };

      const modifier = {
        user: {
          address: {
            city: 'Cambridge',
          },
          preferences: {
            notifications: false,
          },
        },
      };

      const result = ObjectUtils.mergeDeepPartial(target, modifier);

      expect(result).toEqual({
        user: {
          name: 'John',
          address: {
            street: '123 Main St',
            city: 'Cambridge',
            zip: '02101',
          },
          preferences: {
            theme: 'dark',
            notifications: false,
          },
        },
      });
    });
  });
});
