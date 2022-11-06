import { IStorage } from "../datatypes";

export const setLocalStorage = ({ data, file, threshold }: IStorage) => {
  if (!data || !file || !threshold) return;
  localStorage.setItem("data", JSON.stringify(data));
  localStorage.setItem("file", file);
  localStorage.setItem("threshold", threshold);
};

export const removeLocalStorage = () => {
  localStorage.removeItem("data");
  localStorage.removeItem("file");
  localStorage.removeItem("threshold");
};
