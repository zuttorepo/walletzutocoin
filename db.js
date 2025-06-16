const level = require('level');
const db = level('./ztcdb');

module.exports = {
  put: (key, value) => db.put(key, JSON.stringify(value)),
  get: async (key) => {
    try {
      const value = await db.get(key);
      return JSON.parse(value);
    } catch (e) {
      if (e.notFound) return null;
      throw e;
    }
  },
  del: (key) => db.del(key),
  db // digunakan di balance.js
};
