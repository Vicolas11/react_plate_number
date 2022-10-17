import { openDB } from "idb";

const dbname = "plate";

const dbPromise = openDB(`${dbname}-store`, 1, {
  upgrade(db) {
    db.createObjectStore(dbname);
  },
});

const blobToArrayBuffer = (blob: Blob): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      if (reader.result !== null) {
        resolve(reader.result as ArrayBuffer);
      }
    });
    reader.addEventListener("error", reject);
    reader.readAsArrayBuffer(blob);
  });
};

export const getDB = async (): Promise<ArrayBuffer> => {
  return (await dbPromise).get(dbname, 1);
};

export const setDB = async (val: Blob) => {
  const value = await blobToArrayBuffer(val);
  return (await dbPromise).put(dbname, value, 1);
};

export const delDB = async () => {
  return (await dbPromise).delete(dbname, 1);
};

export const clearDB = async () => {
  return (await dbPromise).clear(dbname);
};

export const keysDB = async () => {
  return (await dbPromise).getAllKeys(dbname);
};

dbPromise.catch((err) => console.log("indexDB ERROR", err));
