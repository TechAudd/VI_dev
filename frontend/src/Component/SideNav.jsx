import { BiLocationPlus } from "react-icons/bi";
import { FiMenu } from "react-icons/fi";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const SideNav = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to handle link clicks in mobile view
  const handleFormClick = (e) => {
    e.preventDefault(); // Prevent default link behavior

    // First navigate to the form
    navigate("/createForm");

    // Then close the sidebar after a small delay
    setTimeout(() => {
      if (isMobile) {
        setIsOpen(false);
      }
    }, 100);
  };

  return (
    <>
      {/* Hamburger Menu Button (Only on Small Screens) */}
      {isMobile && (
        <button
          className="fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md shadow-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FiMenu size={25} />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-gray-900 text-white shadow-lg transition-all duration-300 mt-16 z-40
          ${isMobile ? (isOpen ? "w-40" : "w-0") : isCollapsed ? "w-16" : "w-40"
          }
          ${isMobile ? (isOpen ? "block" : "hidden") : "flex flex-col"}`}
        onMouseEnter={() => !isMobile && setIsCollapsed(false)}
        onMouseLeave={() => !isMobile && setIsCollapsed(true)}
      >
        <nav className="mt-4 flex-1">
          <ul className="space-y-2">
            <li>
              <a
                href="/createForm"
                className="py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-gray-300 flex items-center"
                onClick={handleFormClick}
              >
                <BiLocationPlus size={25} />
                <span
                  className={`transition-all duration-300 ${isCollapsed && !isMobile
                      ? "opacity-0 w-0"
                      : "opacity-100 w-auto"
                    } whitespace-nowrap ml-2`}
                >
                  ADD FORM
                </span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay (Click outside to close on mobile) */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default SideNav;
