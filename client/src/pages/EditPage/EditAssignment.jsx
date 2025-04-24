
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import APIEndPoints from '../../middleware/ApiEndPoints';

const EditAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    subject: '',
    pdf: '',
    isDeleted: false,
  });
  const [educator, setEducator] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);

  useEffect(() => {
    const fetchAssignmentAndSubjects = async () => {
      try {
        setLoading(true);

        // Fetch assignment
        const assignmentResponse = await axios.get(`${APIEndPoints.get_assignment.url}/${id}`, {
          withCredentials: true,
        });
        const assignment = assignmentResponse.data;

        // Fetch subjects
        const subjectsResponse = await axios.get(APIEndPoints.get_all_subjects_no_pagination.url, {
          withCredentials: true,
        });

        // Log the response for debugging
        console.log('Subjects response:', subjectsResponse.data);

        // Ensure subjects is an array
        const subjectsData = Array.isArray(subjectsResponse.data.data)
          ? subjectsResponse.data.data
          : subjectsResponse.data.data || [];
        setSubjects(subjectsData);

        // Format deadline to YYYY-MM-DDTHH:MM for datetime-local input
        const deadline = new Date(assignment.deadline).toISOString().slice(0, 16);

        setFormData({
          title: assignment.title,
          description: assignment.description || '',
          deadline,
          subject: assignment.subject._id,
          pdf: assignment.pdf || '',
          isDeleted: assignment.isDeleted,
        });
        setEducator(assignment.educator?.username || 'N/A');
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch assignment or subjects');
        navigate('/assignments');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentAndSubjects();
  }, [id, navigate]);

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const pdfData = new FormData();
    pdfData.append('pdf', file);

    try {
      setPdfUploading(true);
      const response = await axios.post(APIEndPoints.upload_assignment_pdf.url, pdfData, {
        withCredentials: true,
      });
      const pdfUrl = response.data.url;
      setFormData((prev) => ({ ...prev, pdf: pdfUrl }));
      toast.success('PDF uploaded successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload PDF');
    } finally {
      setPdfUploading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to update this assignment?')) return;

    try {
      setLoading(true);
      const updateData = { ...formData };

      // Convert deadline to ISO string
      updateData.deadline = new Date(updateData.deadline).toISOString();

      await axios.put(
        `${APIEndPoints.update_assignment.url}/${id}`,
        updateData,
        { withCredentials: true }
      );

      toast.success('Assignment updated successfully');
      navigate('/assignments');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update assignment');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-tertiary">
        <div className="px-6 py-4 bg-secondary">
          <h2 className="text-xl font-semibold text-primary">Edit Assignment</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex flex-col space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Assignment Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
              />
            </div>

            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                Deadline
              </label>
              <input
                type="datetime-local"
                id="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <select
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                required
              >
                <option value="">Select a subject</option>
                {Array.isArray(subjects) && subjects.length > 0 ? (
                  subjects.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name} - {subject.code}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No subjects available
                  </option>
                )}
              </select>
            </div>

            <div>
              <label htmlFor="educator" className="block text-sm font-medium text-gray-700">
                Educator
              </label>
              <input
                type="text"
                id="educator"
                value={educator}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 bg-gray-100"
                disabled
              />
            </div>

            <div>
              <label htmlFor="pdf" className="block text-sm font-medium text-gray-700">
                Assignment PDF
              </label>
              {formData.pdf && (
                <div className="mt-1 mb-2">
                  <a
                    href={formData.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View Current PDF
                  </a>
                </div>
              )}
              <input
                type="file"
                id="pdf"
                accept="application/pdf"
                onChange={handlePdfUpload}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                disabled={pdfUploading}
              />
              {pdfUploading && (
                <p className="text-sm text-gray-500 mt-2">Uploading PDF...</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDeleted"
                checked={formData.isDeleted}
                onChange={handleChange}
                className="h-4 w-4 text-primary border-gray-300 rounded"
              />
              <label htmlFor="isDeleted" className="text-sm text-gray-700">
                Mark as Deleted
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/assignments')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || pdfUploading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAssignment;