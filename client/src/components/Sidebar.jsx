import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaUser,
  FaChalkboardTeacher,
  FaMoneyBillWave,
  FaBook,
  FaFileAlt,
  FaSignOutAlt
} from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { deleteUserFailure, deleteUserSuccess, signOutUserStart } from '../redux/user/userSlice';
import APIEndPoints from '../middleware/ApiEndPoints';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const Sidebar = ({ isOpen, toggleSidebar, isPermanent }) => {
  const [openSections, setOpenSections] = useState({
    roles: false,
    management: false,
    forms: false
  });
  const sidebarRef = useRef();

  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();



  const signOutUrl = APIEndPoints.sign_out;


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggleSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, toggleSidebar]);

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleLinkClick = () => {
    toggleSidebar();
  };


  const handleSignOut = async () => {
    if (!currentUser) return;
    try {
      dispatch(signOutUserStart());
      const res = await axios({
        url: signOutUrl.url,
        method: signOutUrl.method
      });

      if (res.data.success === false) {
        dispatch(deleteUserFailure(res.data.message));
        return;
      }
      dispatch(deleteUserSuccess(res.data));
      setFormData({});
      navigate('/');
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <>
      {!isPermanent && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 lg:hidden"
              onClick={toggleSidebar}
            />
          )}
        </AnimatePresence>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || isPermanent) && (
          <motion.div
            ref={sidebarRef}
            initial={isPermanent ? { x: 0 } : { x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween' }}
            className={`fixed lg:relative inset-y-0 left-0 w-64 bg-white shadow-lg z-50 ${isPermanent ? 'lg:flex' : ''
              }`}
          >
            <div className="p-4 h-full flex flex-col">
              {/* Header with close button */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-primary">Teach Me</h2>
                {!isPermanent && (
                  <button
                    onClick={toggleSidebar}
                    className="text-gray-500 hover:text-primary p-1"
                    aria-label="Close sidebar"
                  >
                    <FaTimes size={20} />
                  </button>
                )}
              </div>

              {/* Menu Items */}
              <nav className="flex-grow overflow-y-auto">
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/dashboard"
                      className="flex items-center p-3 rounded-lg hover:bg-tertiary text-primary"
                      onClick={handleLinkClick}
                    >
                      <MdDashboard className="mr-3" size={20} />
                      Dashboard
                    </Link>
                  </li>

                  {/* Roles Section */}
                  <li>
                    <button
                      onClick={() => toggleSection('roles')}
                      className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-tertiary text-primary"
                    >
                      <div className="flex items-center">
                        <FaUser className="mr-3" size={18} />
                        Roles
                      </div>
                      {openSections.roles ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </button>
                    <AnimatePresence>
                      {openSections.roles && (
                        <motion.ul
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-10"
                        >
                          <li>
                            <Link
                              to="/roles/manager"
                              className="flex items-center p-2 text-sm rounded-lg hover:bg-tertiary text-primary"
                              onClick={handleLinkClick}
                            >
                              Manager
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/roles/teacher"
                              className="flex items-center p-2 text-sm rounded-lg hover:bg-tertiary text-primary"
                              onClick={handleLinkClick}
                            >
                              Teacher
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/roles/student"
                              className="flex items-center p-2 text-sm rounded-lg hover:bg-tertiary text-primary"
                              onClick={handleLinkClick}
                            >
                              Student
                            </Link>
                          </li>
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </li>

                  {/* Management Section */}
                  <li>
                    <button
                      onClick={() => toggleSection('management')}
                      className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-tertiary text-primary"
                    >
                      <div className="flex items-center">
                        <FaChalkboardTeacher className="mr-3" size={18} />
                        Management
                      </div>
                      {openSections.management ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </button>
                    <AnimatePresence>
                      {openSections.management && (
                        <motion.ul
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-10"
                        >
                          <li>
                            <Link
                              to="/management/fee"
                              className="flex items-center p-2 text-sm rounded-lg hover:bg-tertiary text-primary"
                              onClick={handleLinkClick}
                            >
                              <FaMoneyBillWave className="mr-3" size={16} />
                              Fee
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/management/status"
                              className="flex items-center p-2 text-sm rounded-lg hover:bg-tertiary text-primary"
                              onClick={handleLinkClick}
                            >
                              Status
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/management/subjects"
                              className="flex items-center p-2 text-sm rounded-lg hover:bg-tertiary text-primary"
                              onClick={handleLinkClick}
                            >
                              <FaBook className="mr-3" size={16} />
                              Subjects
                            </Link>
                          </li>
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </li>

                  {/* Forms Section */}
                  <li>
                    <button
                      onClick={() => toggleSection('forms')}
                      className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-tertiary text-primary"
                    >
                      <div className="flex items-center">
                        <FaFileAlt className="mr-3" size={18} />
                        Forms
                      </div>
                      {openSections.forms ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </button>
                    <AnimatePresence>
                      {openSections.forms && (
                        <motion.ul
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-10"
                        >
                          <li>
                            <Link
                              to="/forms/request"
                              className="flex items-center p-2 text-sm rounded-lg hover:bg-tertiary text-primary"
                              onClick={handleLinkClick}
                            >
                              Request Form
                            </Link>
                          </li>
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </li>

                  {/* Profile */}
                  <li>
                    <Link
                      to="/profile"
                      className="flex items-center p-3 rounded-lg hover:bg-tertiary text-primary"
                      onClick={handleLinkClick}
                    >
                      <FaUser className="mr-3" size={18} />
                      Profile
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Logout */}
              <div className="mt-auto pt-2 " onClick={handleSignOut}>
                <button
                  className="flex items-center w-full p-3 rounded-lg hover:bg-red-50 text-red-500"
                  onClick={toggleSidebar}
                >
                  <FaSignOutAlt className="mr-3" size={18} />
                  {/* onClick={handleSignOut} */}
                  <span  >
                    Sign out
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;