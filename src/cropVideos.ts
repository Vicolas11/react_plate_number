import axios from "axios";

const createImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });
};

const getRadianAngle = (degreeValue: any) => {
  return (degreeValue * Math.PI) / 180;
};

// Sent file to the backend
const uploadFile = async (blob: Blob, format: string) => {
  let error = { status: 0, message: "" };
  let success = { status: 0, message: "", platenumber: "" };
  const formData = new FormData();
  formData.append("file", blob, `platenumber.${format}`);
  const url = "http://127.0.0.1:5000/file_upload";

  return new Promise((resolve, reject) => {
    axios
      .post(url, formData, {
        headers: {
          "Content-Type": "application/multipart/form-data; charset=UTF-8",
        },
      })
      .then((res) => {
        // console.log("RES == ", res);
        success = {
          message: res.data.message || "Uploaded successfully!",
          status: res.status || 201,
          platenumber: res.data.platenumber
        };
        resolve(success);
      })
      .catch((err) => {
        console.log("ERR == ", err);
        const errResp = err.response;
        let non404 = errResp.status === 404 && "API Not Found!";

        error = {
          message: non404 || errResp.statusText || "An error occurred!",
          status: errResp.status || 500,
        };
        reject(error);
      });
  });
};

/**
 * This const was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 * @param {File} image - Image File url
 * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
 * @param {number} rotation - optional rotation parameter
 */

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: any,
  rotation = 0
) => {
  const image: HTMLImageElement = await createImage(imageSrc);
  const canvas: HTMLCanvasElement = document.createElement("canvas");
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  // set each dimensions to double largest dimension to allow for a safe area for the
  // image to rotate in without being clipped by canvas context
  canvas.width = safeArea;
  canvas.height = safeArea;

  // translate canvas context to a central location on image to allow rotating around the center.
  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate(getRadianAngle(rotation));
  ctx.translate(-safeArea / 2, -safeArea / 2);

  // draw rotated image and store data.
  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );
  const data: ImageData = ctx.getImageData(0, 0, safeArea, safeArea);

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image with correct offsets for x,y crop values.
  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
  );

  // As Base64 string
  // let cv = canvas.toDataURL("image/jpeg");
  // let blob = dataURItoBlob(cv);
  // return URL.createObjectURL(blob);

  // Save to file
  //   const savePath = path.join(__dirname, "..", "public/cropped_img/file.jpg");
  //   console.log(__dirname);
  //   console.log(canvas.toDataURL("image/jpeg"));
  // fs.writeFile(savePath, canvas.toDataURL("image/jpeg"), (err) => {
  //   console.log("ERROR===", err);
  // });

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        // const preveiwUrl = URL.createObjectURL(blob);
        // const anchor: HTMLAnchorElement = document.createElement("a");
        // anchor.download = "image.jpeg";
        // anchor.href = URL.createObjectURL(blob);
        // anchor.click();
        // URL.revokeObjectURL(preveiwUrl);
        uploadFile(blob, "jpg")
          .then((res) => {
            resolve(res);
          })
          .catch((err) => reject(err));
      },
      "image/jpeg",
      0.95
    );
  });
};

export default getCroppedImg;
