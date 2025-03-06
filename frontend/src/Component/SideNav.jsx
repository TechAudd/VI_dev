import { BiLocationPlus } from "react-icons/bi";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const SideNav = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div
      className={`h-screen ${isCollapsed ? "w-16" : "w-40"} 
        bg-gray-900 text-white flex flex-col shadow-lg transition-all duration-300 overflow-hidden fixed`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <nav className="mt-5 flex-1">
        <ul className="space-y-2">
          <li>
            <Link
              to="/createForm"
              className="py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-gray-300 flex items-center"
            >
              <BiLocationPlus size={25} />
              <span
                className={`transition-all duration-300 ${isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                  } whitespace-nowrap ml-2`}
              >
                ADD FORM
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideNav;
