import { createContext, FC, ReactNode, useEffect, useState } from "react";
import arrayBufferToBlob from "./utils/arraybuff2buff.util";
import { setLocalStorage } from "./utils/localstorage.util";
import { getDB } from "./utils/indexdb.utils";
import { ContxtType, ValueType } from "./datatypes";

export const PlateNumberContext = createContext<ContxtType>({
  data: null,
  file: null,
  threshold: null,
  videosrc: null,
  showCropDialog: false,
  active: false,
  addPlatenumber: (value) => {},
  addFile: (value) => {},
  addThreshold: (value) => {},
  addVideoSrc: (value) => {},
  setShowCrop: (value) => {},
  setActive: (value) => {},
});

// Init Storage Values
const plateNumInit = localStorage.getItem("data") as string;
const plate = JSON.parse(plateNumInit);
const fileInit = localStorage.getItem("file");
const thresholdInit = localStorage.getItem("threshold");
let blobInit: Blob = new Blob();
let blobTOString: string | null = null;

const blobResult = async () => {
  const arrayBuffer: ArrayBuffer = await getDB();
  blobInit = arrayBufferToBlob(arrayBuffer);
  blobTOString = URL.createObjectURL(blobInit);
};

blobResult();

const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [showCropDialog, setShowCropDialog] = useState<boolean>(false);
  const [data, setPlatenumber] = useState<ValueType>(plate);
  const [active, setActiveTab] = useState<boolean>(false);
  const [threshold, setThreshold] = useState(thresholdInit);
  const [videosrc, setVideosrc] = useState(blobTOString);
  const [file, setFile] = useState(fileInit);

  const addPlatenumber = (value: ValueType) => {
    setPlatenumber(value);
  };

  const addFile = (value: string) => {
    setFile(value);
  };

  const addThreshold = (value: string) => {
    setThreshold(value);
  };

  const setShowCrop = (value: boolean) => {
    setShowCropDialog(value);
  };

  const setActive = (value: boolean) => {
    setActiveTab(value);
  };

  const addVideoSrc = (value: string) => {
    setVideosrc(value);
  };

  useEffect(() => {
    setLocalStorage({ data, file, threshold });
  }, [data, file, threshold, videosrc]);

  return (
    <PlateNumberContext.Provider
      value={{
        data,
        file,
        threshold,
        videosrc,
        showCropDialog,
        active,
        addPlatenumber,
        addFile,
        addThreshold,
        addVideoSrc,
        setShowCrop,
        setActive,
      }}
    >
      {children}
    </PlateNumberContext.Provider>
  );
};

export default ContextProvider;
