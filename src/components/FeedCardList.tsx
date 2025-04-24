import React from "react";
import FeedCard from "./FeedCard";

const FeedCardList: React.FC = () => {
  const dummyData = [
    {
      imageSrc: "https://picsum.photos/400/200?random=1",
      text: "This superstar was Ratan Tata's closest friend, shared same room, went for picnics, listened songs together...",
    },
    {
      imageSrc: "https://picsum.photos/400/200?random=2",
      text: "Another interesting story about a famous personality and their adventures...",
    },
    {
      imageSrc: "https://picsum.photos/400/200?random=3",
      text: "Discover the untold stories of these remarkable individuals...",
    },
    {
      imageSrc: "https://picsum.photos/400/200?random=4",
      text: "A journey through the life of a legend, filled with challenges and triumphs.",
    },
    {
      imageSrc: "https://picsum.photos/400/200?random=5",
      text: "The incredible tale of a visionary who changed the world with their ideas.",
    },
    {
      imageSrc: "https://picsum.photos/400/200?random=6",
      text: "An inspiring story of perseverance and success against all odds.",
    },
    {
      imageSrc: "https://picsum.photos/400/200?random=7",
      text: "Exploring the fascinating life of a cultural icon and their impact on society.",
    },
    {
      imageSrc: "https://picsum.photos/400/200?random=8",
      text: "The captivating adventures of a trailblazer who broke new ground.",
    },
  ];

  return (
    <div className="space-y-4 my-3 scrollbar-hide">
      {dummyData.map((data, index) => (
        <FeedCard key={index} imageSrc={data.imageSrc} text={data.text} />
      ))}
    </div>
  );
};

export default FeedCardList;