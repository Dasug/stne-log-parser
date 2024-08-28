const shipNameAndNcc = /.+ \(([a-zA-Z0-9-]+)?\d+, .+\)/;
const playerNameAndId = /.+ \(([a-zA-Z0-9-]+)?\d+\)/;
// TODO (Dasug): support sub-map notation etc.
const sectorCoordinates = /\d+\|\d+/;

export {
  shipNameAndNcc,
  playerNameAndId,
  sectorCoordinates
}