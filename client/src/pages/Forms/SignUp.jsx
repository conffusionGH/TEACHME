import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import APIEndPoints from '../../middleware/ApiEndPoints';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

export default function SignUp() {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    roles: 'manager'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const signupAPI = APIEndPoints.sign_up;

  useEffect(() => {
    if (!currentUser || ['teacher', 'student'].includes(currentUser.roles)) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const submissionData = {
        ...formData,
        roles: formData.roles || (currentUser?.roles === 'admin' ? 'manager' : 'manager')
      };

      const response = await axios({
        url: signupAPI.url,
        method: signupAPI.method,
        data: submissionData
      });

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      toast.success('User created successfully!');
      setFormData({
        username: '',
        email: '',
        password: '',
        roles: 'manager'
      });

    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || ['teacher', 'student'].includes(currentUser.roles)) {
    return null;
  }

  const availableRoles = [
    { value: 'manager', label: 'Manager' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'student', label: 'Student' }
  ];

  if (currentUser?.roles === 'admin') {
    availableRoles.unshift({ value: 'admin', label: 'Admin' });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-tertiary">
        <div className="px-6 py-4 bg-secondary">
          <h2 className="text-xl font-semibold text-primary">Create New User</h2>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  id="username"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  id="password"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="roles" className="block text-sm font-medium text-gray-700 mb-1">Select Role</label>
                <select
                  id="roles"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                  onChange={handleChange}
                  value={formData.roles}
                  required
                >
                  {availableRoles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-tertiary">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-4 py-2 border bg-error/60 hover:bg-error border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary disabled:opacity-70 transition-colors"
              >
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
