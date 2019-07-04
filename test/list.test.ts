import {expect} from "chai";

import {BitList, bitList} from "../src";

describe("BitList", () => {
  it("should throw on invalid BitLists", () => {
    const badTestCases: BitList[] = [
      Buffer.alloc(0), // empty byte array (uninitialized)
      Buffer.from([0]), // last byte empty
      Buffer.from([0, 0]), // last byte empty
    ]; 
    for (const b of badTestCases) {
      expect(() => bitList.bitLength(b)).to.throw();
    }
  });
  it("should bitLength properly", () => {
    const testCases: {input: BitList; expected: number}[] = [
      {input: Buffer.from([1]), expected: 0},
      {input: Buffer.from([2]), expected: 1},
      {input: Buffer.from([3]), expected: 1},
      {input: Buffer.from([4]), expected: 2},
      {input: Buffer.from([7]), expected: 2},
      {input: Buffer.from([8]), expected: 3},
      {input: Buffer.from([15]), expected: 3},
      {input: Buffer.from([16]), expected: 4},
      {input: Buffer.from([31]), expected: 4},
      {input: Buffer.from([32]), expected: 5},
      {input: Buffer.from([63]), expected: 5},
      {input: Buffer.from([64]), expected: 6},
      {input: Buffer.from([127]), expected: 6},
      {input: Buffer.from([128]), expected: 7},
    ];
    for (const {input, expected} of testCases) {
      expect(bitList.bitLength(input)).to.equal(expected);
    }
  });
  it("should getBit properly", () => {
    const testCases: {list: BitList; index: number; expected: boolean}[] = [
      {list: Buffer.from([2]), index: 0, expected: false},
      {list: Buffer.from([3]), index: 0, expected: true},
      {list: Buffer.from([7]), index: 0, expected: true},
      {list: Buffer.from([7]), index: 1, expected: true},
      {list: Buffer.from([8]), index: 0, expected: false},
      {list: Buffer.from([8]), index: 1, expected: false},
      {list: Buffer.from([8]), index: 2, expected: false},
    ];
    for (const {list, index, expected} of testCases) {
      expect(bitList.getBit(list, index)).to.equal(expected);
    }
  });
  it("should setBit properly", () => {
    const testCases: {list: BitList; index: number; value: boolean; expected: BitList}[] = [
      {list: Buffer.from([2]), index: 0, value: false, expected: Buffer.from([2])},
      {list: Buffer.from([2]), index: 0, value: true, expected: Buffer.from([3])},
      {list: Buffer.from([8]), index: 0, value: true, expected: Buffer.from([9])},
    ];
    for (const {list, index, value, expected} of testCases) {
      bitList.setBit(list, index, value)
      expect(list).to.deep.equal(expected);
    }
  });
});
