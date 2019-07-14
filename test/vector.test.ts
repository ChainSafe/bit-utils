import {expect} from "chai";

import {BitVector, assertBitLength, getBit, setBit} from "../src/vector";

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
      expect(BitVector.fromUint8Array(length, list).getBit(index)).to.equal(expected);
    }
  });
  it("should throw on getBit w/ wrong length", () => {
    const testCases: {list: Uint8Array; length: number; index: number}[] = [
      {list: Buffer.from([2]), length: 1, index: 0},
      {list: Buffer.from([3]), length: 1, index: 0},
    ];
    for (const {list, length, index} of testCases) {
      expect(() => getBit(list, length, index)).to.throw();
    }
  });
  it("should setBit properly", () => {
    const testCases: {list: Uint8Array; length: number; index: number; value: boolean; expected: Uint8Array}[] = [
      {list: Buffer.from([2]), length: 2, index: 0, value: false, expected: Buffer.from([2])},
      {list: Buffer.from([2]), length: 2, index: 0, value: true, expected: Buffer.from([3])},
      {list: Buffer.from([8]), length: 4, index: 0, value: true, expected: Buffer.from([9])},
    ];
    for (const {list, length, index, value, expected} of testCases) {
      const bv = BitVector.fromUint8Array(length, list);
      bv.setBit(index, value)
      expect(bv.serialize()).to.deep.equal(expected);
    }
  });
  it("should throw on setBit w/ wrong length", () => {
    const testCases: {list: Uint8Array; length: number; index: number; value: boolean}[] = [
      {list: Buffer.from([2]), length: 9, index: 0, value: false},
      {list: Buffer.from([2]), length: 1, index: 0, value: true},
      {list: Buffer.from([8]), length: 3, index: 0, value: true},
    ];
    for (const {list, length, index, value} of testCases) {
      expect(() => setBit(list, length, index, value)).to.throw();
    }
  });
});
