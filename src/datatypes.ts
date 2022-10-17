export interface IVideoCroper {
  videoSrc: string;
  onCancel: () => void;
}

export type Area = {
  x: number; // x/y are the coordinates of the top/left corner of the cropped area
  y: number;
  width: number; // width of the cropped area
  height: number; // height of the cropped area
};

export type Dimen = {
  w: number;
  h: number;
};

export interface ISelectType {
  file: File | null;
  blobData: any;
}

export type ErrorType = {
  message: string;
  status: number;
};

export type ContxtType = {
  platenumber: string | null;
  file: string | null;
  threshold: string | null;
  videosrc: string | null;
  showCropDialog: boolean;
  active: boolean;
  addPlatenumber: (value: string) => void;
  addFile: (value: string) => void;
  addThreshold: (value: string) => void;
  addVideoSrc: (value: string) => void;
  setShowCrop: (value: boolean) => void;
  setActive: (value: boolean) => void;
};

export interface IConstant {
  domain: string;
  env: string;
  dev: boolean;
  prod: boolean;
  test: boolean;
}

export interface IStorage {
  platenumber: string | null;
  file: string | null;
  threshold: string | null;
}

export type VideoType = {
  videosrc: string | null;
};
