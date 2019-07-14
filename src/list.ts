/** @module bitList */
import {bitIndex, getBitfieldBit, setBitfieldBit} from "./base";

export function bitLength(list: Uint8Array): number {
  if (list.length === 0) {
    throw new Error('Uninitialized BitList');
  }
  const lastByte = list[list.length - 1];
  if (lastByte === 0) {
    throw new Error('Invalid BitList, trailing 0 byte');
  }
  return ((list.length - 1) << 3) | bitIndex(lastByte);
}

export function getBit(list: Uint8Array, index: number): boolean {
  const length = bitLength(list);
  return getBitfieldBit(list, length, index);
}

export function setBit(list: Uint8Array, index: number, value: boolean): void {
  const length = bitLength(list);
  return setBitfieldBit(list, length, index, value);
}

export class BitList {
  public readonly bitLength: number;
  private byteArray: Uint8Array;
  public constructor(bitLength: number, byteArray: Uint8Array) {
    this.bitLength = bitLength;
    this.byteArray = byteArray;
  }
  public getBit(index: number): boolean {
    return getBit(this.byteArray, index);
  }
  public setBit(index: number, value: boolean): void {
    setBit(this.byteArray, index, value);
  }
  public serialize(): Uint8Array {
    return this.byteArray;
  }
  public static deserialize(list: Uint8Array): BitList {
    return new BitList(bitLength(list), list.slice());
  }
  public static fromUint8Array(bitLength: number, array: Uint8Array): BitList {
    const byteLength = Math.floor((bitLength + 7) / 8);
    if (array.length !== byteLength) {
      throw new Error(`Invalid array, must be length ${byteLength}`);
    }
    let list: Uint8Array;
    if (bitLength % 8 == 0) {
      list = new Uint8Array(byteLength + 1);
      list.set(array);
    } else {
      list = array.slice();
    }
    setBitfieldBit(list, bitLength+1, bitLength, true);
    return new BitList(bitLength, list);
  }
}
