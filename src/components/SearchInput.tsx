"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faMicrophone,
  faQrcode,
  faArrowLeft,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import CameraView from "./CameraView";
import CameraSearchInput from "./CameraSearchInput";

type SearchInputProps = {
  onFocusChange: (isFocused: boolean) => void;
};

const SearchInput: React.FC<SearchInputProps> = ({ onFocusChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const recentSearches = [
    "sleeveless gilet jacket men india",
    "sequins skirt less than 2000",
    "cut out bodysuit india",
    "floral crop top",
    "black leather skirt with button",
    "neon shirt",
    "oversized women's leather jacket india",
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
        onFocusChange(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (isListening) {
        SpeechRecognition.stop();
        SpeechRecognition.removeAllListeners();
      }
    };
  }, [onFocusChange, isListening]);

  const handleFocus = () => {
    setIsFocused(true);
    onFocusChange(true);
  };

  const handleMicrophoneClick = async () => {
    try {
      if (isListening) {
        setIsListening(false);
        await SpeechRecognition.stop();
      } else {
        const speechPermission = await SpeechRecognition.requestPermissions();

        if (speechPermission.speechRecognition === "granted") {
          setIsListening(true);

          // Set up the listener for partial results
          SpeechRecognition.addListener("partialResults", (data) => {
            if (data.matches && data.matches.length > 0) {
              setInputValue(data.matches[0]);
            }
          });

          // Start speech recognition with partial results enabled
          await SpeechRecognition.start({
            language: "en-US",
            partialResults: true,
            popup: false,
          });
        } else {
          console.error("Speech recognition permission not granted");
        }
      }
    } catch (error) {
      console.error("Error with speech recognition:", error);
      setIsListening(false);
    }
  };

  const startCamera = () => {
    setIsFocused(false);
    onFocusChange(true);
    setIsCameraActive(true);
  };

  const stopCamera = () => {
    setIsCameraActive(false);
  };

  if (isCameraActive) {
    return (
      <>
        <CameraView onCroppedImage={setCroppedImage} onClose={stopCamera} />
        {croppedImage && <CameraSearchInput croppedImage={croppedImage} />}
      </>
    );
  }

  return (
    <div className="relative w-full mx-auto">
      <div
        className={`relative ${isCameraActive ? "mt-auto" : ""} ${
          isFocused ? "z-20" : ""
        }`}
      >
        {isFocused ? (
          <span className="absolute inset-y-0 left-0 flex items-center pl-4">
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="text-gray-600 cursor-pointer"
              onClick={() => {
                setIsFocused(false);
                onFocusChange(false);
              }}
            />
          </span>
        ) : (
          <span className="absolute inset-y-0 left-0 flex items-center pl-4">
            <FontAwesomeIcon icon={faSearch} className="text-gray-600" />
            {croppedImage ? (
              <img src={croppedImage} alt="Preview" className="w-8 h-8 mx-2" />
            ) : null}
          </span>
        )}

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          placeholder={isFocused ? "Search or type URL" : "Search"}
          className={`w-full ${
            croppedImage ? "pl-20" : "pl-10"
          } pr-16 py-2 border ${
            isFocused
              ? "border-transparent bg-white text-black"
              : "border-gray-300 bg-white text-black"
          } rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          onFocus={handleFocus}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <div className="absolute inset-y-0 right-0 flex items-center space-x-4 pr-5">
          <FontAwesomeIcon
            icon={faMicrophone}
            className={`${
              isListening ? "text-red-600" : "text-gray-600"
            } hover:text-gray-800 cursor-pointer`}
            onClick={handleMicrophoneClick}
          />
          <FontAwesomeIcon
            icon={faQrcode}
            className={`text-gray-600 hover:text-gray-800 cursor-pointer`}
            onClick={startCamera}
          />
        </div>
      </div>

      {isFocused && !croppedImage && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-10 overflow-hidden"
        >
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
            <span className="text-gray-800 text-sm font-medium">
              Recent searches
            </span>
            <span className="text-blue-500 text-sm font-medium cursor-pointer">
              Manage history
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {recentSearches.map((search, index) => (
              <div
                key={index}
                className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={faClock}
                  className="text-gray-600 mr-4"
                />
                <span className="text-gray-800 text-sm">{search}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
