import * as CryptoJS from 'crypto-js';
import { CRYPT_KEY } from './commonService';

//#region encrypt text
export function encryptText(text: string) {
  if (!CRYPT_KEY) throw new Error('key is missing');
  const key = CRYPT_KEY ?? '';
  const encryptedText = CryptoJS.AES.encrypt(text, key).toString();
  return encryptedText;
}
//#endregion

//#region decrypt
export function decryptText(text: string) {
  if (!CRYPT_KEY) throw new Error('key is missing');
  const key = CRYPT_KEY;
  const bytes = CryptoJS.AES.decrypt(text, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}
//#endregion
