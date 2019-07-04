/** @module bitVector */
import {bitIndex, getBitfieldBit, setBitfieldBit} from "./base";
import {BitVector} from "./types";

export function assertBitLength(vector: BitVector, length: number): void {
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

export function getBit(vector: BitVector, length: number, index: number): boolean {
  assertBitLength(vector, length);
  return getBitfieldBit(vector, length, index);
}

export function setBit(vector: BitVector, length: number, index: number, value: boolean): void {
  assertBitLength(vector, length);
  return setBitfieldBit(vector, length, index, value);
}
