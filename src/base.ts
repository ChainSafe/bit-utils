/** @module bitUtils */

export function copy(buffer: Buffer | Uint8Array): Buffer | Uint8Array {
  return Uint8Array.prototype.slice.apply(buffer);
}

/**
 * Get index of left-most 1 bit
 */
export function bitIndex(byte: number): number {
  let index = 0;
  if ((byte & 0xf0) !== 0) { // 11110000
    index |= 4;
    byte >>= 4;
  }
  if ((byte & 0x0c) !== 0) { // 00001100
    index |= 2;
    byte >>= 2;
  }
  if ((byte & 0x02) !== 0) { // 00000010
    index |= 1;
    byte >>= 1;
  }
  return index;
}

export function getBitfieldBit(buf: Uint8Array, index: number): boolean {
  return ((buf[index>>3] >> (index&7)) & 1) == 1;
}

export function setBitfieldBit(buf: Uint8Array, index: number, value: boolean): void {
  const bit = 1 << (index & 7);
  if (value) {
    buf[index >> 3] |= bit;
  } else {
    buf[index >> 3] &= bit ^ 255;
  }
}

export abstract class BitArray {
  public readonly bitLength: number;
  protected byteArray: Uint8Array;
  public constructor(byteArray: Uint8Array, bitLength: number) {
    this.byteArray = byteArray;
    this.bitLength = bitLength;
  }
  public abstract getBit(index: number): boolean;
  public abstract setBit(index: number, value: boolean): void;
  public abstract toBitfield(): Uint8Array;
  public equals(other: BitArray): boolean {
    if (this.bitLength !== other.bitLength) {
      return false;
    }
    for (let i = 0; i < this.byteArray.length; i++) {
      if (this.byteArray[i] !== other.byteArray[i]) {
        return false;
      }
    }
    return true;
  }
  public clone(): this {
    return new (this as any).__proto__.constructor(this.byteArray.slice(), this.bitLength);
  }
}
