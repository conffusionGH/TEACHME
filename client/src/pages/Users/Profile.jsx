

import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ImageUpload from '../../components/ImageUpload.jsx';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
} from '../../redux/user/userSlice';
import APIEndPoints from '../../middleware/ApiEndPoints.jsx';
import toast from 'react-hot-toast';

export default function Profile() {
  const { currentUser, loading } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    avatar: '',
    roles: ''
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        avatar: currentUser.avatar || '',
        roles: currentUser.roles || ''
      });
    }
  }, [currentUser]);

  const handleImageUpload = (imageUrl) => {
    setFormData({ ...formData, avatar: imageUrl });
    toast.success('Image uploaded successfully!');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!window.confirm('Are you sure you want to update your account?')) return;

    try {
      dispatch(updateUserStart());
      const res = await axios({
        url: `${APIEndPoints.update_user.url}/${currentUser._id}`,
        method: APIEndPoints.update_user.method,
        data: formData,
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      if (res.data.success === false) {
        toast.error(res.data.message);
        dispatch(updateUserFailure(res.data.message));
        return;
      }

      toast.success('Profile updated successfully!');
      dispatch(updateUserSuccess(res.data));
      setUpdateSuccess(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      dispatch(updateUserFailure(errorMessage));
    } finally {
      setUploadProgress(0);
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    try {
      dispatch(deleteUserStart());
      const res = await axios({
        url: `${APIEndPoints.delete_user.url}/${currentUser._id}`,
        method: APIEndPoints.delete_user.method,
        withCredentials: true
      });

      if (res.data.success === false) {
        toast.error(res.data.message);
        dispatch(deleteUserFailure(res.data.message));
        return;
      }

      toast.success('Account deleted successfully');
      dispatch(deleteUserSuccess(res.data));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      dispatch(deleteUserFailure(errorMessage));
    }
  };

  const handleSignOut = async () => {
    if (!window.confirm('Are you sure you want to sign Out ')) return;
    try {
      dispatch(signOutUserStart());
      const res = await axios({
        url: APIEndPoints.sign_out.url,
        method: APIEndPoints.sign_out.method,
        withCredentials: true
      });
      toast.success('Signed out successfully');
      dispatch(deleteUserSuccess(res.data));
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      dispatch(deleteUserFailure(errorMessage));
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-tertiary p-6 space-y-6">
        <h1 className="text-3xl font-semibold text-primary text-center">My Profile</h1>

        <div className="flex justify-center">
          <ImageUpload
            onImageUpload={handleImageUpload}
            currentImage={formData.avatar}
            setUploadProgress={setUploadProgress}
          />
        </div>

        {/* Upload progress bar */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
            <p className="text-sm text-center mt-1">
              Uploading: {uploadProgress}%
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border border-tertiary p-3 rounded-lg"
          />

          <input
            type="email"
            placeholder="Email"
            id="email"
            value={formData.email}
            readOnly
            className="w-full bg-gray-100 border border-tertiary p-3 rounded-lg text-gray-500 cursor-not-allowed"
          />

          <input
            type="password"
            placeholder="New Password"
            id="password"
            onChange={handleChange}
            className="w-full border border-tertiary p-3 rounded-lg"
          />

          <input
            type="text"
            id="roles"
            value={formData.roles.charAt(0).toUpperCase() + formData.roles.slice(1)}
            readOnly
            className="w-full bg-gray-100 border border-tertiary p-3 rounded-lg text-gray-500 cursor-not-allowed"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>

        <div className="flex justify-between pt-2 border-t border-tertiary mt-4 text-sm">
          <span onClick={handleDeleteUser} className="text-error cursor-pointer hover:underline">
            Delete Account
          </span>
          <span onClick={handleSignOut} className="text-error cursor-pointer hover:underline">
            Sign Out
          </span>
        </div>
      </div>
    </div>
  );
}
