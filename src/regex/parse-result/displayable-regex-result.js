class DisplayableRegexResult {
  asDisplayString() {
    return JSON.stringify(this);
  }

  toString() {
    return this.asDisplayString();
  }
}

export default DisplayableRegexResult;
