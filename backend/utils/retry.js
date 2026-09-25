const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const withTimeout = (promise, timeout = 10000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("External API request timed out"));
      }, timeout);
    }),
  ]);
};

const retryAsync = async (
  asyncFunction,
  maxRetries = 3,
  delay = 500,
  timeout = 10000
) => {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await withTimeout(
        asyncFunction(),
        timeout
      );
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      const retryDelay = delay * Math.pow(2, attempt);

      console.warn(
        `Retry attempt ${attempt + 1}/${maxRetries} after ${retryDelay}ms`
      );

      await sleep(retryDelay);
    }
  }

  throw lastError;
};

module.exports = {
  retryAsync,
};