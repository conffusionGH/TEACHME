import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import APIEndPoints from '../../middleware/ApiEndPoints';

const NotificationForm = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.title || !formData.description) {
      setError('Please fill in both title and description');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(APIEndPoints.create_notification.url, {
        title: formData.title,
        description: formData.description,
        userId: currentUser._id
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        setFormData({ title: '', description: '' });
        navigate('/'); // Redirect to dashboard after success
      }
    } catch (err) {
      setError(err.message || 'Failed to create notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-primary mb-4">Create Notification</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md focus:ring-primary focus:border-primary"
            placeholder="Enter notification title"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border rounded-md focus:ring-primary focus:border-primary"
            placeholder="Enter notification description"
            rows="4"
            required
          />
        </div>
        {error && (
          <p className="text-error text-sm">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded-md text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'}`}
        >
          {loading ? 'Submitting...' : 'Submit Notification'}
        </button>
      </form>
    </div>
  );
};

export default NotificationForm;