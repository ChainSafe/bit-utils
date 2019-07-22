/** @module bitList */
import {bitIndex, getBitfieldBit, setBitfieldBit, BitArray} from "./base";

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

export class BitList extends BitArray {
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
  public serialize(): Uint8Array {
    return this.byteArray.slice();
  }
  public static deserialize(list: Uint8Array): BitList {
    return new BitList(list.slice(), bitLength(list));
  }
  public toBitfield(): Uint8Array {
    if (this.bitLength % 8 === 0) {
      return this.byteArray.slice(0, this.byteArray.length - 1);
    } else {
      const bitfield = this.byteArray.slice();
      setBitfieldBit(bitfield, this.bitLength, false);
      return bitfield;
    }
  }
  public static fromBitfield(array: Uint8Array, bitLength: number): BitList {
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
    setBitfieldBit(list, bitLength, true);
    return new BitList(list, bitLength);
  }
  public equals(other: BitList): boolean {
    return other instanceof BitList && super.equals(other);
  }
  public static isBitList(instance: BitList | any): boolean {
    return (
      instance.byteArray instanceof Uint8Array &&
      Number.isInteger(instance.bitLength) &&
      instance.constructor && instance.constructor.name === 'BitList'
    );
  }
}
