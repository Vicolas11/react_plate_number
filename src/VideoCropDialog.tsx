import { FC, useEffect, useState, useCallback, useContext } from "react";
import CloseIcon from "@mui/icons-material/HighlightOffOutlined";
import { toastStyle, useStylesCropBtn } from "./mui.styles";
import LoadingButton from "@mui/lab/LoadingButton";
import { Button, Slider } from "@material-ui/core";
import toast, { Toaster } from "react-hot-toast";
import { Area, IVideoCroper } from "./datatypes";
import { UploadFile } from "@mui/icons-material";
import { PlateNumberContext } from "./store";
import getCroppedImg from "./cropVideos";
import Cropper from "react-easy-crop";
import "./App.css";

const VideoCropDialog: FC<IVideoCroper> = ({ videoSrc, onCancel }) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cropAreaPxl, setCropAreaPxl] = useState<Area>();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const ctx = useContext(PlateNumberContext);
  const { addPlatenumber, addFile, addThreshold, setShowCrop, setActive } = ctx;
  const [rotate, setRotate] = useState(1);
  const [zoom, setZoom] = useState(1);
  const classes = useStylesCropBtn();

  const onCropComplete = useCallback((_: Area, cropPixel: Area) => {
    setCropAreaPxl(cropPixel);
  }, []);

  const onUpload = async () => {
    setIsLoading(true);
    try {
      const res: any = await getCroppedImg(videoSrc, cropAreaPxl);
      toast.success(`${res.message}`, toastStyle);
      addPlatenumber(res.data);
      addFile(res.file);
      addThreshold(res.threshold);
      // Close VideoCropDialog when successully
      if (res.status === 201) {
        setActive(true);
        setShowCrop(false);
      }
    } catch (err: any) {
      // console.log(err);
      toast.error(`${err.message}`, toastStyle);
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    videoSrc !== "" && setIsDisabled(false);
  }, []);

  const onChangeHandler = (_: any, value: any) => {
    setZoom(value);
  };

  const onChangeRotate = (_: any, value: any) => {
    setRotate(value);
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="backdrop"></div>
      <div className="container">
        <div className="crop-container">
          <Cropper
            image={videoSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotate}
            aspect={4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotate}
            mediaProps={{ controls: true }}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="controls">
          <div className="slider-container">
            <div className="zoom">
              <h3 className="text-white font-bold">Zoom</h3>
              <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                color="primary"
                valueLabelDisplay="auto"
                aria-label="Temperature"
                onChange={onChangeHandler}
              />
            </div>
            <div className="rotate">
              <h3 className="text-white font-bold">Rotate</h3>
              <Slider
                value={rotate}
                min={0}
                max={360}
                step={0.1}
                color="primary"
                aria-label="Temperature"
                onChange={onChangeRotate}
              />
            </div>
          </div>
          <div className="button-container">
            <Button
              variant="contained"
              onClick={onCancel}
              color="primary"
              startIcon={<CloseIcon />}
            >
              Close
            </Button>
            <LoadingButton
              onClick={onUpload}
              loading={isLoading}
              disabled={isDisabled}
              loadingPosition="start"
              startIcon={<UploadFile />}
              variant="contained"
              classes={{
                root: classes.root,
                contained: classes.contained,
                disabled: classes.disabled,
              }}
            >
              {isLoading ? "Loading" : "Upload"}
            </LoadingButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoCropDialog;
