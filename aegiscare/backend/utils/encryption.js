const CryptoJS = require('crypto-js');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-encryption-key-change-in-production';

/**
 * Encrypt a string value using AES-256
 * @param {string} text - Plain text to encrypt
 * @returns {string} Encrypted text
 */
const encrypt = (text) => {
  if (!text || typeof text !== 'string') return text;
  // Don't encrypt if already encrypted (starts with 'enc:')
  if (text.startsWith('enc:')) return text;
  const encrypted = CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
  return `enc:${encrypted}`;
};

/**
 * Decrypt an AES-256 encrypted string
 * @param {string} encryptedText - Encrypted text (prefixed with 'enc:')
 * @returns {string} Decrypted plain text
 */
const decrypt = (encryptedText) => {
  if (!encryptedText || typeof encryptedText !== 'string') return encryptedText;
  // Only decrypt if it was encrypted by us (starts with 'enc:')
  if (!encryptedText.startsWith('enc:')) return encryptedText;
  try {
    const cipherText = encryptedText.slice(4); // Remove 'enc:' prefix
    const bytes = CryptoJS.AES.decrypt(cipherText, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || encryptedText; // Return original if decryption fails
  } catch (error) {
    console.error('Decryption error:', error.message);
    return encryptedText;
  }
};

/**
 * Encrypt sensitive fields on a user object before saving
 * Fields: phone, address, dateOfBirth, licenseNumber
 * NOTE: email is NOT encrypted because it's used for lookups/login
 * NOTE: password is hashed with bcrypt separately
 */
const encryptUserFields = (userObj) => {
  const fieldsToEncrypt = ['phone', 'address', 'licenseNumber'];
  fieldsToEncrypt.forEach((field) => {
    if (userObj[field] && typeof userObj[field] === 'string' && userObj[field].trim()) {
      userObj[field] = encrypt(userObj[field]);
    }
  });
  return userObj;
};

/**
 * Decrypt sensitive fields on a user object after reading
 */
const decryptUserFields = (userObj) => {
  if (!userObj) return userObj;
  const fieldsToDecrypt = ['phone', 'address', 'licenseNumber'];
  fieldsToDecrypt.forEach((field) => {
    if (userObj[field] && typeof userObj[field] === 'string') {
      userObj[field] = decrypt(userObj[field]);
    }
  });
  return userObj;
};

module.exports = { encrypt, decrypt, encryptUserFields, decryptUserFields };
