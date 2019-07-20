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
  const expectedLastByteBitLength = length & 7;
  if (expectedLastByteBitLength !== 0) {
    const lastByteBitLength = bitIndex(vector[byteLength - 1]) + 1;
    if (lastByteBitLength > expectedLastByteBitLength) {
      throw new Error(`BitVector has last byte bit length of ${lastByteBitLength}, expected <= ${expectedLastByteBitLength}`)
    }
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
  public push(value: boolean): void {
    let carry = value ? 1 : 0;
    for (let i = 0; i < this.byteArray.length; i++) {
      const oldByte = this.byteArray[i];
      this.byteArray[i] = ((oldByte << 1) + carry) & 255;
      carry = oldByte >> 7;
    }
    const lastBitLength = this.bitLength & 7;
    if (lastBitLength !== 0) {
      this.byteArray[this.byteArray.length - 1] = this.byteArray[this.byteArray.length - 1] & (255 >> (8 - lastBitLength));
    }
  }
  public static fromBitfield(array: Uint8Array, bitLength: number): BitVector {
    assertBitLength(array, bitLength);
    return new BitVector(array.slice(), bitLength);
  }
  public equals(other: BitVector): boolean {
    return other instanceof BitVector && super.equals(other);
  }
}
