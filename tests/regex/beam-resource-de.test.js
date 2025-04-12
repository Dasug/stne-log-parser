import { describe, expect, test } from '@jest/globals';
import BeamResource from '../../src/enum/beam-resource.js';
import Resource from '../../src/enum/resource.js';
import BeamResourceDe from '../../src/regex/subroutine/beam-resource-de.js';

describe('german language beam resource regex', () => {
  test("test all resources with random amounts", () => {
    const max = Number.MAX_SAFE_INTEGER;
    const resources = [
      ['Crew', BeamResource.crew, Math.floor(Math.random() * max)],
      ['Warpkern', BeamResource.warpCore, Math.random()],
      ['Nahrung', BeamResource.food, Math.floor(Math.random() * max)],
      ['Baumaterial', BeamResource.plasteel, Math.floor(Math.random() * max)],
      ['Iridium-Erz', BeamResource.iridiumOre, Math.floor(Math.random() * max)],
      ['Duranium', BeamResource.duranium, Math.floor(Math.random() * max)],
      ['Deuterium', BeamResource.deuterium, Math.floor(Math.random() * max)],
      ['Antimaterie', BeamResource.antimatter, Math.floor(Math.random() * max)],
      ['Photonentorpedos', BeamResource.photonTorpedoes, Math.floor(Math.random() * max)],
      ['Iso-Chips', BeamResource.isoChips, Math.floor(Math.random() * max)],
      ['Rettungskapseln', BeamResource.escapePods, Math.floor(Math.random() * max)],
      ['Dilithium', BeamResource.dilithium, Math.floor(Math.random() * max)],
      ['Artefakte', BeamResource.unknown, Math.floor(Math.random() * max)],
      ['Tritanium', BeamResource.tritanium, Math.floor(Math.random() * max)],
      ['Sorium', BeamResource.sorium, Math.floor(Math.random() * max)],
      ['Nitrium', BeamResource.nitrium, Math.floor(Math.random() * max)],
      ['Latinum', BeamResource.latinum, Math.floor(Math.random() * max)],
      ['Antiprotonen-Phalanx', BeamResource.unknown, Math.floor(Math.random() * max)],
      ['Plasma', BeamResource.plasma, Math.floor(Math.random() * max)],
      ['Plasmatorpedos', BeamResource.plasmaTorpedoes, Math.floor(Math.random() * max)],
      ['Quantentorpedos', BeamResource.quantumTorpedoes, Math.floor(Math.random() * max)],
      ['Ketracel White', BeamResource.ketracelWhite, Math.floor(Math.random() * max)],
      ['Blutwein', BeamResource.bloodWine, Math.floor(Math.random() * max)],
      ['Romulanisches Ale', BeamResource.romulanAle, Math.floor(Math.random() * max)],
      ['Rohrlarven', BeamResource.tubeGrubs, Math.floor(Math.random() * max)],
      ['Vinculum', BeamResource.vinculum, Math.floor(Math.random() * max)],
      ['Taspar-Eier', BeamResource.tasparEggs, Math.floor(Math.random() * max)],
      ['Tribbels', BeamResource.tribbles, Math.floor(Math.random() * max)],
      ['Earl Grey', BeamResource.earlGrey, Math.floor(Math.random() * max)],
      ['Schmuggelgüter', BeamResource.contrabands, Math.floor(Math.random() * max)],
      ['Geschenke', BeamResource.gifts, Math.floor(Math.random() * max)],
      ['Credits', BeamResource.credits, Math.floor(Math.random() * max)],
      ['Polarontorpedo', BeamResource.polaronTorpedoes, Math.floor(Math.random() * max)],
      ['Nemesistorpedo', BeamResource.nemesisTorpedoes, Math.floor(Math.random() * max)],
      ['EMP-Torpedo', BeamResource.empTorpedoes, Math.floor(Math.random() * max)],
      ['Baupläne', BeamResource.unknown, Math.floor(Math.random() * max)],
      ['Larne', BeamResource.larne, Math.random()],
    ];
    
    resources.forEach(resource => {
      const matches = BeamResourceDe.matchResult(resource[0] + ": " + resource[2].toString().replaceAll(".", ",") + ".");
      expect(matches).not.toBeNull();
      expect(matches.resource).toBe(resource[1]);
      expect(matches.amount).toBeCloseTo(resource[2]);
    });
  });
});