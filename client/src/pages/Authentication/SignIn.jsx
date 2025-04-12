import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../../redux/user/userSlice';
import axios from 'axios';
import APIEndPoints from '../../middleware/ApiEndPoints';


export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const signinAPI = APIEndPoints.sign_in;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const response = await axios({
        url: signinAPI.url,
        method: signinAPI.method,
        data: formData,
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      if (response.data.success === false) {
        dispatch(signInFailure(response.data.message));
        return;
      }

      dispatch(signInSuccess(response.data));
      navigate('/');

    } catch (error) {
      dispatch(signInFailure(
        error.response?.data?.message ||
        error.message ||
        'Sign in failed'
      ));
    }
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='email'
          placeholder='email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        {/* <OAuth/> */}
      </form>
      {/* <div className='flex gap-2 mt-5'>
        <p>Dont have an account?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div> */}
      {/* {error && <p className='text-red-500 mt-5'>{error}</p>} */}
    </div>
  );
}
