import {expect} from "chai";

import {BitVector, assertBitLength} from "../src/vector";

describe("BitVector", () => {
  it("should assertBitLength properly", () => {
    const testCases: {vector: Uint8Array; length: number; error: boolean}[] = [
      {vector: Buffer.alloc(0), length: 0, error: false},
      {vector: Buffer.from([1]), length: 1, error: false},
      {vector: Buffer.from([1]), length: 0, error: true},
      {vector: Buffer.from([2]), length: 1, error: true},
      {vector: Buffer.from([2]), length: 2, error: false},
      {vector: Buffer.from([3]), length: 2, error: false},
    ];
    for (const {vector, length, error} of testCases) {
      if (error) {
        expect(() => assertBitLength(vector, length)).to.throw();
      } else {
        expect(() => assertBitLength(vector, length)).to.not.throw();
      }
    }
  });
  it("should getBit properly", () => {
    const testCases: {list: Uint8Array; length: number; index: number; expected: boolean}[] = [
      {list: Buffer.from([2]), length: 2, index: 0, expected: false},
      {list: Buffer.from([3]), length: 2, index: 0, expected: true},
    ];
    for (const {list, length, index, expected} of testCases) {
      expect(BitVector.fromBitfield(list, length).getBit(index)).to.equal(expected);
    }
  });
  it("should throw on getBit w/ invalid index", () => {
    const testCases: {list: Uint8Array; length: number; index: number}[] = [
      {list: Buffer.from([2]), length: 2, index: -1},
      {list: Buffer.from([2]), length: 2, index: 3},
    ];
    for (const {list, length, index} of testCases) {
      expect(() => BitVector.fromBitfield(list, length).getBit(index)).to.throw();
    }
  });
  it("should setBit properly", () => {
    const testCases: {list: Uint8Array; length: number; index: number; value: boolean; expected: Uint8Array}[] = [
      {list: Buffer.from([2]), length: 2, index: 0, value: false, expected: Buffer.from([2])},
      {list: Buffer.from([2]), length: 2, index: 0, value: true, expected: Buffer.from([3])},
      {list: Buffer.from([8]), length: 4, index: 0, value: true, expected: Buffer.from([9])},
    ];
    for (const {list, length, index, value, expected} of testCases) {
      const bv = BitVector.fromBitfield(list, length);
      bv.setBit(index, value)
      expect(bv.toBitfield()).to.deep.equal(expected);
    }
  });
  it("should throw on setBit w/ invalid index", () => {
    const testCases: {list: Uint8Array; length: number; index: number}[] = [
      {list: Buffer.from([3]), length: 2, index: -1},
      {list: Buffer.from([3]), length: 2, index: 3},
    ];
    for (const {list, length, index} of testCases) {
      expect(() => BitVector.fromBitfield(list, length).setBit(index, true)).to.throw();
    }
  });
});
