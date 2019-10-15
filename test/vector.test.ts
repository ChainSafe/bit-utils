import {expect} from "chai";
import {assertBitLength, BitVector} from "../src/vector";

describe("BitVector", () => {
  it("should assertBitLength properly", () => {
    const testCases: { vector: Uint8Array; length: number; error: boolean }[] = [
      {vector: Buffer.alloc(0), length: 0, error: false},
      {vector: Buffer.from([1]), length: 1, error: false},
      {vector: Buffer.from([1]), length: 0, error: true},
      {vector: Buffer.from([2]), length: 1, error: true},
      {vector: Buffer.from([2]), length: 2, error: false},
      {vector: Buffer.from([3]), length: 2, error: false},
      {vector: Buffer.from([3]), length: 8, error: false},
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
    const testCases: { list: Uint8Array; length: number; index: number; expected: boolean }[] = [
      {list: Buffer.from([2]), length: 2, index: 0, expected: false},
      {list: Buffer.from([3]), length: 2, index: 0, expected: true},
    ];
    for (const {list, length, index, expected} of testCases) {
      expect(BitVector.fromBitfield(list, length).getBit(index)).to.equal(expected);
    }
  });
  it("should throw on getBit w/ invalid index", () => {
    const testCases: { list: Uint8Array; length: number; index: number }[] = [
      {list: Buffer.from([2]), length: 2, index: -1},
      {list: Buffer.from([2]), length: 2, index: 3},
    ];
    for (const {list, length, index} of testCases) {
      expect(() => BitVector.fromBitfield(list, length).getBit(index)).to.throw();
    }
  });
  it("should setBit properly", () => {
    const testCases: { list: Uint8Array; length: number; index: number; value: boolean; expected: Uint8Array }[] = [
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
    const testCases: { list: Uint8Array; length: number; index: number }[] = [
      {list: Buffer.from([3]), length: 2, index: -1},
      {list: Buffer.from([3]), length: 2, index: 3},
    ];
    for (const {list, length, index} of testCases) {
      expect(() => BitVector.fromBitfield(list, length).setBit(index, true)).to.throw();
    }
  });
  it("should equals properly", () => {
    const testCases: { vector: Uint8Array; length: number }[] = [
      {vector: Buffer.from([3]), length: 2},
    ];
    for (const {vector, length} of testCases) {
      expect(BitVector.fromBitfield(vector, length).equals(BitVector.fromBitfield(vector, length))).to.equal(true);
    }
  });
  it("should push properly", () => {
    const testCases: { pre: BitVector; value: boolean; post: BitVector }[] = [
      {
        pre: BitVector.fromBitfield(Buffer.from([1]), 8),
        value: false,
        post: BitVector.fromBitfield(Buffer.from([2]), 8)
      },
      {
        pre: BitVector.fromBitfield(Buffer.from([1]), 8),
        value: true,
        post: BitVector.fromBitfield(Buffer.from([3]), 8)
      },
      {
        pre: BitVector.fromBitfield(Buffer.from([1, 0]), 9),
        value: false,
        post: BitVector.fromBitfield(Buffer.from([2, 0]), 9)
      },
      {
        pre: BitVector.fromBitfield(Buffer.from([1, 1]), 9),
        value: false,
        post: BitVector.fromBitfield(Buffer.from([2, 0]), 9)
      },
    ];
    for (const {pre, value, post} of testCases) {
      pre.push(value);
      expect(pre.equals(post)).to.equal(true);
    }
  });
  it("should identify a BitList properly", () => {
    const b1 = BitVector.fromBitfield(Buffer.alloc(1), 8);
    const b2 = {};
    const b3 = [true, true];
    expect(BitVector.isBitVector(b1)).to.equal(true);
    expect(BitVector.isBitVector(b2)).to.equal(false);
    expect(BitVector.isBitVector(b2)).to.equal(false);
  });

  it('should apply other array with or operator', function () {
    const array1 = new BitVector(new Uint8Array(16), 8);
    const array2 = new BitVector(new Uint8Array(16), 8);
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
    const array1 = new BitVector(new Uint8Array(16), 8);
    const array2 = new BitVector(new Uint8Array(16), 8);
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
    const array1 = new BitVector(new Uint8Array(0), 0);
    const array2 = new BitVector(new Uint8Array(0), 0);
    const result = array1.overlaps(array2);
    expect(result).to.be.false;
  });

  it('should fail overlap check if different length', function () {
    const array1 = new BitVector(new Uint8Array(8), 1);
    const array2 = new BitVector(new Uint8Array(0), 0);
    expect(() => array1.overlaps(array2)).to.throw
  });

  it('should return that array overlaps', function () {
    const array1 = new BitVector(new Uint8Array(16), 8);
    const array2 = new BitVector(new Uint8Array(16), 8);
    array1.setBit(0, true);
    array1.setBit(2, true);
    array2.setBit(1, true);
    array2.setBit(2, true);
    const result = array1.overlaps(array2);
    expect(result).to.be.true;
  });

  it('should return that array doesnt overlap', function () {
    const array1 = new BitVector(new Uint8Array(16), 8);
    const array2 = new BitVector(new Uint8Array(16), 8);
    array1.setBit(0, true);
    array1.setBit(3, true);
    array2.setBit(1, true);
    array2.setBit(2, true);
    const result = array1.overlaps(array2);
    expect(result).to.be.false;
  });
});
