import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaSun, 
  FaMoon, 
  FaBell,
  FaHome,
  FaUser,
  FaChalkboardTeacher,
  FaMoneyBillWave,
  FaBook,
  FaFileAlt,
  FaSignOutAlt
} from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [darkMode, setDarkMode] = React.useState(false);

  return (  
    <ul className='flex gap-6 items-center'>
     
      
      {/* Dark Mode Toggle */}
      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={() => setDarkMode(!darkMode)}
        className="text-primary hover:text-secondary text-xl"
      >
        {darkMode ? <FaSun /> : <FaMoon />}
      </motion.button>
      
      {/* Notification */}
      <motion.div whileHover={{ scale: 1.1 }}>
        <Link to="/notifications" className="text-primary hover:text-secondary text-xl">
          <FaBell />
        </Link>
      </motion.div>
      
      {/* Profile */}
      <Link to='/profile'>
        {currentUser ? (
          <motion.div 
            className='flex items-center gap-2'
            whileHover={{ scale: 1.05 }}
          >
            <span className='hidden md:inline text-primary font-medium'>
              {currentUser.username}
            </span>
            <img
              className='rounded-full h-8 w-8 object-cover border-2 border-secondary'
              src={currentUser.avatar}
              alt='profile'
            />
          </motion.div>
        ) : (
          <motion.li 
            className='text-primary hover:text-secondary transition-colors'
            whileHover={{ scale: 1.05 }}
          >
            <FaUser className="inline mr-1" /> Sign in
          </motion.li>
        )}
      </Link>
    </ul>
  );
}

export default Navbar;