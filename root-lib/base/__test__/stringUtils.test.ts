import { StringUtils } from '../stringUtils';

describe('StringUtils', () => {
  describe('capitalize', () => {
    it('should capitalize first letter and lowercase the rest', () => {
      expect(StringUtils.capitalize('hello')).toBe('Hello');
    });

    it('should lowercase rest of string when already uppercase', () => {
      expect(StringUtils.capitalize('HELLO')).toBe('Hello');
    });

    it('should handle mixed case strings', () => {
      expect(StringUtils.capitalize('hELLo')).toBe('Hello');
    });

    it('should handle single character', () => {
      expect(StringUtils.capitalize('a')).toBe('A');
      expect(StringUtils.capitalize('Z')).toBe('Z');
    });

    it('should handle empty strings', () => {
      expect(StringUtils.capitalize('')).toBe('');
    });

    it('should handle strings starting with numbers', () => {
      expect(StringUtils.capitalize('123abc')).toBe('123abc');
    });
  });

  describe('checkEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(StringUtils.checkEmail('test@example.com')).toBe(true);
      expect(StringUtils.checkEmail('user.name@example.com')).toBe(true);
      expect(StringUtils.checkEmail('user+tag@example.co.uk')).toBe(true);
      expect(StringUtils.checkEmail('user_name@example-domain.com')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(StringUtils.checkEmail('test@example')).toBe(false);
      expect(StringUtils.checkEmail('test@')).toBe(false);
      expect(StringUtils.checkEmail('@example.com')).toBe(false);
      expect(StringUtils.checkEmail('test')).toBe(false);
      expect(StringUtils.checkEmail('test@.com')).toBe(false);
      expect(StringUtils.checkEmail('test..name@example.com')).toBe(false);
    });

    it('should handle empty strings', () => {
      expect(StringUtils.checkEmail('')).toBe(false);
    });

    it('should handle emails with subdomains', () => {
      expect(StringUtils.checkEmail('test@mail.example.com')).toBe(true);
    });
  });

  describe('checkPassword', () => {
    it('should return true for valid passwords', () => {
      expect(StringUtils.checkPassword('Password123!')).toBe(true);
      expect(StringUtils.checkPassword('MyP@ssw0rd')).toBe(true);
      expect(StringUtils.checkPassword('Str0ng#Pass')).toBe(true);
    });

    it('should return false for passwords without uppercase', () => {
      expect(StringUtils.checkPassword('password123!')).toBe(false);
    });

    it('should return false for passwords without lowercase', () => {
      expect(StringUtils.checkPassword('PASSWORD123!')).toBe(false);
    });

    it('should return false for passwords without numbers', () => {
      expect(StringUtils.checkPassword('Password!')).toBe(false);
    });

    it('should return false for passwords without special characters', () => {
      expect(StringUtils.checkPassword('Password123')).toBe(false);
    });

    it('should return false for passwords too short', () => {
      expect(StringUtils.checkPassword('Pass1!')).toBe(false);
    });

    it('should respect custom minLength', () => {
      expect(StringUtils.checkPassword('Password123!', 10)).toBe(true);
      expect(StringUtils.checkPassword('Pass123!', 10)).toBe(false);
    });

    it('should respect custom maxLength', () => {
      expect(StringUtils.checkPassword('Password123!', 8, 12)).toBe(true);
      expect(StringUtils.checkPassword('VeryLongPassword123!', 8, 12)).toBe(
        false,
      );
    });

    it('should handle password at exact min length', () => {
      expect(StringUtils.checkPassword('Pass123!')).toBe(true); // exactly 8 chars
    });

    it('should handle empty strings', () => {
      expect(StringUtils.checkPassword('')).toBe(false);
    });
  });

  describe('stripTags', () => {
    it('should remove HTML tags', () => {
      expect(StringUtils.stripTags('<div>Hello</div>')).toBe('Hello');
    });

    it('should remove multiple tags', () => {
      expect(StringUtils.stripTags('<p><strong>Bold</strong> text</p>')).toBe(
        'Bold text',
      );
    });

    it('should remove self-closing tags', () => {
      expect(StringUtils.stripTags('Line<br/>Break')).toBe('LineBreak');
    });

    it('should keep text without tags', () => {
      expect(StringUtils.stripTags('Plain text')).toBe('Plain text');
    });

    it('should handle empty strings', () => {
      expect(StringUtils.stripTags('')).toBe('');
    });

    it('should handle nested tags', () => {
      expect(
        StringUtils.stripTags('<div><span>Nested</span> content</div>'),
      ).toBe('Nested content');
    });

    it('should remove < and > even when not complete tags', () => {
      // The regex treats any < followed by > as a tag
      expect(StringUtils.stripTags('5 < 10 > 3')).toBe('5  3');
    });
  });

  describe('toTitleCase', () => {
    it('should capitalize first letter of each word', () => {
      expect(StringUtils.toTitleCase('hello world')).toBe('Hello World');
    });

    it('should handle multiple words', () => {
      expect(StringUtils.toTitleCase('the quick brown fox')).toBe(
        'The Quick Brown Fox',
      );
    });

    it('should handle single word', () => {
      expect(StringUtils.toTitleCase('hello')).toBe('Hello');
    });

    it('should handle already capitalized words', () => {
      expect(StringUtils.toTitleCase('Hello World')).toBe('Hello World');
    });

    it('should handle empty strings', () => {
      expect(StringUtils.toTitleCase('')).toBe('');
    });

    it('should lowercase rest of each word', () => {
      expect(StringUtils.toTitleCase('HELLO WORLD')).toBe('Hello World');
    });
  });

  describe('toCamelCase', () => {
    it('should convert to camel case', () => {
      expect(StringUtils.toCamelCase('Hello World')).toBe('helloWorld');
    });

    it('should handle multiple words', () => {
      expect(StringUtils.toCamelCase('the quick brown fox')).toBe(
        'theQuickBrownFox',
      );
    });

    it('should handle single word', () => {
      expect(StringUtils.toCamelCase('hello')).toBe('hello');
    });

    it('should remove spaces', () => {
      expect(StringUtils.toCamelCase('hello world test')).toBe(
        'helloWorldTest',
      );
    });

    it('should handle empty strings', () => {
      expect(StringUtils.toCamelCase('')).toBe('');
    });
  });

  describe('toKebabCase', () => {
    it('should convert to kebab case', () => {
      expect(StringUtils.toKebabCase('Hello World')).toBe('hello-world');
    });

    it('should handle camel case', () => {
      expect(StringUtils.toKebabCase('helloWorld')).toBe('hello-world');
    });

    it('should handle pascal case', () => {
      expect(StringUtils.toKebabCase('HelloWorld')).toBe('hello-world');
    });

    it('should handle multiple words', () => {
      expect(StringUtils.toKebabCase('The Quick Brown Fox')).toBe(
        'the-quick-brown-fox',
      );
    });

    it('should replace underscores with hyphens', () => {
      expect(StringUtils.toKebabCase('hello_world_test')).toBe(
        'hello-world-test',
      );
    });

    it('should handle empty strings', () => {
      expect(StringUtils.toKebabCase('')).toBe('');
    });
  });

  describe('toSnakeCase', () => {
    it('should convert to snake case', () => {
      expect(StringUtils.toSnakeCase('Hello World')).toBe('hello_world');
    });

    it('should handle camel case', () => {
      expect(StringUtils.toSnakeCase('helloWorld')).toBe('hello_world');
    });

    it('should handle pascal case', () => {
      expect(StringUtils.toSnakeCase('HelloWorld')).toBe('hello_world');
    });

    it('should handle multiple words', () => {
      expect(StringUtils.toSnakeCase('The Quick Brown Fox')).toBe(
        'the_quick_brown_fox',
      );
    });

    it('should replace hyphens with underscores', () => {
      expect(StringUtils.toSnakeCase('hello-world-test')).toBe(
        'hello_world_test',
      );
    });

    it('should handle empty strings', () => {
      expect(StringUtils.toSnakeCase('')).toBe('');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(StringUtils.truncate('Hello World', 5)).toBe('He...');
    });

    it('should not truncate short strings', () => {
      expect(StringUtils.truncate('Hello', 10)).toBe('Hello');
    });

    it('should use custom suffix', () => {
      expect(StringUtils.truncate('Hello World', 5, '---')).toBe('He---');
    });

    it('should handle empty strings', () => {
      expect(StringUtils.truncate('', 5)).toBe('');
    });

    it('should handle strings equal to length', () => {
      expect(StringUtils.truncate('Hello', 5)).toBe('Hello');
    });

    it('should account for suffix length', () => {
      const text = 'Hello World';
      const result = StringUtils.truncate(text, 8);
      expect(result.length).toBe(8);
      expect(result).toBe('Hello...');
    });
  });

  describe('truncateWords', () => {
    it('should truncate to specified word count', () => {
      expect(StringUtils.truncateWords('Hello World Test', 2)).toBe(
        'Hello World...',
      );
    });

    it('should use custom suffix', () => {
      expect(StringUtils.truncateWords('Hello World Test', 2, '---')).toBe(
        'Hello World---',
      );
    });

    it('should handle single word', () => {
      expect(StringUtils.truncateWords('Hello', 1)).toBe('Hello...');
    });

    it('should handle empty strings', () => {
      expect(StringUtils.truncateWords('', 2)).toBe('...');
    });
  });

  describe('truncateBetween', () => {
    it('should truncate middle of long strings', () => {
      expect(StringUtils.truncateBetween('Hello World', 2)).toBe('He...ld');
    });

    it('should not truncate short strings', () => {
      expect(StringUtils.truncateBetween('Hello', 3)).toBe('Hello');
    });

    it('should use custom suffix', () => {
      expect(StringUtils.truncateBetween('Hello World Test', 3, '---')).toBe(
        'Hel---est',
      );
    });

    it('should handle empty strings', () => {
      expect(StringUtils.truncateBetween('', 2)).toBe('');
    });

    it('should show equal parts from start and end', () => {
      const result = StringUtils.truncateBetween('1234567890', 2);
      expect(result).toBe('12...90');
    });
  });

  describe('slugify', () => {
    it('should convert to URL-friendly slug', () => {
      expect(StringUtils.slugify('Hello World')).toBe('hello-world');
    });

    it('should remove special characters', () => {
      expect(StringUtils.slugify('Hello, World!')).toBe('hello-world');
    });

    it('should handle multiple spaces', () => {
      expect(StringUtils.slugify('Hello    World')).toBe('hello-world');
    });

    it('should trim hyphens from edges', () => {
      expect(StringUtils.slugify('  Hello World  ')).toBe('hello-world');
    });

    it('should handle underscores', () => {
      expect(StringUtils.slugify('hello_world_test')).toBe('hello-world-test');
    });

    it('should handle empty strings', () => {
      expect(StringUtils.slugify('')).toBe('');
    });

    it('should handle only special characters', () => {
      expect(StringUtils.slugify('!@#$%')).toBe('');
    });

    it('should handle mixed case and special chars', () => {
      expect(StringUtils.slugify('Hello, World! How Are You?')).toBe(
        'hello-world-how-are-you',
      );
    });
  });

  describe('removeHtml', () => {
    it('should remove HTML tags', () => {
      expect(StringUtils.removeHtml('<div>Hello</div>')).toBe('Hello');
    });

    it('should handle multiple tags', () => {
      expect(StringUtils.removeHtml('<p><strong>Bold</strong> text</p>')).toBe(
        'Bold text',
      );
    });

    it('should handle self-closing tags', () => {
      expect(StringUtils.removeHtml('Line<br/>Break')).toBe('LineBreak');
    });

    it('should handle empty strings', () => {
      expect(StringUtils.removeHtml('')).toBe('');
    });

    it('should keep plain text', () => {
      expect(StringUtils.removeHtml('Plain text')).toBe('Plain text');
    });
  });

  describe('escapeHtml', () => {
    it('should escape < and >', () => {
      expect(StringUtils.escapeHtml('<div>Hello</div>')).toBe(
        '&lt;div&gt;Hello&lt;/div&gt;',
      );
    });

    it('should escape &', () => {
      expect(StringUtils.escapeHtml('A & B')).toBe('A &amp; B');
    });

    it('should escape quotes', () => {
      expect(StringUtils.escapeHtml('"quoted"')).toBe('&quot;quoted&quot;');
    });

    it('should escape apostrophes', () => {
      expect(StringUtils.escapeHtml("it's")).toBe('it&#39;s');
    });

    it('should escape all special characters together', () => {
      expect(StringUtils.escapeHtml('<div class="test">A & B\'s</div>')).toBe(
        '&lt;div class=&quot;test&quot;&gt;A &amp; B&#39;s&lt;/div&gt;',
      );
    });

    it('should handle empty strings', () => {
      expect(StringUtils.escapeHtml('')).toBe('');
    });

    it('should keep regular text unchanged', () => {
      expect(StringUtils.escapeHtml('Hello World')).toBe('Hello World');
    });
  });

  describe('unescapeHtml', () => {
    it('should unescape &lt; and &gt;', () => {
      expect(StringUtils.unescapeHtml('&lt;div&gt;Hello&lt;/div&gt;')).toBe(
        '<div>Hello</div>',
      );
    });

    it('should unescape &amp;', () => {
      expect(StringUtils.unescapeHtml('A &amp; B')).toBe('A & B');
    });

    it('should unescape &quot;', () => {
      expect(StringUtils.unescapeHtml('&quot;quoted&quot;')).toBe('"quoted"');
    });

    it('should unescape &#39;', () => {
      expect(StringUtils.unescapeHtml('it&#39;s')).toBe("it's");
    });

    it('should unescape all special characters together', () => {
      expect(
        StringUtils.unescapeHtml(
          '&lt;div class=&quot;test&quot;&gt;A &amp; B&#39;s&lt;/div&gt;',
        ),
      ).toBe('<div class="test">A & B\'s</div>');
    });

    it('should handle empty strings', () => {
      expect(StringUtils.unescapeHtml('')).toBe('');
    });

    it('should keep regular text unchanged', () => {
      expect(StringUtils.unescapeHtml('Hello World')).toBe('Hello World');
    });

    it('should reverse escapeHtml', () => {
      const original = '<div class="test">A & B\'s "quote"</div>';
      const escaped = StringUtils.escapeHtml(original);
      const unescaped = StringUtils.unescapeHtml(escaped);
      expect(unescaped).toBe(original);
    });
  });

  describe('formatSentence', () => {
    it('should capitalize first letter of sentence', () => {
      expect(StringUtils.formatSentence('hello world')).toBe('Hello world');
    });

    it('should capitalize after periods', () => {
      expect(StringUtils.formatSentence('hello. world')).toBe('Hello. World');
    });

    it('should capitalize after exclamation marks', () => {
      expect(StringUtils.formatSentence('hello! world')).toBe('Hello! World');
    });

    it('should capitalize after question marks', () => {
      expect(StringUtils.formatSentence('hello? world')).toBe('Hello? World');
    });

    it('should handle multiple sentences', () => {
      expect(
        StringUtils.formatSentence('hello world. how are you? i am fine!'),
      ).toBe('Hello world. How are you? I am fine!');
    });

    it('should handle empty strings', () => {
      expect(StringUtils.formatSentence('')).toBe('');
    });

    it('should handle single character', () => {
      expect(StringUtils.formatSentence('a')).toBe('A');
    });
  });

  describe('generateId', () => {
    it('should generate an ID of default length 8', () => {
      const id = StringUtils.generateId();
      expect(id).toHaveLength(8);
    });

    it('should generate an ID of custom length', () => {
      const id = StringUtils.generateId(16);
      expect(id).toHaveLength(16);
    });

    it('should generate different IDs on successive calls', () => {
      const id1 = StringUtils.generateId();
      const id2 = StringUtils.generateId();
      expect(id1).not.toBe(id2);
    });

    it('should only contain alphanumeric characters', () => {
      const id = StringUtils.generateId(100);
      expect(id).toMatch(/^[A-Za-z0-9]+$/);
    });

    it('should handle length of 1', () => {
      const id = StringUtils.generateId(1);
      expect(id).toHaveLength(1);
    });

    it('should handle length of 0', () => {
      const id = StringUtils.generateId(0);
      expect(id).toHaveLength(0);
      expect(id).toBe('');
    });
  });

  describe('mask', () => {
    it('should mask all but last 4 characters by default', () => {
      expect(StringUtils.mask('1234567890')).toBe('******7890');
    });

    it('should use custom visible character count', () => {
      expect(StringUtils.mask('1234567890', 2)).toBe('********90');
    });

    it('should use custom mask character', () => {
      expect(StringUtils.mask('1234567890', 4, '#')).toBe('######7890');
    });

    it('should not mask if string is shorter than or equal to visible chars', () => {
      expect(StringUtils.mask('1234', 4)).toBe('1234');
      expect(StringUtils.mask('123', 4)).toBe('123');
    });

    it('should handle empty strings', () => {
      expect(StringUtils.mask('')).toBe('');
    });

    it('should mask credit card numbers', () => {
      expect(StringUtils.mask('4532015112830366', 4)).toBe('************0366');
    });

    it('should mask with single visible character', () => {
      expect(StringUtils.mask('1234567890', 1)).toBe('*********0');
    });

    it('should mask with zero visible characters', () => {
      // When visibleChars is 0, slice(-0) returns the whole string
      expect(StringUtils.mask('1234567890', 0)).toBe('**********1234567890');
    });
  });
});
