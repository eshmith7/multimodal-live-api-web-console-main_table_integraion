/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/
import React, {
  useRef,
  useEffect,
  useState,
  RefObject,
  ReactNode,
} from "react";
import { useWebcam } from "../../hooks/use-webcam";
import { useScreenCapture } from "../../hooks/use-screen-capture";
import { useLiveAPI } from "../../contexts/LiveAPIContext";
import { AudioRecorder } from "../../lib/audio-recorder";
import "./control-tray.scss";

interface ControlTrayProps {
  videoRef: RefObject<HTMLVideoElement>;
  children?: ReactNode;
  onVideoStreamChange?: (stream: MediaStream | null) => void;
  supportsVideo?: boolean;
}

function ControlTray({
  videoRef,
  children,
  onVideoStreamChange = () => {},
  supportsVideo,
}: ControlTrayProps) {
  const videoStreams = [useWebcam(), useScreenCapture()];
  const [activeVideoStream, setActiveVideoStream] = useState<MediaStream | null>(
    null
  );
  const [webcam, screenCapture] = videoStreams;
  const [inVolume, setInVolume] = useState(0);
  const [muted, setMuted] = useState(false);
  const audioRecorder = useRef(new AudioRecorder());
  const renderCanvasRef = useRef<HTMLCanvasElement>(null);
  const connectButtonRef = useRef<HTMLButtonElement>(null);


  const { handleAIQuery } = useLiveAPI();

  useEffect(() => {
    if (connectButtonRef.current) {
      connectButtonRef.current.focus();
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--volume",
      `${Math.max(5, Math.min(inVolume * 200, 8))}px`
    );
  }, [inVolume]);

  // Handle video stream changes
  // const toggleVideoStream = () => {
  //   if (activeVideoStream === webcam) {
  //     setActiveVideoStream(screenCapture);
  //     onVideoStreamChange(screenCapture);
  //   } else {
  //     setActiveVideoStream(webcam);
  //     onVideoStreamChange(webcam);
  //   }
  // };
  const toggleVideoStream = () => {
    if (activeVideoStream === webcam.stream) {
      setActiveVideoStream(screenCapture.stream);
      onVideoStreamChange(screenCapture.stream);
    } else {
      setActiveVideoStream(webcam.stream);
      onVideoStreamChange(webcam.stream);
    }
  };
  


  const queryHandler = () => {
    handleAIQuery("Show logs"); 
  };

  return (
    <div className="control-tray">
      <button ref={connectButtonRef} onClick={queryHandler}>
        Query AI
      </button>
      {supportsVideo && (
        <button onClick={toggleVideoStream}>
          Toggle Video Stream
        </button>
      )}
      {children}
    </div>
  );
}

export default React.memo(ControlTray);

