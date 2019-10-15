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
  it("should getBit properly", () => {
    const testCases: {list: Uint8Array}[] = [
      {list: Buffer.from([2])},
      {list: Buffer.from([3])},
      {list: Buffer.from([7])},
      {list: Buffer.from([7])},
      {list: Buffer.from([8])},
      {list: Buffer.from([8])},
      {list: Buffer.from([8])},
    ];
    for (const {list} of testCases) {
      expect(BitList.deserialize(list).equals(BitList.deserialize(list))).to.equal(true);
    }
  });
  it("should clone properly", () => {
    const b1 = BitList.fromBitfield(Buffer.alloc(1), 8);
    const b2 = b1.clone();
    expect(b1.equals(b2)).to.equal(true);
    b1.setBit(0, true);
    expect(b1.equals(b2)).to.equal(false);
  });
  it("should identify a BitList properly", () => {
    const b1 = BitList.fromBitfield(Buffer.alloc(1), 8);
    const b2 = {};
    const b3 = [true, true];
    expect(BitList.isBitList(b1)).to.equal(true);
    expect(BitList.isBitList(b2)).to.equal(false);
    expect(BitList.isBitList(b3)).to.equal(false);
  });
  it("should handle troublesome test cases", () => {
    const b = BitList.fromBitfield(Buffer.alloc(1), 1);
    let x = b.serialize()
    x[0] = 0
    expect(() => BitList.deserialize(b.serialize())).to.not.throw();
  });

  it('should apply other array with or operator', function () {
    const array1 = new BitList(new Uint8Array(16), 8);
    const array2 = new BitList(new Uint8Array(16), 8);
    array1.setBit(0, true);
    array1.setBit(2, true);
    array2.setBit(1, true);
    array2.setBit(2, true);
    const result = array1.or(array2);
    expect(result.getBit(0)).to.be.true;
    expect(result.getBit(1)).to.be.true;
    expect(result.getBit(2)).to.be.true;
    expect(result.getBit(3)).to.be.false;
  });

  it('should apply other array with and operator', function () {
    const array1 = new BitList(new Uint8Array(16), 8);
    const array2 = new BitList(new Uint8Array(16), 8);
    array1.setBit(0, true);
    array1.setBit(2, true);
    array2.setBit(1, true);
    array2.setBit(2, true);
    const result = array1.and(array2);
    expect(result.getBit(0)).to.be.false;
    expect(result.getBit(1)).to.be.false;
    expect(result.getBit(2)).to.be.true;
    expect(result.getBit(3)).to.be.false;
  });

  it('should return that array doesnt overlap - zero array', function () {
    const array1 = new BitList(new Uint8Array(0), 0);
    const array2 = new BitList(new Uint8Array(0), 0);
    const result = array1.overlaps(array2);
    expect(result).to.be.false;
  });

  it('should fail overlap check if different length', function () {
    const array1 = new BitList(new Uint8Array(8), 1);
    const array2 = new BitList(new Uint8Array(0), 0);
    expect(() => array1.overlaps(array2)).to.throw
  });

  it('should return that array overlaps', function () {
    const array1 = new BitList(new Uint8Array(16), 8);
    const array2 = new BitList(new Uint8Array(16), 8);
    array1.setBit(0, true);
    array1.setBit(2, true);
    array2.setBit(1, true);
    array2.setBit(2, true);
    const result = array1.overlaps(array2);
    expect(result).to.be.true;
  });

  it('should return that array doesnt overlap', function () {
    const array1 = new BitList(new Uint8Array(16), 8);
    const array2 = new BitList(new Uint8Array(16), 8);
    array1.setBit(0, true);
    array1.setBit(3, true);
    array2.setBit(1, true);
    array2.setBit(2, true);
    const result = array1.overlaps(array2);
    expect(result).to.be.false;
  });
});
