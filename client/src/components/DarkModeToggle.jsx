import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = React.useState()
//     if (typeof window !== 'undefined') {
//       const savedMode = localStorage.getItem('darkMode');
//       if (savedMode !== null) return savedMode === 'true';
//       return window.matchMedia('(prefers-color-scheme: dark)').matches;
//     }
//     return false;
//   });

//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add('dark');
//       localStorage.setItem('darkMode', 'true');
//     } else {
//       document.documentElement.classList.remove('dark');
//       localStorage.setItem('darkMode', 'false');
//     }
//   }, [darkMode]);

  return (
    <motion.button 
      whileTap={{ scale: 0.9 }}
      onClick={() => setDarkMode(!darkMode)}
      className="text-primary-light dark:text-primary-dark hover:text-secondary-light dark:hover:text-secondary-dark text-xl"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? <FaSun /> : <FaMoon />}
    </motion.button>
  );
};

export default DarkModeToggle;