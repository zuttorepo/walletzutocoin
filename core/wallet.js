const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const ALGORITHM = 'aes-256-cbc';
const SALT = 'ZUTTO_SALT';
const ADDRESS_PREFIX = 'ZTC'; // Prefix Zuttocoin address

// 🔑 Buat private key, public key, dan address
function generateWallet() {
  const keyPair = ec.genKeyPair();
  const privateKey = keyPair.getPrivate('hex');
  const publicKey = keyPair.getPublic('hex');
  const address = generateAddressFromPublicKey(publicKey);

  return { privateKey, publicKey, address };
}

// 📬 Buat address dari public key
function generateAddressFromPublicKey(publicKeyHex) {
  const sha256 = crypto.createHash('sha256').update(Buffer.from(publicKeyHex, 'hex')).digest();
  const ripemd160 = crypto.createHash('ripemd160').update(sha256).digest('hex');
  return ADDRESS_PREFIX + ripemd160.slice(0, 32);
}

// 🔐 Enkripsi private key menggunakan password
function encryptPrivateKey(privateKey, password) {
  const iv = crypto.randomBytes(16);
  const key = crypto.scryptSync(password, SALT, 32);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(privateKey, 'utf8'),
    cipher.final()
  ]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// 🔓 Dekripsi private key menggunakan password
function decryptPrivateKey(encryptedData, password) {
  const [ivHex, encryptedHex] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(encryptedHex, 'hex');
  const key = crypto.scryptSync(password, SALT, 32);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final()
  ]);
  return decrypted.toString('utf8');
}

// 🧠 Dari private key → public key → address
function importPrivateKey(privateKeyHex) {
  if (!/^[0-9a-fA-F]{64}$/.test(privateKeyHex)) {
    throw new Error('Private key format tidak valid');
  }

  const key = ec.keyFromPrivate(privateKeyHex);
  const publicKey = key.getPublic('hex');
  const address = generateAddressFromPublicKey(publicKey);

  return {
    privateKey: privateKeyHex,
    publicKey,
    address
  };
}

// ✅ Validasi address Zuttocoin
function isValidAddress(address) {
  return typeof address === 'string' &&
    address.startsWith(ADDRESS_PREFIX) &&
    address.length === (ADDRESS_PREFIX.length + 32);
}

module.exports = {
  generateWallet,
  generateAddressFromPublicKey,
  importPrivateKey,
  encryptPrivateKey,
  decryptPrivateKey,
  isValidAddress
};
