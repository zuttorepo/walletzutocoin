const level = require('level');
const db = level('./ztcdb');

// Simpan data
const put = (key, value) => db.put(key, JSON.stringify(value));

// Ambil data
const get = async (key) => {
  try {
    const value = await db.get(key);
    return JSON.parse(value);
  } catch (e) {
    if (e.notFound) return null;
    throw e;
  }
};

// Hapus data
const del = (key) => db.del(key);

// Iterasi semua UTXO
async function iterateUTXOs(callback) {
  return new Promise((resolve, reject) => {
    const stream = db.createReadStream();
    stream
      .on('data', ({ key, value }) => {
        try {
          const utxo = JSON.parse(value);
          if (utxo && utxo.address && utxo.amount !== undefined) {
            callback(utxo);
          }
        } catch (e) {
          console.error(`UTXO parse error for key ${key}:`, e);
        }
      })
      .on('end', resolve)
      .on('error', reject);
  });
}

module.exports = {
  put,
  get,
  del,
  iterateUTXOs,
  db
};
