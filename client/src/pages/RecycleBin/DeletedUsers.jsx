

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import { FaTrashRestore, FaTrash } from 'react-icons/fa';
import APIEndPoints from '../../middleware/ApiEndPoints';

const DeletedUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const apiDeletedUsers = APIEndPoints.get_deleted_users.url;
  const apiRestoredUsers = APIEndPoints.restore_user.url;

  const fetchDeletedUsers = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${apiDeletedUsers}?page=${page}`, {
        withCredentials: true
      });

      const responseData = response.data || {};
      const usersData = responseData.deletedUsers || [];
      
      setUsers(usersData);
      setCurrentPage(responseData.currentPage ? responseData.currentPage - 1 : 0);
      setTotalPages(responseData.totalPages || 0);
      setTotalUsers(responseData.totalUsers || 0);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch deleted users');
      toast.error(error.response?.data?.message || 'Failed to fetch deleted users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedUsers(1);
  }, []);

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    fetchDeletedUsers(selectedPage);
  };

  const handleRestore = async (userId) => {
    if (window.confirm('Are you sure you want to restore this user?')) {
      try {
        await axios.put(`${apiRestoredUsers}/${userId}`, {}, {
          withCredentials: true
        });
        toast.success('User restored successfully');
        fetchDeletedUsers(currentPage + 1);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to restore user');
      }
    }
  };

  const handlePermanentDelete = async (userId) => {
    if (window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone!')) {
      try {
        await axios.delete(`${APIEndPoints.permanent_delete_user.url}/${userId}`, {
          withCredentials: true
        });
        toast.success('User permanently deleted');
        fetchDeletedUsers(currentPage + 1);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to permanently delete ALL users in the recycle bin? This action cannot be undone!')) {
      try {
        await axios.delete(APIEndPoints.clear_recycle_bin.url, {
          withCredentials: true
        });
        toast.success('Recycle bin cleared successfully');
        fetchDeletedUsers(1);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to clear recycle bin');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error/10 border border-error/30 rounded-lg p-4 text-center text-error">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-tertiary">
        <div className="px-6 py-4 bg-secondary flex justify-between items-center">
          <h2 className="text-xl font-semibold text-primary">
            Recycle Bin ({totalUsers})
          </h2>
          <button
            onClick={handleClearAll}
            disabled={totalUsers === 0}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              totalUsers === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-error text-white hover:bg-error/90 shadow-md hover:shadow-lg'
            }`}
          >
            Clear All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-tertiary">
            <thead className="bg-tertiary">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-primary uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-primary uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-primary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-tertiary">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-tertiary/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src={user.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} 
                            alt={user.username}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.roles === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.roles === 'manager' ? 'bg-blue-100 text-blue-800' :
                        user.roles === 'teacher' ? 'bg-green-100 text-green-800' :
                        'bg-secondary/20 text-secondary'
                      }`}>
                        {user.roles.charAt(0).toUpperCase() + user.roles.slice(1)}
                      </span>
                    </td>
                  
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleRestore(user._id)}
                        className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
                        title="Restore"
                      >
                        <FaTrashRestore className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(user._id)}
                        className="bg-error text-white p-2 rounded-lg hover:bg-error/90 shadow-md hover:shadow-lg transition-all"
                        title="Permanently Delete"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    Recycle bin is empty
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-tertiary bg-tertiary">
            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              breakLabel={'...'}
              pageCount={totalPages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'flex justify-center space-x-2'}
              pageClassName={' rounded-lg border border-tertiary hover:bg-secondary/20'}
              pageLinkClassName={'text-primary px-3 py-2'}
              activeClassName={'bg-primary text-white'}
              previousClassName={'px-3 py-1 rounded-lg border border-tertiary hover:bg-secondary/20'}
              nextClassName={'px-3 py-1 rounded-lg border border-tertiary hover:bg-secondary/20'}
              disabledClassName={'opacity-50 cursor-not-allowed'}
              forcePage={currentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DeletedUsers;