import type React from "react";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import FeedCard from "./FeedCard";
import BottomBarItems from "./BottomBarItems";

const fakeImageSearchAPI = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _image: string
): Promise<{ imageSrc: string; text: string }[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          imageSrc: "https://picsum.photos/400/200?random=21",
          text: "Result based on cropped image #1",
        },
        {
          imageSrc: "https://picsum.photos/400/200?random=22",
          text: "Result based on cropped image #2",
        },
        {
          imageSrc: "https://picsum.photos/400/200?random=23",
          text: "Result based on cropped image #3",
        },
      ]);
    }, 1000);
  });
};

type CameraSearchInputProps = {
  croppedImage: string;
};

const CameraSearchInput: React.FC<CameraSearchInputProps> = ({
  croppedImage,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState<{ imageSrc: string; text: string }[]>(
    []
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (croppedImage) {
      fakeImageSearchAPI(croppedImage).then((data) => {
        setResults(data);
      });
    }
  }, [croppedImage]);

  return (
    <div className="relative w-full mx-auto mt-[50vh] bg-white">
      <div className={`relative`}>
        <span className="absolute inset-y-0 left-0 flex items-center pl-4">
          <FontAwesomeIcon icon={faSearch} className="text-gray-600" />
          {croppedImage ? (
            <img
              src={croppedImage}
              alt="Preview"
              className="w-8 h-8 mx-2 rounded"
            />
          ) : null}
        </span>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          placeholder="Search"
          className={`w-full border-gray-300 bg-white text-black ${
            croppedImage ? "pl-20" : "pl-10"
          } pr-16 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>

      {results.length > 0 && (
        <div className="space-y-4 my-3 scrollbar-hide">
          {results.map((data, index) => (
            <FeedCard key={index} imageSrc={data.imageSrc} text={data.text} />
          ))}
        </div>
      )}
      <BottomBarItems />
    </div>
  );
};

export default CameraSearchInput;
