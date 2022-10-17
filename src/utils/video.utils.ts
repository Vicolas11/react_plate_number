const videoBlob = async (blob: Blob): Promise<string> =>  {
  const buf = await blob.arrayBuffer();
  const vidsrc = URL.createObjectURL(new Blob([buf]));
  return vidsrc;
};

export default videoBlob;
