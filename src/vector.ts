/** @module bitVector */
import {bitIndex, getBitfieldBit, setBitfieldBit} from "./base";

export function assertBitLength(vector: Uint8Array, length: number): void {
  const byteLength = vector.length;
  const expectedByteLength = (length + 7) >> 3;
  if (vector.length !== expectedByteLength) {
    throw new Error(`BitVector has byte length ${byteLength}, expected ${expectedByteLength}`);
  }
  if (length === 0) {
    return;
  }
  const lastByteBitLength = bitIndex(vector[byteLength - 1]) + 1;
  const expectedLastByteBitLength = length & 7;
  if (lastByteBitLength > expectedLastByteBitLength) {
    throw new Error(`BitVector has last byte bit length of ${lastByteBitLength}, expected <= ${expectedLastByteBitLength}`)
  }
}

export function getBit(vector: Uint8Array, length: number, index: number): boolean {
  assertBitLength(vector, length);
  return getBitfieldBit(vector, length, index);
}

export function setBit(vector: Uint8Array, length: number, index: number, value: boolean): void {
  assertBitLength(vector, length);
  return setBitfieldBit(vector, length, index, value);
}

export class BitVector {
  public readonly bitLength: number;
  private byteArray: Uint8Array;
  public constructor(bitLength: number, byteArray: Uint8Array) {
    this.bitLength = bitLength;
    this.byteArray = byteArray;
  }
  public getBit(index: number): boolean {
    return getBit(this.byteArray, this.bitLength, index);
  }
  public setBit(index: number, value: boolean): void {
    setBit(this.byteArray, this.bitLength, index, value);
  }
  public serialize(): Uint8Array {
    return this.byteArray;
  }
  public static fromUint8Array(bitLength: number, array: Uint8Array): BitVector {
    return new BitVector(bitLength, array.slice());
  }
}
