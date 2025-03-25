import { z } from "zod";
import { CODE_ALPHABET, CODE_LENGTH, CODE_REGEX } from "./consts";

// https://rosettacode.org/wiki/Modular_exponentiation#Nim
export function powmod(b: bigint, e: bigint, m: bigint) {
  let _e = e;
  let _b = b;
  let result = 1n;
  while (_e > 0n) {
    if (_e % 2n === 1n) {
      result = (result * _b) % m;
    }
    _e = _e >> 1n;
    _b = _b ** 2n % m;
  }
  return result;
}

export function keyToCode(key: number, length = CODE_LENGTH) {
  // This function uses the bijective
  // properties of LCG random number generators
  // to obfuscate the key
  const a = BigInt(214013);
  const c = BigInt(2531011);

  const bigkey = BigInt(key);

  // https://math.stackexchange.com/a/2115780
  const modulo = BigInt(CODE_ALPHABET.length) ** BigInt(length);
  const apowkey = powmod(a, bigkey, modulo);
  let num = (apowkey + ((apowkey - 1n) / (a - 1n)) * c) % modulo;
  let code = "";
  for (let i = 0; i < length; i++) {
    code += CODE_ALPHABET[Number(num) % CODE_ALPHABET.length];
    num = num / BigInt(CODE_ALPHABET.length);
  }
  return code;
}

export function codeValidation() {
  return z.string().length(CODE_LENGTH).regex(CODE_REGEX);
}

// https://stackoverflow.com/a/20129594
export function selectColor(i: number) {
  const hue = i * 137.508; // use golden angle approximation
  return `hsl(${hue},100%,25%)`;
}
