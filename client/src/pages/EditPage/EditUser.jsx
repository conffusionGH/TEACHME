import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import APIEndPoints from '../../middleware/ApiEndPoints';
import ImageUpload from '../../components/ImageUpload.jsx';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    avatar: '',
    roles: ''
  });
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);


  // Authorization check here
  // useEffect(() => {
  //   if (currentUser._id !== id && currentUser.roles !== 'admin') {
  //     toast.error('You can only edit your own profile');
  //     navigate('/');
  //   }
  // }, [currentUser, id, navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${APIEndPoints.get_user.url}/${id}`, {
          withCredentials: true
        });
        const user = response.data;
        setFormData({
          username: user.username,
          email: user.email,
          password: '',
          avatar: user.avatar,
          roles: user.roles
        });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch user');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleImageUpload = (imageUrl) => {
    setFormData({ ...formData, avatar: imageUrl });
    toast.success('Image uploaded successfully!');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to update this account?')) return;

    try {
      setLoading(true);
      const updateData = { ...formData };
      
      // Don't send password if it's empty
      if (!updateData.password) {
        delete updateData.password;
      }

      // Don't send role if current user isn't admin
      if (currentUser.roles !== 'admin') {
        delete updateData.roles;
      }

      const response = await axios.post(
        `${APIEndPoints.update_user.url}/${id}`,
        updateData,
        { withCredentials: true }
      );
      
      toast.success('User updated successfully');
      navigate(-1); // Go back to previous page
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
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
          <h2 className="text-xl font-semibold text-primary">Edit User</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  New Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                />
              </div>

              <div>
                <label htmlFor="roles" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <input
                  type="text"
                  id="roles"
                  value={formData.roles.charAt(0).toUpperCase() + formData.roles.slice(1)}
                  readOnly
                  className="mt-1 block w-full rounded-md bg-gray-100 border border-gray-300 shadow-sm p-2 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex flex-col items-center">
              <ImageUpload
                onImageUpload={handleImageUpload}
                currentImage={formData.avatar}
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

export default EditUser;