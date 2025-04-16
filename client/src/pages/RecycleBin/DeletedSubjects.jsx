import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import { FaTrashRestore, FaTrash } from 'react-icons/fa';
import APIEndPoints from '../../middleware/ApiEndPoints';

const DeletedSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalSubjects, setTotalSubjects] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiDeletedSubjects = APIEndPoints.get_deleted_subjects.url;
  const apiRestoreSubject = APIEndPoints.restore_subject.url;
  const apiPermanentDelete = APIEndPoints.permanent_delete_subject.url;
  const apiClearRecycleBin = APIEndPoints.clear_subject_recycle_bin.url;

  const fetchDeletedSubjects = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`${apiDeletedSubjects}?page=${page}`, {
        withCredentials: true,
      });

      const data = res.data || {};
      setSubjects(data.deletedSubjects || []);
      setCurrentPage(data.currentPage ? data.currentPage - 1 : 0);
      setTotalPages(data.totalPages || 0);
      setTotalSubjects(data.totalSubjects || 0);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch deleted subjects');
      toast.error(error.response?.data?.message || 'Failed to fetch deleted subjects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedSubjects(1);
  }, []);

  const handlePageClick = (data) => {
    fetchDeletedSubjects(data.selected + 1);
  };

  const handleRestore = async (subjectId) => {
    if (window.confirm('Are you sure you want to restore this subject?')) {
      try {
        await axios.post(`${apiRestoreSubject}/${subjectId}`, {}, { withCredentials: true });
        toast.success('Subject restored successfully');
        fetchDeletedSubjects(currentPage + 1);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to restore subject');
      }
    }
  };

  const handlePermanentDelete = async (subjectId) => {
    if (window.confirm('Are you sure you want to permanently delete this subject? This action cannot be undone!')) {
      try {
        await axios.delete(`${apiPermanentDelete}/${subjectId}`, { withCredentials: true });
        toast.success('Subject permanently deleted');
        fetchDeletedSubjects(currentPage + 1);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete subject');
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to permanently delete ALL subjects in the recycle bin? This action cannot be undone!')) {
      try {
        await axios.delete(apiClearRecycleBin, { withCredentials: true });
        toast.success('Recycle bin cleared successfully');
        fetchDeletedSubjects(1);
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
            Subject Recycle Bin ({totalSubjects})
          </h2>
          <button
            onClick={handleClearAll}
            disabled={totalSubjects === 0}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              totalSubjects === 0
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
                <th className="px-6 py-3 text-left text-sm font-medium text-primary uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-primary uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-primary uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-primary uppercase tracking-wider">Credits</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-primary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-tertiary">
              {subjects.length > 0 ? (
                subjects.map((subject) => (
                  <tr key={subject._id} className="hover:bg-tertiary/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={subject.image || 'https://via.placeholder.com/50'}
                        alt={subject.name}
                        className="w-10 h-10 object-cover rounded-md border"
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/50')}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {subject.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subject.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subject.creditHours}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleRestore(subject._id)}
                        className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
                        title="Restore"
                      >
                        <FaTrashRestore className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(subject._id)}
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
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
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
              pageClassName={'rounded-lg border border-tertiary hover:bg-secondary/20'}
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

export default DeletedSubjects;
