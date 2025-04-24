import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faLanguage, faUniversity, faMusic } from '@fortawesome/free-solid-svg-icons';

interface FidgetProps {
    icon: React.ReactNode;
    color: string;
}

const colorClasses: { [key: string]: string } = {
    red: '!bg-red-400',
    green: '!bg-green-400',
    blue: '!bg-blue-400',
    yellow: '!bg-yellow-400',
};

const Fidget: React.FC<FidgetProps> = ({ icon, color }) => {
    const bgColorClass = colorClasses[color] || 'bg-gray-200';

    return (
        <button
            className={`flex items-center justify-center space-x-2 px-6 py-3 ${bgColorClass} text-white !text-2xl !rounded-full hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
            <span className="text-xl">{icon}</span>
        </button>
    );
};

const FidgetList: React.FC = () => {
    return (
        <div className="flex w-full justify-between">
            <Fidget icon={<FontAwesomeIcon icon={faNewspaper} />} color="yellow" />
            <Fidget icon={<FontAwesomeIcon icon={faLanguage} />} color="blue" />
            <Fidget icon={<FontAwesomeIcon icon={faUniversity} />} color="green" />
            <Fidget icon={<FontAwesomeIcon icon={faMusic} />} color="red" />
        </div>
    );
};

export default FidgetList;