const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const crypto = require('crypto');

function sha256(data) {
  return crypto.createHash('sha256').update(data).digest();
}

function doubleSha256(data) {
  return sha256(sha256(data));
}

function verifySignature(pubKeyHex, msgHash, signatureHex) {
  try {
    const key = ec.keyFromPublic(pubKeyHex, 'hex');
    return key.verify(msgHash, signatureHex);
  } catch {
    return false;
  }
}

module.exports = {
  sha256,
  doubleSha256,
  verifySignature,
};
