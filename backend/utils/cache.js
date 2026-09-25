const NodeCache = require("node-cache");

const cache = new NodeCache({
  stdTTL: 300,
  checkperiod: 60,
  useClones: false,
});

const clearProductCache = () => {
  const keys = cache.keys();

  keys
    .filter((key) => key.startsWith("products:"))
    .forEach((key) => cache.del(key));

  console.log("🧹 Product catalog cache cleared");
};

module.exports = {
  cache,
  clearProductCache,
};