import { describe, expect, test } from '@jest/globals';
import GenericType from '../../src/line-type/generic-type';
import LineTag from '../../src/line-type/tags/line-tag';

describe('generic log line type', () => {
  test("has generic tag", () => {
    expect(GenericType.getTags()).toEqual(expect.arrayContaining([LineTag.generic]));
  });
  test("doesn't detect positively", () => {
    const testLogEntries = [
      { "lang": "de", "entry": "Rohrfliege (2683217, Pegasus) von Systemlord Apophis (75604) ist in Sektor 123|456 eingeflogen" },
      { "lang": "de", "entry": "H|K ~KS~ Wrong Way (2563440, Atel) hat im Sektor 123|456 die Systemblockade aufgegeben" },
      { "lang": "en", "entry": "IMoovStufToo (1593773, Silverstar) von Loki (83929) has entered sector 999|999" },
      { "lang": "en", "entry": "IMoovStufToo (1593773, Silverstar) beams goods in sector 111|111 to {=BSC=} Morning Glory (1590093, Large Subspace Gate): Antimatter: 737. Isolinear Chips: 883. Tritanium: 97. Sorium: 1532." },
    ];
    testLogEntries.forEach(entry => {
      expect(GenericType.detect(entry.entry, entry.lang)).toBe(false);
    });

  });
})