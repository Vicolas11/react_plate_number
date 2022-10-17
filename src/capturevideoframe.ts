const captureVideoFrame = ( video: any, format: "jpeg" | "png", quality = 0.9 ) => {
    if (typeof video === 'string') {
        video = document.getElementById(video);
    }
  format = format || "jpeg";
  quality = quality || 0.92;

  if (!video || (format !== "png" && format !== "jpeg")) {
    return false;
  }

  var canvas: HTMLCanvasElement = document.createElement("canvas");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  var context = canvas.getContext("2d") as CanvasRenderingContext2D;
  context.drawImage(video, 0, 0);

  var dataUri: string = canvas.toDataURL("image/" + format, quality);
  var data = dataUri.split(",")[1];
  var mimeType = dataUri.split(";")[0].slice(5);

  var bytes = window.atob(data);
  var buf = new ArrayBuffer(bytes.length);
  var arr = new Uint8Array(buf);

  for (var i = 0; i < bytes.length; i++) {
    arr[i] = bytes.charCodeAt(i);
  }

  var blob: Blob = new Blob([arr], { type: mimeType });
  return { blob, dataUri, format };
};

export default captureVideoFrame;
