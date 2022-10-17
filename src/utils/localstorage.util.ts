import { IStorage } from "../datatypes";

export const setLocalStorage = ({ platenumber, file, threshold }: IStorage) => {
  if (!platenumber || !file || !threshold) return;
  localStorage.setItem("platenumber", platenumber);
  localStorage.setItem("file", file);
  localStorage.setItem("threshold", threshold);
};

export const removeLocalStorage = () => {
  localStorage.removeItem("platenumber");
  localStorage.removeItem("file");
  localStorage.removeItem("threshold");
};
