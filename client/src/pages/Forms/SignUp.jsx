import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  // Redirect if user doesn't have permission
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

      // Show success toast
      toast.success('User created successfully!');
      
      // Reset form
      setFormData({
        username: '',
        email: '',
        password: '',
        roles: 'manager'
      });

    } catch (error) {
      // Show error toast
      toast.error(error.response?.data?.message || error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Don't render if user doesn't have permission
  if (!currentUser || ['teacher', 'student'].includes(currentUser.roles)) {
    return null;
  }

  // Determine available roles based on current user's role
  const availableRoles = [
    { value: 'manager', label: 'Manager' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'student', label: 'Student' }
  ];

  if (currentUser?.roles === 'admin') {
    availableRoles.unshift({ value: 'admin', label: 'Admin' });
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7 text-primary'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='Username'
          className='border p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
          id='username'
          onChange={handleChange}
          value={formData.username}
          required
        />
        <input
          type='email'
          placeholder='Email'
          className='border p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
          id='email'
          onChange={handleChange}
          value={formData.email}
          required
        />
        <input
          type='password'
          placeholder='Password'
          className='border p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
          id='password'
          onChange={handleChange}
          value={formData.password}
          required
        />
        
        <div className='flex flex-col gap-1'>
          <label htmlFor='roles' className='text-gray-700'>Select Role</label>
          <select
            id='roles'
            className='border p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
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

        <button
          disabled={loading}
          className='bg-primary text-white p-3 rounded-lg uppercase hover:bg-secondary disabled:opacity-80 transition-colors duration-200'
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
      </form>
    
    </div>
  );
}