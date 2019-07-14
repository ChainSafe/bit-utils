import {expect} from "chai";

import {BitList, bitLength} from "../src/list";

describe("BitList", () => {
  it("should properly serialize/deserialize BitList objects", () => {
    const testCases: Uint8Array[] = [
      Buffer.from([2]),
      Buffer.from([0, 2]),
    ];
    for (const list of testCases) {
      expect(BitList.deserialize(list).serialize()).to.deep.equal(list);
    }
  });
  it("should properly create BitList objects from bitfields", () => {
    const testCases: {array: Uint8Array; length: number; expected: Uint8Array}[] = [
      {array: Buffer.from([1]), length: 1, expected: Buffer.from([3])},
      {array: Buffer.from([1]), length: 8, expected: Buffer.from([1, 1])},
    ];
    for (const {array, length, expected} of testCases) {
      const bl = BitList.fromBitfield(array, length);
      expect(bl.serialize()).to.deep.equal(expected);
      expect(bl.toBitfield()).to.deep.equal(array);
    }
  });
  it("should throw creating BitList objects from missized Uint8Arrays", () => {
    const testCases: {array: Uint8Array; length: number}[] = [
      {array: Buffer.from([1]), length: 9},
      {array: Buffer.from([1, 1]), length: 8},
    ];
    for (const {array, length} of testCases) {
      expect(() => BitList.fromBitfield(array, length)).to.throw();
    }
  });
  it("should throw on deserializing invalid BitList Uint8Arrays", () => {
    const badTestCases: Uint8Array[] = [
      Buffer.alloc(0), // empty byte array (uninitialized)
      Buffer.from([0]), // last byte empty
      Buffer.from([0, 0]), // last byte empty
    ]; 
    for (const b of badTestCases) {
      expect(() => BitList.deserialize(b)).to.throw();
    }
  });
  it("should bitLength properly", () => {
    const testCases: {input: Uint8Array; expected: number}[] = [
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
      expect(bitLength(input)).to.equal(expected);
    }
  });
  it("should getBit properly", () => {
    const testCases: {list: Uint8Array; index: number; expected: boolean}[] = [
      {list: Buffer.from([2]), index: 0, expected: false},
      {list: Buffer.from([3]), index: 0, expected: true},
      {list: Buffer.from([7]), index: 0, expected: true},
      {list: Buffer.from([7]), index: 1, expected: true},
      {list: Buffer.from([8]), index: 0, expected: false},
      {list: Buffer.from([8]), index: 1, expected: false},
      {list: Buffer.from([8]), index: 2, expected: false},
    ];
    for (const {list, index, expected} of testCases) {
      expect(BitList.deserialize(list).getBit(index)).to.equal(expected);
    }
  });
  it("should throw on getBit w/ invalid index", () => {
    const testCases: {list: Uint8Array; length: number; index: number}[] = [
      {list: Buffer.from([2]), length: 2, index: -1},
      {list: Buffer.from([2]), length: 2, index: 3},
    ];
    for (const {list, length, index} of testCases) {
      expect(() => BitList.fromBitfield(list, length).getBit(index)).to.throw();
    }
  });
  it("should setBit properly", () => {
    const testCases: {list: Uint8Array; index: number; value: boolean; expected: Uint8Array}[] = [
      {list: Buffer.from([2]), index: 0, value: false, expected: Buffer.from([2])},
      {list: Buffer.from([2]), index: 0, value: true, expected: Buffer.from([3])},
      {list: Buffer.from([8]), index: 0, value: true, expected: Buffer.from([9])},
    ];
    for (const {list, index, value, expected} of testCases) {
      const bl = BitList.deserialize(list);
      bl.setBit(index, value)
      expect(bl.serialize()).to.deep.equal(expected);
    }
  });
  it("should throw on setBit w/ invalid index", () => {
    const testCases: {list: Uint8Array; length: number; index: number}[] = [
      {list: Buffer.from([3]), length: 2, index: -1},
      {list: Buffer.from([3]), length: 2, index: 3},
    ];
    for (const {list, length, index} of testCases) {
      expect(() => BitList.fromBitfield(list, length).setBit(index, true)).to.throw();
    }
  });
});
