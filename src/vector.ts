/** @module bitVector */
import {bitIndex, getBitfieldBit, setBitfieldBit, BitArray} from "./base";

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

export class BitVector extends BitArray {
  public getBit(index: number): boolean {
    if (index < 0 || index >= this.bitLength) {
      throw new Error('Index out of bounds');
    }
    return getBitfieldBit(this.byteArray, index);
  }
  public setBit(index: number, value: boolean): void {
    if (index < 0 || index >= this.bitLength) {
      throw new Error('Index out of bounds');
    }
    setBitfieldBit(this.byteArray, index, value);
  }
  public toBitfield(): Uint8Array {
    return this.byteArray.slice();
  }
  public static fromBitfield(array: Uint8Array, bitLength: number): BitVector {
    assertBitLength(array, bitLength);
    return new BitVector(array.slice(), bitLength);
  }
}
