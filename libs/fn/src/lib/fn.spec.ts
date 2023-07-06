import { isEmptyObject } from './fn';

describe('fn', () => {
  it('should work', () => {
    expect(isEmptyObject({})).toEqual(false);
  });
});
