import { VideoType } from "./datatypes";
import { forwardRef } from "react";

const VideoComponent = forwardRef<HTMLVideoElement, VideoType>(
  ({ videosrc }, ref) => {
    return (
      <video
        ref={ref}
        muted
        playsInline
        className="w-full max-w-full h-[90%]"
        src={videosrc ? videosrc : ""}
        controls
        poster="images/video-thumb.png"
        autoPlay
        loop
      ></video>
    );
  }
);

export default VideoComponent;
