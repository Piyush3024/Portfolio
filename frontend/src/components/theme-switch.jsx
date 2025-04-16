import  { useState, useEffect } from 'react';
import { MoonFilledIcon, SunFilledIcon } from './icons';

export const ThemeSwitch = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if user has a theme preference stored
    const savedTheme = localStorage.getItem('theme');
    // Check if user's system prefers dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme based on saved preference or system preference
    setIsDark(savedTheme === 'dark' || (!savedTheme && prefersDark));
    
    // Apply the theme to the document
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    // Save theme preference
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
    // Apply theme to document
    document.documentElement.classList.toggle('dark', newTheme);
  };

  return (
    <button
      className="p-1 rounded-full hover:bg-gray-700 transition-colors duration-200"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDark ? (
        <SunFilledIcon className="text-yellow-300" size={20} />
      ) : (
        <MoonFilledIcon className="text-gray-400" size={20} />
      )}
    </button>
  );
};

export default ThemeSwitch;