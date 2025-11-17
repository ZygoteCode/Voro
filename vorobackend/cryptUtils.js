import crypto from 'crypto';

const PASSWORD = process.env.AES_SECRET;
const SALT = process.env.AES_SALT;

if (!PASSWORD || !SALT) {
  throw new Error('AES_SECRET and AES_SALT environment variables are necessary.');
}

const KEY = crypto.scryptSync(PASSWORD, SALT, 32);

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const ENCODING_FORMAT = 'base64';
const TEXT_FORMAT = 'utf8';

export function encrypt(payload) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  const jsonPayload = JSON.stringify(payload);

  const encrypted = Buffer.concat([
    cipher.update(jsonPayload, TEXT_FORMAT),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return `${iv.toString(ENCODING_FORMAT)}.${tag.toString(
    ENCODING_FORMAT
  )}.${encrypted.toString(ENCODING_FORMAT)}`;
}

export function decrypt(token) {
  try {
    if (!token || typeof token !== 'string') return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [ivB64, tagB64, encryptedB64] = parts;

    const iv = Buffer.from(ivB64, ENCODING_FORMAT);
    const tag = Buffer.from(tagB64, ENCODING_FORMAT);
    const encrypted = Buffer.from(encryptedB64, ENCODING_FORMAT);

    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return JSON.parse(decrypted.toString(TEXT_FORMAT));
  } catch {
    return null;
  }
}