import { TIMEOUT_SEC } from "./config.js";

const timeout = (s) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request took too long. Timeout after ${s} seconds.`));
    }, s * 1000);
  });
};

export const fetchData = async (url, postData = undefined, method = "POST") => {
  try {
    const fetchPromise = postData
      ? fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    return res;
  } catch (err) {
    throw err;
  }
};
