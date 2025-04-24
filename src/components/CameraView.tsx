import type React from "react";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisH,
  faBolt,
  faChevronLeft,
  faHistory,
  faSearch,
  faUniversity,
  faLanguage,
  faClone,
} from "@fortawesome/free-solid-svg-icons";
import { Rnd } from "react-rnd";
import {
  Camera,
  CameraResultType,
  CameraSource,
  type CameraPermissionState,
} from "@capacitor/camera";
import { CapacitorFlash } from "@capgo/capacitor-flash";

interface CameraViewProps {
  onClose: () => void;
  onCroppedImage: (image: string) => void;
}

type FacingMode = "user" | "environment";
type LensMode = "Translate" | "Search" | "Homework";

const CameraView: React.FC<CameraViewProps> = ({ onClose, onCroppedImage }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraContainerRef = useRef<HTMLDivElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<
    CameraPermissionState | undefined
  >(undefined);
  const [flashAvailable, setFlashAvailable] = useState(true);

  const [facingMode, setFacingMode] = useState<FacingMode>("environment");

  const [currentMode, setCurrentMode] = useState<LensMode>("Search");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const [cropPosition, setCropPosition] = useState({ x: 80, y: 150 });
  const [cropSize, setCropSize] = useState({ width: 220, height: 220 });

  const startCamera = async (mode: FacingMode = facingMode) => {
    setIsLoading(true);
    setError(null);
    setIsCameraReady(false);

    try {
      const status = await Camera.checkPermissions();
      if (status.camera !== "granted") {
        const permission = await Camera.requestPermissions();
        setPermissionStatus(permission.camera);
        if (permission.camera !== "granted") {
          setError("Camera permission denied.");
          setIsLoading(false);
          return;
        }
      }
      setPermissionStatus("granted");

      const constraints: MediaStreamConstraints = {
        video: { facingMode: mode },
        audio: false,
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setIsCameraReady(true);
      setIsLoading(false);
    } catch (err: unknown) {
      setIsLoading(false);
      setIsCameraReady(false);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Failed to start camera: ${errorMessage}`);
    }
  };

  const checkFlashlightAvailability = async () => {
    const isAvailable = await CapacitorFlash.isAvailable();
    setFlashAvailable(isAvailable.value);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraReady(false);
  };

  useEffect(() => {
    startCamera(facingMode);
    checkFlashlightAvailability();
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  const capturePhoto = async () => {
    if (!isCameraReady || !videoRef.current) {
      setError("Camera not ready.");
      return;
    }

    setError(null);

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataURL = canvas.toDataURL("image/png");
    setCapturedImage(imageDataURL);
    ctx?.drawImage(
      video,
      cropPosition.x,
      cropPosition.y,
      cropSize.width,
      cropSize.height,
      0,
      0,
      cropSize.width,
      cropSize.height
    );
    const croppedDataUrl = canvas.toDataURL("image/png");
    onCroppedImage(croppedDataUrl);
  };

  const toggleTorch = () => {
    (async () => {
      try {
        await CapacitorFlash.toggle();
      } catch (error) {
        console.error("Error toggling the torch:", error);
      }
    })();
  };

  const switchCamera = () => {
    stopCamera();
    setFacingMode((prevMode) =>
      prevMode === "environment" ? "user" : "environment"
    );
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  const cropCapturedImage = () => {
    if (!capturedImage) return null;

    const image = new Image();
    image.src = capturedImage;

    return new Promise<string | null>((resolve) => {
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = cropSize.width;
        canvas.height = cropSize.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);

        ctx.drawImage(
          image,
          cropPosition.x,
          cropPosition.y,
          cropSize.width,
          cropSize.height,
          0,
          0,
          cropSize.width,
          cropSize.height
        );

        const croppedDataUrl = canvas.toDataURL("image/png");
        onCroppedImage(croppedDataUrl);
        resolve(croppedDataUrl);
      };
    });
  };

  const showControls = isCameraReady && !isLoading && !error;
  const showTorchButton = showControls && flashAvailable;

  const handleGalleryPick = async () => {
    try {
      const image = await Camera.getPhoto({
        source: CameraSource.Photos,
        resultType: CameraResultType.DataUrl,
      });
      setCapturedImage(image.dataUrl || null);
    } catch (e) {
      console.error("Gallery pick failed", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {capturedImage ? (
        <div className="relative flex-1 flex items-center justify-center">
          <div className="relative w-screen h-[50vh] mb-auto">
            <img
              src={capturedImage}
              alt="Captured"
              className="absolute inset-0 object-cover w-full h-full"
            />

            <Rnd
              bounds="parent"
              size={cropSize}
              position={cropPosition}
              onDragStop={(_e, d) => {
                setCropPosition({ x: d.x, y: d.y });
                cropCapturedImage();
              }}
              onResizeStop={(_e, _direction, ref, _delta, position) => {
                setCropSize({
                  width: parseInt(ref.style.width),
                  height: parseInt(ref.style.height),
                });
                setCropPosition(position);
                cropCapturedImage();
              }}
              className="z-20 border-2 border-white bg-transparent"
            ></Rnd>
          </div>
        </div>
      ) : (
        <>
          <div
            id="camera-container"
            ref={cameraContainerRef}
            className="absolute inset-0 z-0 overflow-hidden mb-15 rounded-b-2xl"
          >
            <video
              className="size-full object-cover"
              ref={videoRef}
              autoPlay
              playsInline
            />
          </div>
          <div className="relative z-10 flex flex-col h-full px-5 text-white">
            <div className="flex items-center justify-between px-2 py-3 bg-transparent">
              <div className="flex items-center space-x-10">
                <button
                  onClick={handleClose}
                  aria-label="Close camera view"
                  className="!bg-transparent"
                >
                  <FontAwesomeIcon icon={faChevronLeft} size="lg" />
                </button>
                <button
                  disabled={showTorchButton}
                  onClick={toggleTorch}
                  className="!bg-transparent"
                >
                  <FontAwesomeIcon icon={faBolt} size="lg" />
                </button>
              </div>
              <div className="text-lg font-medium">
                <span className="font-bold">Google</span> Lens
              </div>
              <div className="flex items-center space-x-10">
                {showControls && (
                  <button onClick={switchCamera} className="!bg-transparent">
                    <FontAwesomeIcon icon={faHistory} size="lg" />
                  </button>
                )}
                <button className="!bg-transparent">
                  <FontAwesomeIcon icon={faEllipsisH} size="lg" />
                </button>
              </div>
            </div>

            {/* Loading/Error/Permission Overlay */}
            {(isLoading ||
              error ||
              (!isLoading &&
                permissionStatus &&
                permissionStatus !== "granted")) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
                <div className="text-center p-4">
                  {isLoading && (
                    <div className="w-12 h-12 border-4 border-t-blue-500 border-neutral-600 rounded-full animate-spin mx-auto mb-4"></div>
                  )}
                  {error && (
                    <p className="text-red-400 font-semibold mb-2">Error</p>
                  )}
                  <p>
                    {error ||
                      (isLoading
                        ? `Starting camera (${facingMode})...`
                        : permissionStatus === "denied"
                        ? "Camera permission denied."
                        : permissionStatus === "prompt" ||
                          permissionStatus === "prompt-with-rationale"
                        ? "Waiting for camera permission..."
                        : "Initializing...")}
                  </p>
                  {error && !error.toLowerCase().includes("permission") && (
                    <p className="mt-2 text-sm">Please try again.</p>
                  )}
                  {permissionStatus === "denied" && (
                    <p className="mt-2 text-sm">
                      Please grant camera permission in your app settings.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Spacer to push controls to bottom */}
            <div className="flex-1 flex items-center justify-center relative">
              <div className="relative w-80 h-70">
                {/* Top Left Rounded Corner */}
                <div className="absolute top-0 left-0 w-15 h-15 border-t-2 border-l-2 border-white rounded-tl-4xl" />

                {/* Top Right Rounded Corner */}
                <div className="absolute top-0 right-0 w-15 h-15 border-t-2 border-r-2 border-white rounded-tr-4xl" />

                {/* Bottom Left Rounded Corner */}
                <div className="absolute bottom-0 left-0 w-15 h-15 border-b-2 border-l-2 border-white rounded-bl-4xl" />

                {/* Bottom Right Rounded Corner */}
                <div className="absolute bottom-0 right-0 w-15 h-15 border-b-2 border-r-2 border-white rounded-br-4xl" />
              </div>
            </div>

            {/* Bottom Controls Area (only show when ready) */}
            {showControls && !capturedImage && (
              <div className="bg-transparent relative z-10">
                {/* Capture Controls Row */}
                <div className="py-6 text-white flex justify-center items-center space-x-10">
                  <button
                    onClick={handleGalleryPick}
                    className="!bg-transparent"
                  >
                    <FontAwesomeIcon icon={faClone} size="lg" />
                  </button>
                  <button
                    onClick={capturePhoto}
                    className="w-20 h-20 rounded-full bg-white border-4 border-gray-400 flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faSearch} color="gray" />
                  </button>
                </div>

                {/* Mode Tabs Row */}
                <div className="flex bg-white justify-center space-x-4 px-4 py-3">
                  {(["Translate", "Search", "Homework"] as LensMode[]).map(
                    (mode) => (
                      <button
                        key={mode}
                        className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ${
                          currentMode !== mode
                            ? "bg-gray-100 text-black"
                            : "text-white bg-gray-700 hover:bg-gray-600"
                        }`}
                        onClick={() => setCurrentMode(mode)}
                      >
                        <FontAwesomeIcon
                          icon={
                            mode === "Search"
                              ? faSearch
                              : mode === "Translate"
                              ? faLanguage
                              : faUniversity
                          }
                          className="mr-2 text-base"
                        />

                        <span>{mode}</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Fallback Message if controls aren't shown but not loading/error */}
            {!showControls &&
              !isLoading &&
              !error &&
              permissionStatus === "granted" && (
                <div className="absolute inset-0 flex items-center justify-center bg-transparent z-20 pointer-events-none">
                  <div className="text-white text-center p-4">
                    <p>Camera initializing or not available.</p>
                  </div>
                </div>
              )}
          </div>
        </>
      )}

      {/* UI Overlay Container */}
    </div>
  );
};

export default CameraView;
