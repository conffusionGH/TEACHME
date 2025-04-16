import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import APIEndPoints from '../../middleware/ApiEndPoints';
import ImageUpload from '../../components/ImageUpload';

const EditSubject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    image: '',
    creditHours: 3,
    isActive: true
  });

  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${APIEndPoints.get_subject.url}/${id}`);
        const subject = response.data;

        setFormData({
          name: subject.name,
          code: subject.code,
          description: subject.description || '',
          image: subject.image,
          creditHours: subject.creditHours,
          isActive: subject.isActive
        });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch subject');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, [id, navigate]);

  const handleImageUpload = (imageUrl) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }));
    toast.success('Image uploaded successfully!');
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to update this subject?')) return;

    try {
      setLoading(true);
      const updateData = { ...formData };

      const response = await axios.put(
        `${APIEndPoints.update_subject.url}/${id}`,
        updateData,
        { withCredentials: true }
      );

      toast.success('Subject updated successfully');
      navigate(-1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update subject');
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
          <h2 className="text-xl font-semibold text-primary">Edit Subject</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Subject Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                  required
                />
              </div>

              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Subject Code
                </label>
                <input
                  type="text"
                  id="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                  required
                />
              </div>

              <div>
                <label htmlFor="creditHours" className="block text-sm font-medium text-gray-700">
                  Credit Hours
                </label>
                <input
                  type="number"
                  id="creditHours"
                  value={formData.creditHours}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                  min="1"
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

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Active
                </label>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <ImageUpload
                onImageUpload={handleImageUpload}
                currentImage={formData.image}
                setUploading={setImageUploading}
              />
              {imageUploading && (
                <p className="text-sm text-gray-500 mt-2">Uploading image...</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || imageUploading}
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

export default EditSubject;
