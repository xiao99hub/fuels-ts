/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable max-classes-per-file */

import type { BigNumber } from '@ethersproject/bignumber';
import { arrayify, concat, hexlify } from '@ethersproject/bytes';
import { Coder, B256Coder, NumberCoder } from '@fuels-ts/abi-coder';

export enum InputType /* u8 */ {
  Coin = 0,
  Contract = 1,
}

export type Input =
  | {
      type: InputType.Coin;
      data: InputCoin;
    }
  | {
      type: InputType.Contract;
      data: InputContract;
    };

export class InputCoder extends Coder {
  constructor(localName: string) {
    super('Input', 'Input', localName);
  }

  encode(value: Input): Uint8Array {
    const parts: Uint8Array[] = [];

    parts.push(new NumberCoder('type', 'u8').encode(value.type));
    switch (value.type) {
      case InputType.Coin: {
        parts.push(new InputCoinCoder('data').encode(value.data));
        break;
      }
      case InputType.Contract: {
        parts.push(new InputContractCoder('data').encode(value.data));
        break;
      }
      default: {
        throw new Error('Invalid Input type');
      }
    }

    return concat(parts);
  }

  decode(data: Uint8Array, offset: number): [Input, number] {
    let decoded;
    let o = offset;

    [decoded, o] = new NumberCoder('type', 'u8').decode(data, o);
    const type = decoded.toNumber() as InputType;
    switch (type) {
      case InputType.Coin: {
        [decoded, o] = new InputCoinCoder('data').decode(data, o);
        return [
          {
            type,
            data: decoded,
          },
          o,
        ];
      }
      case InputType.Contract: {
        [decoded, o] = new InputContractCoder('data').decode(data, o);
        return [
          {
            type,
            data: decoded,
          },
          o,
        ];
      }
      default: {
        throw new Error('Invalid Input type');
      }
    }
  }
}

export type InputCoin = {
  // UTXO ID (b256)
  utxoID: string;
  // Owning address or script hash (b256)
  owner: string;
  // Amount of coins (u64)
  amount: BigNumber;
  // Color of the coins (b256)
  color: string;
  // Index of witness that authorizes spending the coin (u8)
  witnessIndex: BigNumber;
  // UTXO being spent must have been created at least this many blocks ago (u64)
  maturity: BigNumber;
  // Length of predicate, in instructions (u16)
  predicateLength: BigNumber;
  // Length of predicate input data, in bytes (u16)
  predicateDataLength: BigNumber;
  // Predicate bytecode (byte[])
  predicate: string;
  // Predicate input data (parameters) (byte[])
  predicateData: string;
};

export class InputCoinCoder extends Coder {
  constructor(localName: string) {
    super('InputCoin', 'InputCoin', localName);
  }

  encode(value: InputCoin): Uint8Array {
    const parts: Uint8Array[] = [];

    parts.push(new B256Coder('utxoID', 'b256').encode(value.utxoID));
    parts.push(new B256Coder('owner', 'address').encode(value.owner));
    parts.push(new NumberCoder('amount', 'u64').encode(value.amount));
    parts.push(new B256Coder('color', 'b256').encode(value.color));
    parts.push(new NumberCoder('witnessIndex', 'u8').encode(value.witnessIndex));
    parts.push(new NumberCoder('maturity', 'u64').encode(value.maturity));
    parts.push(new NumberCoder('predicateLength', 'u16').encode(value.predicateLength));
    parts.push(new NumberCoder('predicateDataLength', 'u16').encode(value.predicateDataLength));
    parts.push(arrayify(value.predicate));
    parts.push(arrayify(value.predicateData));

    return concat(parts);
  }

  decode(data: Uint8Array, offset: number): [InputCoin, number] {
    let decoded;
    let o = offset;

    [decoded, o] = new B256Coder('utxoID', 'b256').decode(data, o);
    const utxoID = decoded;
    [decoded, o] = new B256Coder('owner', 'address').decode(data, o);
    const owner = decoded;
    [decoded, o] = new NumberCoder('amount', 'u64').decode(data, o);
    const amount = decoded;
    [decoded, o] = new B256Coder('color', 'b256').decode(data, o);
    const color = decoded;
    [decoded, o] = new NumberCoder('witnessIndex', 'u8').decode(data, o);
    const witnessIndex = decoded;
    [decoded, o] = new NumberCoder('maturity', 'u64').decode(data, o);
    const maturity = decoded;
    [decoded, o] = new NumberCoder('predicateLength', 'u16').decode(data, o);
    const predicateLength = decoded;
    [decoded, o] = new NumberCoder('predicateDataLength', 'u16').decode(data, o);
    const predicateDataLength = decoded;
    [decoded, o] = [
      hexlify(data.slice(o, predicateLength.toNumber())),
      o + predicateLength.toNumber(),
    ];
    const predicate = decoded;
    [decoded, o] = [
      hexlify(data.slice(o, predicateDataLength.toNumber())),
      o + predicateDataLength.toNumber(),
    ];
    const predicateData = decoded;

    return [
      {
        utxoID,
        owner,
        amount,
        color,
        witnessIndex,
        maturity,
        predicateLength,
        predicateDataLength,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        predicate,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        predicateData,
      },
      o,
    ];
  }
}

export type InputContract = {
  // UTXO ID (b256)
  utxoID: string;
  // Root of amount of coins owned by contract before transaction execution (b256)
  balanceRoot: string;
  // State root of contract before transaction execution (b256)
  stateRoot: string;
  // Contract ID (b256)
  contractID: string;
};

export class InputContractCoder extends Coder {
  constructor(localName: string) {
    super('InputContract', 'InputContract', localName);
  }

  encode(value: InputContract): Uint8Array {
    const parts: Uint8Array[] = [];

    parts.push(new B256Coder('utxoID', 'b256').encode(value.utxoID));
    parts.push(new B256Coder('balanceRoot', 'b256').encode(value.balanceRoot));
    parts.push(new B256Coder('stateRoot', 'b256').encode(value.stateRoot));
    parts.push(new B256Coder('contractID', 'b256').encode(value.contractID));

    return concat(parts);
  }

  decode(data: Uint8Array, offset: number): [InputContract, number] {
    let decoded;
    let o = offset;

    [decoded, o] = new B256Coder('utxoID', 'b256').decode(data, o);
    const utxoID = decoded;
    [decoded, o] = new B256Coder('balanceRoot', 'b256').decode(data, o);
    const balanceRoot = decoded;
    [decoded, o] = new B256Coder('stateRoot', 'b256').decode(data, o);
    const stateRoot = decoded;
    [decoded, o] = new B256Coder('contractID', 'b256').decode(data, o);
    const contractID = decoded;

    return [
      {
        utxoID,
        balanceRoot,
        stateRoot,
        contractID,
      },
      o,
    ];
  }
}