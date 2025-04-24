import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap, faMoon, faSpellCheck, IconDefinition } from "@fortawesome/free-solid-svg-icons";

type FidgetCardsProps = {
  title: string;
  subTitle: string;
  icon: IconDefinition;
};

const FidgetCard: FC<FidgetCardsProps> = ({ title, subTitle, icon }) => {
  return (
    <div className="flex-1 min-w-2/5 bg-white rounded-xl p-4 shadow-md">
      <div className="flex flex-col">
        <span className="text-gray-700 text-sm font-semibold">{title}</span>
        <div className="flex items-center justify-between pt-3">
          <span className="text-gray-900 text-sm font-semibold">{subTitle}</span>
          <FontAwesomeIcon icon={icon} className="text-gray-900 font-bold h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

const FidgetCards = () => (
  <div className="flex mt-3 gap-2 pb-3 overflow-x-auto scrollbar-hide">
    <FidgetCard title="Gurugram" subTitle="30°" icon={faMoon} />
    <FidgetCard title="Air Quality - 170" subTitle="moderate" icon={faMap} />
    <FidgetCard title="Settings" subTitle="Current" icon={faSpellCheck} />
  </div>
);

export default FidgetCards;