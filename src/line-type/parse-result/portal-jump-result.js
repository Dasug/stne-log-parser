class PortalJumpResult {
  /**
   * sector the jump originated in
   * note that this log does not include the submap number!
   * @type {MapCoordinatesResult}
   */
  sectorFrom;

  /**
   * sector the jump ended in
   * note that this log does not include the submap number!
   * @type {MapCoordinatesResult}
   */
  sectorTo;
}

export default PortalJumpResult;