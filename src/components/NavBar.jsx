import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-white-400 p-4 shadow-md text-white border border-orange-400">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <img src="/farlogo.png" height="60" width="60" />

        {/* Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none"
        >
          <svg
            className="w-6 h-6 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 text-lg font-medium font-mono">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `hover:underline ${
                isActive ? "text-orange-500 font-bold" : "text-blue-900"
              }`
            }
          >
            HOME
          </NavLink>
          <NavLink
            to="/owner/listings"
            end
            className={({ isActive }) =>
              `hover:underline ${
                isActive ? "text-orange-500 font-bold" : "text-blue-900"
              }`
            }
          >
            MY LISTINGS
          </NavLink>
          <NavLink
            to="/interests"
            end
            className={({ isActive }) =>
              `hover:underline ${
                isActive ? "text-orange-500 font-bold " : "text-blue-900"
              }`
            }
          >
            MY INTERESTS
          </NavLink>
          <NavLink
            to="/listings/matches"
            end
            className={({ isActive }) =>
              `hover:underline ${
                isActive ? "text-orange-500 font-bold" : "text-blue-900"
              }`
            }
          >
            MATCHES
          </NavLink>
          <NavLink
            to="/far-project"
            end
            className={({ isActive }) =>
              `hover:underline ${
                isActive ? "text-orange-500 font-bold" : "text-blue-900"
              }`
            }
          >
            FAR PROJECT
          </NavLink>
        </nav>

        {/* Profile */}
        <div className="hidden md:block">
          <button
            onClick={() => {
              navigate("/profile");
            }}
          >
            <img width="60" height="40" src="/profile.png" />
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden mt-2 space-y-2 px-4 text-base font-medium">
          <NavLink to="/" className="block text-orange-600">
            HOME
          </NavLink>
          <NavLink to="/owner/listings" end className="block">
            MY LISTINGS
          </NavLink>
          <NavLink to="/interests" end className="block">
            MY INTERESTS
          </NavLink>
          <NavLink to="/listings/matches" end className="block">
            MATCHES
          </NavLink>
          <NavLink to="/far-project" end className="block">
            FAR PROJECT
          </NavLink>

          <button
            className="bg-orange-400 px-4 py-2 border text-white border-gray-300 w-full mt-2"
            onClick={() => {
              navigate("/profile");
            }}
          >
            PROFILE
          </button>
        </div>
      )}
    </header>
  );
};

export default NavBar;
