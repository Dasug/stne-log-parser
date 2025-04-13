import { describe, expect, test } from '@jest/globals';
import Avatar from '../../../src/regex/subroutine/avatar.js';
import AvatarJob from '../../../src/enum/avatar-job.js';

describe('avatar regex', () => {
  test("avatar matches valid entry", () => {
    expect(Avatar.match("Mario Frueh (1103184, Drohnenpilot)")).not.toBeNull();
  });
  test("avatar matches valid english entry", () => {
    expect(Avatar.match("Casnia of Borg (1252602, Defense Tactician)")).not.toBeNull();
  });
  test("avatar extracts data properly", () => {
    const match = Avatar.match("Mario Frueh (1103184, Drohnenpilot)");
    expect(match.groups).not.toBeNull();
    expect(match.groups.avatar_name).toBe("Mario Frueh");
    expect(match.groups.avatar_item_id).toBe("1103184");
    expect(match.groups.avatar_job).toBe("Drohnenpilot");
  });

  test("avatar returns proper resultObject", () => {
    const resultObject = Avatar.matchResult("Mario Frueh (1103184, Drohnenpilot)");
    expect(resultObject).not.toBeNull();
    expect(resultObject.name).toBe("Mario Frueh");
    expect(resultObject.itemId).toBe(1103184);
    expect(resultObject.job).toBe(AvatarJob.dronePilot);
  });

  test("avatar returns proper EN resultObject", () => {
    const resultObject = Avatar.matchResult("Casnia of Borg (1252602, Defense Tactician)");
    expect(resultObject).not.toBeNull();
    expect(resultObject.name).toBe("Casnia of Borg");
    expect(resultObject.itemId).toBe(1252602);
    expect(resultObject.job).toBe(AvatarJob.defenseTactician);
  });

});