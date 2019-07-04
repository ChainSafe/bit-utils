/** @module bitUtils */

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

export function getBitfieldBit(buf: Uint8Array, bitLength: number, index: number): boolean {
  if (index >= bitLength) {
    throw new Error(`Cannot get bit ${index} of bitfield with bit length ${bitLength}`);
  }
  return ((buf[index>>3] >> (index&7)) & 1) == 1;
}

export function setBitfieldBit(buf: Uint8Array, bitLength: number, index: number, value: boolean): void {
  if (index >= bitLength) {
    throw new Error(`Cannot set bit ${index} of bitfield with bit length ${bitLength}`);
  }
  const bit = 1 << (index & 7);
  if (value) {
    buf[index >> 3] |= bit;
  } else {
    buf[index >> 3] &= bit ^ 255;
  }
}
