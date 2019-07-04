/** @module bitList */
import {bitIndex, getBitfieldBit, setBitfieldBit} from "./base";
import {BitList} from "./types";

export function bitLength(list: BitList): number {
  if (list.length === 0) {
    throw new Error('Uninitialized BitList');
  }
  const lastByte = list[list.length - 1];
  if (lastByte === 0) {
    throw new Error('Invalid BitList, trailing 0 byte');
  }
  return ((list.length - 1) << 3) | bitIndex(lastByte);
}

export function getBit(list: BitList, index: number): boolean {
  const length = bitLength(list);
  return getBitfieldBit(list, length, index);
}

export function setBit(list: BitList, index: number, value: boolean): void {
  const length = bitLength(list);
  return setBitfieldBit(list, length, index, value);
}
