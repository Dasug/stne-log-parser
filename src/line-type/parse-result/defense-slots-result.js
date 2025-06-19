"use strict"

class DefenseSlotsResult {
  /**
   * amounts of fighting slots that were used offensively
   * @type {number}
   */
  slots;

  /**
   * sector the defense slots reacted in
   * @type {?MapCoordinatesResult}
   */
  sector;
}

export default DefenseSlotsResult;