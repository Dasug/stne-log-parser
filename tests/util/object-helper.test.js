import { describe, expect, test } from '@jest/globals';
import { mapObject } from '../../src/util/object-helper.js';

describe('object helper', () => {
  // addSubroutines
  test("object map test", () => {
    const testObject = {
      firstProperty: "myValue",
      secondProperty: "myNextValue",
      thirdProperty: "yetAnotherValue",
    }

    const mappedObject = mapObject(testObject, (value, key) => value.length + key.length);
    
    expect(mappedObject).toBeInstanceOf(Object);
    expect(mappedObject.firstProperty).toBe(20);
    expect(mappedObject.secondProperty).toBe(25);
    expect(mappedObject.thirdProperty).toBe(28);
  });
});
