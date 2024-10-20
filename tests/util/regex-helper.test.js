import { describe, expect, test } from '@jest/globals';
import { addSubroutines } from '../../src/util/regex-helper';
import { pattern } from 'regex';

describe('regex helper', () => {
  // addSubroutines
  test("simple subroutine test", () => {
    // taken from subroutine example from regex library readme:
    // https://github.com/slevithan/regex/blob/9e1c194db713d515c9cb3cf9f5deb41dfd61ad57/README.md
    const expression = pattern`
    ^ Admitted:\ (?<admitted> \g<date>) \n
    Released:\ (?<released> \g<date>) $
    `
    
    const regexWithDefinitions = addSubroutines(expression, {
      "date": pattern`\g<year>-\g<month>-\g<day>`,
      "year": pattern`\d{4}`,
      "month": pattern`\d{2}`,
      "day": pattern`\d{2}`,
    });

    const text = "Admitted: 2022-03-15\nReleased: 2024-12-20";
    const match = text.match(regexWithDefinitions);
    expect(match).not.toBeNull();
    expect(match.groups).not.toBeNull();
    expect(match.groups.admitted).toBe("2022-03-15");
    expect(match.groups.released).toBe("2024-12-20");
  });
});