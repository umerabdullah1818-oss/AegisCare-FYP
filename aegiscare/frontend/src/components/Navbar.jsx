import React, { useState } from 'react';
import { Menu, X, Smartphone, Sun, Moon, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ isDarkMode, onToggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-500 ${
        isDarkMode
          ? 'bg-gray-900/90 border-gray-800'
          : 'bg-white/90 border-blue-100'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16 sm:h-18 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <img
              src="/assets/logo.png"
              alt="AegisCare Logo"
              className="w-12 h-9 sm:w-14 sm:h-10 md:w-16 md:h-12 lg:w-18 lg:h-14"
            />
            <div>
              <h1
                className={`text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent ${
                  isDarkMode ? 'brightness-125' : ''
                }`}
              >
                AegisCare
              </h1>
              <p
                className={`text-[10px] sm:text-xs font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                Multi AI Agentic Elderly Care Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link
              to="/"
              className={`font-medium transition-all duration-200 hover:scale-105 transform text-sm lg:text-base flex items-center ${
                isDarkMode
                  ? 'text-gray-300 hover:text-blue-400'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/about-us"
              className={`font-medium transition-all duration-200 hover:scale-105 transform text-sm lg:text-base ${
                isDarkMode
                  ? 'text-gray-300 hover:text-blue-400'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              About us
            </Link>
            <Link
              to="/services"
              className={`font-medium transition-all duration-200 hover:scale-105 transform text-sm lg:text-base ${
                isDarkMode
                  ? 'text-gray-300 hover:text-blue-400'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Services
            </Link>
            <Link
              to="/contact-us"
              className={`font-medium transition-all duration-200 hover:scale-105 transform text-sm lg:text-base ${
                isDarkMode
                  ? 'text-gray-300 hover:text-blue-400'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Contact Us
            </Link>

            {/* Dark Mode Toggle Button - Modern Design */}
            <button
              onClick={onToggleDarkMode}
              className={`relative w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center transition-all duration-500 transform hover:scale-110 hover:rotate-12 group ${
                isDarkMode
                  ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-800/30'
                  : 'bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200'
              }`}
              aria-label={
                isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
              }
            >
              {/* Background Glow Effect */}
              <div
                className={`absolute inset-0 rounded-xl lg:rounded-2xl blur-lg transition-all duration-500 ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:bg-gradient-to-br group-hover:from-blue-500/40 group-hover:to-purple-500/40'
                    : 'bg-gradient-to-br from-blue-200/20 to-indigo-200/20 group-hover:bg-gradient-to-br group-hover:from-blue-300/40 group-hover:to-indigo-300/40'
                }`}
              ></div>
              {/* Sun Icon - Light Mode */}
              <Sun
                className={`absolute w-5 h-5 lg:w-6 lg:h-6 transition-all duration-500 ${
                  isDarkMode
                    ? 'opacity-0 rotate-0 scale-0 text-yellow-300'
                    : 'opacity-100 rotate-0 scale-100 text-amber-500'
                }`}
              />

              {/* Moon Icon - Dark Mode */}
              <Moon
                className={`absolute w-5 h-5 lg:w-6 lg:h-6 transition-all duration-500 ${
                  isDarkMode
                    ? 'opacity-100 rotate-0 scale-100 text-blue-300'
                    : 'opacity-0 rotate-90 scale-0 text-indigo-400'
                }`}
              />
            </button>

            <Link
              to="/login"
              className={`px-4 py-2 lg:px-6 lg:py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-200 flex items-center text-sm lg:text-base ${
                isDarkMode
                  ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white hover:from-blue-600 hover:to-indigo-600'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
              }`}
            >
              Login/Signup
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:hidden">
            {/* Mobile Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
                isDarkMode
                  ? 'bg-gray-800 text-blue-300'
                  : 'bg-blue-50 text-blue-600'
              }`}
              aria-label={
                isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
              }
            >
              {isDarkMode ? (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-1.5 sm:p-2 rounded-lg ${
                isDarkMode
                  ? 'bg-gray-800 text-blue-300'
                  : 'bg-blue-50 text-blue-600'
              }`}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className={`md:hidden py-4 px-4 rounded-b-2xl shadow-lg animate-slideDown ${
              isDarkMode
                ? 'bg-gray-900 border-t border-gray-800'
                : 'bg-white border-t border-blue-100'
            }`}
          >
            <div className="flex flex-col space-y-3 sm:space-y-4">
              <Link
                to="/"
                className={`font-medium py-2 px-4 rounded-lg transition-all text-sm sm:text-base flex items-center ${
                  isDarkMode
                    ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-800'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about-us"
                className={`font-medium py-2 px-4 rounded-lg transition-all text-sm sm:text-base ${
                  isDarkMode
                    ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-800'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About us
              </Link>
              <Link
                to="/services"
                className={`font-medium py-2 px-4 rounded-lg transition-all text-sm sm:text-base ${
                  isDarkMode
                    ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-800'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/contact-us"
                className={`font-medium py-2 px-4 rounded-lg transition-all text-sm sm:text-base ${
                  isDarkMode
                    ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-800'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
              
              
              {/* Mobile Dark Mode Toggle in Menu */}
              <button
                onClick={onToggleDarkMode}
                className={`font-medium py-2 px-4 rounded-lg transition-all flex items-center justify-between text-sm sm:text-base ${
                  isDarkMode
                    ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-800'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                {isDarkMode ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
                )}
              </button>
              
              <Link
                to="/login"
                className={`mt-2 px-6 py-3 rounded-full font-semibold shadow-lg flex items-center justify-center text-sm sm:text-base ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Login / Signup
                <Smartphone className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;