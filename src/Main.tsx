import {
  ChangeEvent,
  FC,
  useRef,
  useState,
  MouseEvent,
  useContext,
  useEffect,
} from "react";
import PanoramaOutlinedIcon from "@mui/icons-material/PanoramaOutlined";
import MonochromePhotosIcon from "@mui/icons-material/MonochromePhotos";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { ScreenshotMonitorRounded } from "@mui/icons-material";
import { clearDB, getDB, setDB } from "./utils/indexdb.utils";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import arrayBufferToBlob from "./utils/arraybuff2buff.util";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import ToggleButton from "@material-ui/lab/ToggleButton";
import PanoramaIcon from "@mui/icons-material/Panorama";
import { toastStyle, useStyles } from "./mui.styles";
import captureVideoFrame from "./capturevideoframe";
import toast, { Toaster } from "react-hot-toast";
import VideoCropDialog from "./VideoCropDialog";
import Tooltip from "@material-ui/core/Tooltip";
import { PlateNumberContext } from "./store";
import { Button } from "@material-ui/core";
import VideoComponent from "./Video";
import "./Main.css";

const Main: FC = () => {
  const [resetDisabled, setRestDisabled] = useState<boolean>(true);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [toggleImg, settoggleImg] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [alignment, setAlignment] = useState("left");
  const [imgUrl, setImgUrl] = useState<string>("");
  const ctx = useContext(PlateNumberContext);
  const classes = useStyles();
  const {
    data,
    file,
    threshold,
    showCropDialog,
    setShowCrop,
    active,
    videosrc,
    addVideoSrc,
    addPlatenumber,
    addFile,
    addThreshold,
  } = ctx;
  const domain = "http://localhost:5000/";

  const onChangeHandler = async (evt: ChangeEvent<HTMLInputElement>) => {
    const videoFile = evt.target.files;
    if (videoFile !== null) {
      const videosrc = URL.createObjectURL(videoFile[0]);
      addVideoSrc(videosrc);
      setDB(videoFile[0]);
      // Toast Error if not video file
      const fileType = videoFile[0].type.split("/")[0];
      if (fileType !== "video") {
        toast.error("Unsupport file format!", toastStyle);
        return;
      }
      setIsDisabled(fileType !== "video");
    }
  };

  const onCapture = () => {
    videoRef.current === null &&
      toast.error("Error occured while capturing!", toastStyle);
    // Pause video
    videoRef.current?.pause();
    const result = captureVideoFrame(videoRef.current, "jpeg");
    if (!result) return;
    const { dataUri } = result;
    setImgUrl(dataUri);
    setShowCrop(true);
  };

  const onCancel = () => {
    setShowCrop(false);
    // Play video
    videoRef.current?.play();
  };

  const onReset = async () => {
    await clearDB()
      .then(() => {
        localStorage.clear();
        addPlatenumber({ owner: "", platenum: "", model: "", date: "" });
        addFile("");
        addThreshold("");
        addVideoSrc("");
        setRestDisabled(true);
        setIsDisabled(true);
        if (videoRef.current) videoRef.current.src = "";
        toast.success("Reset Successfully!", toastStyle);
      })
      .catch((err) => console.log("ERR", err));
  };

  const handleChange = (
    event: MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setAlignment(newAlignment);
    settoggleImg((prev) => !prev);
  };

  useEffect(() => {
    // Trigger Result Button
    active && buttonRef.current && buttonRef.current?.click();
    const getValue = async () => {
      const value = await getDB();
      console.log(value);
      if (value !== undefined) {
        const blob = arrayBufferToBlob(value);
        if (videoRef.current) {
          videoRef.current.src = URL.createObjectURL(blob);
        }
        setRestDisabled(false);
        setIsDisabled(false);
      }
    };
    getValue();
    console.log(videosrc);
    videosrc && setIsDisabled(false);
  }, [active, videosrc, data, file, threshold]);

  return (
    <>
      {showCropDialog && (
        <VideoCropDialog videoSrc={imgUrl} onCancel={onCancel} />
      )}
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex flex-col lg:flex-row items-center p-6 md:p-12 space-y-8 lg:space-y-0 md:h-screen">
        {/* LEFT SIDE */}
        <div className="w-full lg:w-1/2 text-white lg:mr-8">
          <div>
            <h2 className="text-5xl lg:text-6xl text-gray-100 font-bold mb-2">
              Automatic Plate Number Recognition System
            </h2>
            <p className="text-2xl">
              A system that recognises a plate number from a video
            </p>
          </div>
        </div>
        {/* RIGHT SIDE */}
        <div className="w-full lg:w-1/2 shadow-lg">
          <div className="mb-4 bg-gray-50 rounded-lg dark:bg-gray-800">
            <ul
              className="flex flex-wrap -mb-px text-sm font-medium text-center"
              id="myTab"
              data-tabs-toggle="#myTabContent"
              role="tablist"
            >
              <li className="mr-2" role="presentation">
                <button
                  className="font-bold inline-block p-4 rounded-t-lg border-b-2"
                  id="upload-tab"
                  data-tabs-target="#upload"
                  type="button"
                  role="tab"
                  aria-controls="upload"
                  aria-selected="false"
                >
                  Upload Video
                </button>
              </li>
              <li className="mr-2" role="presentation">
                <button
                  className="font-bold inline-block p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  id="result-tab"
                  data-tabs-target="#result"
                  type="button"
                  role="tab"
                  aria-controls="result"
                  ref={buttonRef}
                  aria-selected="false"
                >
                  Result
                </button>
              </li>
            </ul>
          </div>

          <div id="myTabContent">
            {/* VIDEO UPLOAD TAB */}
            <div
              className="p-4 bg-gray-50 h-[50vh] md:h-[65vh] rounded-lg dark:bg-gray-800"
              id="upload"
              role="tabpanel"
              aria-labelledby="upload-tab"
            >
              <VideoComponent ref={videoRef} videosrc={videosrc} />
              <div className="my-2 flex flex-row justify-between">
                <div className="space-x-1 md:space-x-3">
                  <input
                    id="videoFile"
                    type="file"
                    accept="video/*"
                    onChange={onChangeHandler}
                    hidden
                  />
                  <Tooltip title="Click to select video file">
                    <Button
                      variant="contained"
                      color="default"
                      size="small"
                      startIcon={<VideoFileIcon />}
                    >
                      <label
                        htmlFor="videoFile"
                        className="p-0 m-0 font-bold text-gray-900"
                      >
                        Choose
                      </label>
                    </Button>
                  </Tooltip>
                  <Button
                    variant="contained"
                    color="default"
                    size="small"
                    disabled={isDisabled}
                    onClick={onCapture}
                    startIcon={<ScreenshotMonitorRounded />}
                  >
                    Capture
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="default"
                    disabled={resetDisabled}
                    size="small"
                    onClick={onReset}
                    startIcon={<RestartAltIcon />}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
            {/* RESULT TAB */}
            <div
              className="relative hidden p-4 h-[50vh] md:h-[65vh] bg-gray-50 rounded-lg dark:bg-gray-800"
              id="result"
              role="tabpanel"
              aria-labelledby="result-tab"
            >
              <div className="absolute top-0 right-0 mt-2 mr-2 bg-gray-600 rounded-lg shadow-sm">
                {file && threshold && (
                  <ToggleButtonGroup
                    size="small"
                    value={alignment}
                    exclusive
                    onChange={handleChange}
                  >
                    <ToggleButton
                      value="left"
                      classes={{
                        root: classes.root,
                        selected: classes.selected,
                      }}
                    >
                      <PanoramaIcon fontSize="small" color="action" />
                    </ToggleButton>
                    <ToggleButton
                      value="center"
                      classes={{
                        root: classes.root,
                        selected: classes.selected,
                      }}
                    >
                      <MonochromePhotosIcon fontSize="small" color="action" />
                    </ToggleButton>
                  </ToggleButtonGroup>
                )}
              </div>

              <div className="flex justify-center mb-4">
                {file && threshold ? (
                  <img
                    src={
                      toggleImg ? `${domain}${file}` : `${domain}${threshold}`
                    }
                    className="w-[80%] h-[300px] rounded-lg"
                    alt=""
                  />
                ) : (
                  <PanoramaOutlinedIcon
                    color="disabled"
                    sx={{ fontSize: 300 }}
                  />
                )}
              </div>
              <div className="my-2">
                <div
                  className={`flex flex-row border-2 border-gray-500 w-full h-[50%] p-4 rounded-xl relative  ${
                    data?.platenum ? "text-gray-200" : "text-gray-500"
                  }`}
                >
                  <p className="absolute top-[-.8rem] bg-[#1f2937] inset-0 w-fit h-fit px-2 mx-auto text-gray-400 font-bold">
                    {data?.owner ? 'REGISTERED' : 'NOT REGISTERED'}
                  </p>
                  <div className="flex w-1/2 items-end font-bold text-gray-400 space-y-2 space-x-3">
                    <div className="">
                      <h1>OWNER:</h1>
                      <h1>NUMBER:</h1>
                    </div>
                    <div className="">
                      <h1>{data?.owner ? data.owner : "########"}</h1>
                      <h1>{data?.platenum ? data.platenum : "########"}</h1>
                    </div>
                  </div>
                  <div className="flex w-1/2 items-end font-bold text-gray-400 space-y-2 space-x-3">
                    <div className="">
                      <h1>MODEL:</h1>
                      <h1>DATE:</h1>
                    </div>
                    <div className="">
                      <h1>{data?.model ? data.model : "########"}</h1>
                      <h1>{data?.date ? data.date : "########"}</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
