const arrayBufferToBlob = (buffer: ArrayBuffer): Blob => {
  return new Blob([buffer], { type: "video/mp4" });
};

export default arrayBufferToBlob;
