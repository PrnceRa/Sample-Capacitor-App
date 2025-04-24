import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faHistory, faBell, faEllipsisH } from '@fortawesome/free-solid-svg-icons';

const BottomBarItems: React.FC = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 shadow-md">
            <div className="flex justify-around bg-white items-center py-3">
                <button onClick={()=>window.location.reload()} className="hover:bg-blue-100 bg-white rounded-full text-xl cursor-pointer p-2">
                    <FontAwesomeIcon icon={faHome} className="text-gray-600 hover:text-blue-700" />
                </button>
                <button className="hover:bg-blue-100 bg-white rounded-full text-xl cursor-pointer p-2">
                    <FontAwesomeIcon icon={faHistory} className="text-gray-600 hover:text-blue-700" />
                </button>
                <button className="hover:bg-blue-100 bg-white rounded-full text-xl cursor-pointer p-2">
                    <FontAwesomeIcon icon={faBell} className="text-gray-600 hover:text-blue-700" />
                </button>
                <button className="hover:bg-blue-100 bg-white rounded-full text-xl cursor-pointer p-2">
                    <FontAwesomeIcon icon={faEllipsisH} className="text-gray-600 hover:text-blue-700" />
                </button>
            </div>
        </div>
    );
};

export default BottomBarItems;