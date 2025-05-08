import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import APIEndPoints from '../../middleware/ApiEndPoints';

const RequestForm = () => {
  const navigate = useNavigate();
  const requestFormAPI = APIEndPoints.request_form_create; // Adjust this to your actual API endpoint

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    sex: '',
    email: '',
    fatherName: '',
    motherName: '',
    permanentAddress: '',
    temporaryAddress: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (file && validImageTypes.includes(file.type)) {
      setImageFile(file);
    } else {
      toast.error('Please upload a valid image file (jpeg, jpg, png, gif)');
      e.target.value = null;
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      toast.error('Please upload a valid PDF file');
      e.target.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('age', formData.age);
      formDataToSend.append('sex', formData.sex);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('fatherName', formData.fatherName);
      formDataToSend.append('motherName', formData.motherName);
      formDataToSend.append('permanentAddress', formData.permanentAddress);
      formDataToSend.append('temporaryAddress', formData.temporaryAddress);
      formDataToSend.append('description', formData.description);

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      if (pdfFile) {
        formDataToSend.append('pdf', pdfFile);
      }

      const response = await axios({
        url: requestFormAPI.url,
        method: requestFormAPI.method,
        data: formDataToSend,
      });

      if (response.data.success === false) {
        throw new Error(response.data.message);
      }

      toast.success('Request form created successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        age: '',
        sex: '',
        email: '',
        fatherName: '',
        motherName: '',
        permanentAddress: '',
        temporaryAddress: '',
        description: '',
      });
      setImageFile(null);
      setPdfFile(null);
      if (imageInputRef.current) {
        imageInputRef.current.value = null;
      }
      if (pdfInputRef.current) {
        pdfInputRef.current.value = null;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to create request form');
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-tertiary">
        <div className="px-6 py-4 bg-secondary">
          <h2 className="text-xl font-semibold text-primary">Create New Student Request Form</h2>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div>
                <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-1">
                  Sex
                </label>
                <select
                  id="sex"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                  value={formData.sex}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select Sex
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
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

              <div>
                <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700 mb-1">
                  Father's Name
                </label>
                <input
                  type="text"
                  id="fatherName"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                  placeholder="Father's Name"
                  value={formData.fatherName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="motherName" className="block text-sm font-medium text-gray-700 mb-1">
                  Mother's Name
                </label>
                <input
                  type="text"
                  id="motherName"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                  placeholder="Mother's Name"
                  value={formData.motherName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="permanentAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Permanent Address
                </label>
                <input
                  type="text"
                  id="permanentAddress"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                  placeholder="Permanent Address"
                  value={formData.permanentAddress}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="temporaryAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Temporary Address
                </label>
                <input
                  type="text"
                  id="temporaryAddress"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                  placeholder="Temporary Address"
                  value={formData.temporaryAddress}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary focus:border-primary"
                  placeholder="Description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Student Image
                </label>
                <input
                  type="file"
                  id="image"
                  ref={imageInputRef}
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  onChange={handleImageChange}
                />
              </div>

              <div>
                <label htmlFor="pdf" className="block text-sm font-medium text-gray-700 mb-1">
                  Upload PDF
                </label>
                <input
                  type="file"
                  id="pdf"
                  ref={pdfInputRef}
                  accept="application/pdf"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  onChange={handlePdfChange}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-tertiary">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-4 py-2 border bg-error/60 hover:bg-error border-gray-300 rounded-lg text-gray-700 transitionisons"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary disabled:opacity-70 transition-colors"
              >
                {loading ? 'Creating...' : 'Create Request Form'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestForm;