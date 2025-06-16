const { db } = require('./index');

const prefix = 'txlog:';

module.exports = {
  saveTx: async (txid, tx) => {
    await db.put(prefix + txid, tx);
  },
  getTx: async (txid) => {
    return await db.get(prefix + txid);
  },
  listTx: async (address) => {
    const result = [];
    return new Promise((resolve, reject) => {
      db.createReadStream()
        .on('data', ({ key, value }) => {
          if (key.startsWith(prefix) && value.from === address || value.to === address) {
            result.push(value);
          }
        })
        .on('end', () => resolve(result))
        .on('error', reject);
    });
  }
};
