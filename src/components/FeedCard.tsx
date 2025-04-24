import React from "react";

type FeedCardProps = {
  imageSrc: string;
  text: string;
};

const FeedCard: React.FC<FeedCardProps> = ({ imageSrc, text }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md">
      <div className="relative">
        <div className="w-full h-48 bg-gray-200 relative overflow-hidden">
          <img
            src={imageSrc}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 text-gray-900 bg-white bg-opacity-75">
          <p className="text-sm">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;